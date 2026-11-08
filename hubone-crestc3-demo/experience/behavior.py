"""Offline, image-space behavior candidates from saved observations, never YOLO.

Rules are uncalibrated hypotheses. Candidate != verified human action. Missing
samples, invisible joints and ambiguous seated support remain explicit UNKNOWN.
"""
from collections import Counter
from copy import deepcopy
from dataclasses import asdict, dataclass, fields
from uuid import uuid4

from vision.pose_rules import PoseExperiments, PoseRuleConfig, _angle, _finite, _midpoint

RULE_VERSION='experience-behavior/image-rules-1.2.0'
BEHAVIORS=('ENTERING','EXITING','STATIONARY','WALKING','BENDING','RAISING_HAND',
           'SITTING','STANDING_UP','SQUATTING','UNKNOWN')
PRODUCT_INTERACTIONS=('APPROACH_PRODUCT','PICK_UP_PRODUCT','PUT_ON_PRODUCT','ADJUST_WEARABLE',
                      'WALK_WITH_PRODUCT','BEND_WITH_PRODUCT','REMOVE_WEARABLE','RETURN_PRODUCT')


@dataclass(frozen=True)
class BehaviorConfig(PoseRuleConfig):
    stationary_height_per_second: float = .025
    standing_knee_degrees: float = 160.0
    squat_max_knee_degrees: float = 75.0
    sitting_min_knee_degrees: float = 80.0
    sitting_max_knee_degrees: float = 130.0
    posture_transition_seconds: float = 3.0
    hip_transition_height: float = .10

    def __post_init__(self):
        if any(not _finite(value) or value<=0 for value in asdict(self).values()):
            raise ValueError('Behavior thresholds must be finite positive numbers')
        if not 0 < self.keypoint_confidence <= 1 or not isinstance(self.min_samples,int) or self.min_samples < 2:
            raise ValueError('Invalid visibility threshold or sample count')
        if self.stationary_height_per_second >= self.walking_height_per_second:
            raise ValueError('Stationary and walking thresholds require a deadband')
        if not self.squat_max_knee_degrees < self.sitting_min_knee_degrees < self.sitting_max_knee_degrees < self.standing_knee_degrees <= 180:
            raise ValueError('Posture angle ranges must be ordered and nonoverlapping')


def _status(value):
    return 'CANDIDATE' if value in ('CANDIDATE','OBSERVED') else 'NOT_OBSERVED' if value=='NOT_OBSERVED' else 'UNKNOWN'


def _source(session_id,source_ref):
    result=deepcopy(source_ref) if source_ref else {'kind':'unknown','session_id':session_id}
    if result.get('session_id',session_id)!=session_id:
        raise ValueError('Cross-session behavior source rejected')
    result['session_id']=session_id
    return result


class BehaviorEngine:
    def __init__(self, *, session_id, source_ref=None, config=None):
        self.session_id,self.source_ref=session_id,_source(session_id,source_ref)
        self.config=config if isinstance(config,BehaviorConfig) else BehaviorConfig(**(config or {}))
        values={field.name:getattr(self.config,field.name) for field in fields(PoseRuleConfig)}
        # Representation tolerance at temporal boundaries, not relaxed evidence rules.
        values['walking_window_seconds']+=1e-9
        values['walking_min_seconds']-=1e-9
        values['hold_seconds']-=1e-9
        base=PoseRuleConfig(**values)
        self.rules=PoseExperiments(base)
        self.states={};self.segment=0;self.last_time=None;self.last_mode=None

    def reset(self):
        self.rules.reset();self.states.clear()

    def _record(self,frame,track,label,status,measured,segment):
        timestamp=frame['timestamp']
        return {'behavior_id':uuid4().hex,'session_id':self.session_id,'track_id':str(track['track_id']),
            'segment_id':segment,'timestamp':timestamp,'start':timestamp,'end':timestamp,'label':label,
            'status':status,'method':'RULE_BASED','rule_version':RULE_VERSION,
            'thresholds':asdict(self.config),'measured':measured,'confidence':None,
            'verification_status':'NOT_VERIFIED','source_mode':frame.get('source_mode','UNKNOWN'),
            'coordinate_system':'IMAGE_PIXELS','floor_id':None,'cad_status':'NOT_CONNECTED',
            'provenance_id':frame.get('provenance_id'),'source_ref':deepcopy(self.source_ref),
            'evidence_refs':[{'observation_id':frame.get('observation_id'),'frame_index':frame.get('frame_index'),
                              'timestamp':timestamp,'source_ref':deepcopy(self.source_ref)}]}

    def _postures(self,state,timestamp,bbox,keypoints,track):
        cfg=self.config
        points={p.get('name'):p for p in keypoints if isinstance(p,dict)}
        point=lambda name:self.rules._point(points,name)
        names=[f'{side}_{joint}' for joint in ('shoulder','hip','knee','ankle') for side in ('left','right')]
        joints=[point(name) for name in names]
        unknown={'reason':'INSUFFICIENT_VISIBLE_BILATERAL_JOINTS'}
        if any(p is None for p in joints):
            state['standing']=state['sitting']=None;state['holds'].clear()
            return {label:('UNKNOWN',dict(unknown)) for label in ('SITTING','STANDING_UP','SQUATTING')}
        shoulder,hip,knee,ankle=[_midpoint(*joints[i:i+2]) for i in (0,2,4,6)]
        angles=[_angle(point(f'{side}_hip'),point(f'{side}_knee'),point(f'{side}_ankle')) for side in ('left','right')]
        if any(value is None for value in angles):
            state['standing']=state['sitting']=None;state['holds'].clear()
            return {label:('UNKNOWN',{'reason':'DEGENERATE_JOINT_GEOMETRY'}) for label in ('SITTING','STANDING_UP','SQUATTING')}
        height=bbox[3]-bbox[1]
        angle=sum(angles)/2
        base={'knee_angles_degrees':angles,'hip_y':hip[1],'knee_y':knee[1],
              'seat_support':track.get('seat_support'),'reason':'IMAGE_POSE_RULE_ONLY'}
        for key in ('standing','sitting'):
            if state.get(key) and timestamp-state[key][0]>cfg.posture_transition_seconds:state[key]=None
        standing=state.get('standing');sitting=state.get('sitting')
        seat_verified=track.get('seat_support')=='HUMAN_VERIFIED'
        drop=(hip[1]-standing[1])/((height+standing[2])/2) if standing else None
        rise=(sitting[1]-hip[1])/((height+sitting[2])/2) if sitting else None
        sits=(cfg.sitting_min_knee_degrees<=angle<=cfg.sitting_max_knee_degrees and drop>=cfg.hip_transition_height) if seat_verified and drop is not None else None
        rises=(min(angles)>=cfg.standing_knee_degrees and rise>=cfg.hip_transition_height) if seat_verified and rise is not None else None
        squats=max(angles)<=cfg.squat_max_knee_degrees and hip[1]>=knee[1]-.05*height
        result={}
        for label,key,predicate in [('SITTING','sit',sits),('STANDING_UP','rise',rises),('SQUATTING','squat',squats)]:
            status,held,count=self.rules._hold(state,key,predicate,timestamp)
            info={**base,'held_seconds':held,'samples':count,'hip_drop_heights':drop,'hip_rise_heights':rise}
            if label in ('SITTING','STANDING_UP') and not seat_verified:info['reason']='SEAT_SUPPORT_NOT_VERIFIED'
            elif predicate is None:info['reason']='PREVIOUS_POSTURE_NOT_OBSERVED'
            elif status=='PENDING':info['reason']='INSUFFICIENT_TEMPORAL_WINDOW'
            result[label]=(_status(status),info)
        if result['SITTING'][0]=='CANDIDATE':state['sitting']=(timestamp,hip[1],height)
        if min(angles)>=cfg.standing_knee_degrees:state['standing']=(timestamp,hip[1],height)
        return result

    def consume(self,frame):
        timestamp=frame.get('timestamp')
        if not _finite(timestamp) or timestamp<0:raise ValueError('Behavior frame timestamp must be finite session seconds')
        mode=frame.get('source_mode','UNKNOWN')
        if self.last_time is not None and (timestamp<=self.last_time or timestamp-self.last_time>self.config.max_gap_seconds or mode!=self.last_mode):self.reset()
        self.last_time,self.last_mode=timestamp,mode
        tracks=[track for track in frame.get('tracks',[]) if track.get('track_id') is not None]
        counts=Counter(str(track['track_id']) for track in tracks)
        active={tid for tid,count in counts.items() if count==1}
        self.rules.prune(active)
        self.states={tid:state for tid,state in self.states.items() if tid in active}
        records=[]
        for track in tracks:
            tid=str(track['track_id']);bbox=track.get('bbox',[])
            valid=counts[tid]==1 and isinstance(bbox,(list,tuple)) and len(bbox)==4 and all(_finite(v) for v in bbox) and bbox[2]>bbox[0] and bbox[3]>bbox[1]
            if tid not in self.states:
                self.segment+=1;self.states[tid]={'segment':f'{tid}:{self.segment}','holds':{},'standing':None,'sitting':None}
            state=self.states[tid]
            if not valid:
                self.rules.prune(active-{tid});self.states.pop(tid,None)
                records.extend(self._record(frame,track,label,'UNKNOWN',{'reason':'INVALID_OR_AMBIGUOUS_TRACK'},state['segment']) for label in BEHAVIORS)
                continue
            keypoints=track.get('keypoints') or []
            roi=track.get('inside_zone')
            result=self.rules.observe(tid,timestamp,bbox,keypoints,roi)
            values=result['statuses'];criteria=result['measured_criteria']
            previous=criteria['entry']['previous_inside_roi']
            exit_status='UNKNOWN' if not isinstance(roi,bool) or previous is None else 'CANDIDATE' if previous and not roi else 'NOT_OBSERVED'
            output={'ENTERING':(_status(values['entry']),criteria['entry']),
                    'EXITING':(exit_status,{'previous_inside_roi':previous,'inside_roi':roi}),
                    'WALKING':(_status(values['walking']),criteria['walking']),
                    'BENDING':(_status(values['bending']),criteria['bending']),
                    'RAISING_HAND':(_status(values['hand_raise']),criteria['hand_raise'])}
            speed=criteria['walking'].get('normalized_speed')
            stationary='UNKNOWN' if speed is None else 'CANDIDATE' if speed<=self.config.stationary_height_per_second else 'NOT_OBSERVED' if speed>=self.config.walking_height_per_second else 'UNKNOWN'
            output['STATIONARY']=(stationary,{'normalized_speed':speed,'reason':'INSUFFICIENT_TEMPORAL_WINDOW_OR_VISIBILITY' if speed is None else 'IMAGE_MOTION_ONLY_NOT_ROI_DWELL'})
            if speed is not None and self.config.stationary_height_per_second<speed<self.config.walking_height_per_second:
                output['WALKING']=('UNKNOWN',{**criteria['walking'],'reason':'MOTION_THRESHOLD_DEADBAND'})
            output.update(self._postures(state,timestamp,bbox,keypoints,track))
            unknown=[label for label,(status,_) in output.items() if status=='UNKNOWN']
            output['UNKNOWN']=('UNKNOWN' if unknown else 'NOT_OBSERVED',{'unknown_behaviors':unknown,'history_reset':result.get('history_reset')})
            records.extend(self._record(frame,track,label,*output[label],state['segment']) for label in BEHAVIORS)
        return records


def analyze_behaviors(frames, *, session_id, source_ref=None, config=None):
    engine=BehaviorEngine(session_id=session_id,source_ref=source_ref,config=config)
    return [record for frame in frames for record in engine.consume(frame)]


def analyze_product_interactions(frames, *, session_id, source_ref=None):
    engine=BehaviorEngine(session_id=session_id,source_ref=source_ref)
    return [engine._record(frame,track,label,'UNKNOWN',
            {'reason':'PRODUCT_VISIBILITY_AND_TEMPORAL_INTERACTION_EVIDENCE_NOT_CONNECTED'},str(track['track_id']))
            for frame in frames for track in frame.get('tracks',[]) for label in PRODUCT_INTERACTIONS]

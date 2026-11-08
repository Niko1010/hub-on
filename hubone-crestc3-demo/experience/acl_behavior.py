"""ACL-specific, uncalibrated candidates over existing image-space observations.

This module never loads a model or recognizes a brace. A wrist near a knee in a
2D image does not establish contact, strap adjustment, or successful wearing.
"""
from collections import Counter
from copy import deepcopy
from dataclasses import asdict, dataclass
import math

from experience.behavior import BehaviorConfig, BehaviorEngine, _status
from vision.pose_rules import _angle

ACL_RULE_VERSION='acl-image-candidates/1.0.0'
ACL_LABELS=('STANDING_POSTURE','SEATED_POSTURE','HAND_KNEE_PROXIMITY',
            'REPEATED_HAND_KNEE_INTERACTION')
LIMITATIONS=[
    'RULE_BASED / NOT_VERIFIED: uncalibrated image-space candidates, not a trained action model.',
    '2D wrist-knee proximity does not establish physical contact or brace manipulation.',
    'Repeated proximity is not verified repeated strap adjustment or a product problem.',
    'Seated/standing pose does not verify seat support, successful wearing, balance or safety.',
    'Candidate intervals span supporting samples only; they do not complete research stages.',
    'Occlusion, low-confidence joints, Track changes and sample gaps remain UNKNOWN.',
    'No extra YOLO inference; original observations, evidence and CAD remain unchanged.',
]


@dataclass(frozen=True)
class ACLBehaviorConfig(BehaviorConfig):
    hand_knee_max_height: float = .18
    seated_hip_knee_vertical_height: float = .15
    repeat_window_seconds: float = 30.0
    repeat_min_episodes: int = 2
    contact_release_seconds: float = .4

    def __post_init__(self):
        super().__post_init__()
        if not isinstance(self.repeat_min_episodes,int) or isinstance(self.repeat_min_episodes,bool) or self.repeat_min_episodes<2:
            raise ValueError('Repeated proximity requires at least two distinct episodes')


class ACLBehaviorEngine:
    def __init__(self, *, session_id, source_ref=None, config=None):
        self.config=config if isinstance(config,ACLBehaviorConfig) else ACLBehaviorConfig(**(config or {}))
        self.base=BehaviorEngine(session_id=session_id,source_ref=source_ref,config=self.config)
        self.states={}

    def _held(self,state,key,predicate,timestamp):
        status,held,count=self.base.rules._hold(state,key,predicate,timestamp)
        return _status(status),{'held_seconds':held,'samples':count,
            'required_seconds':self.config.hold_seconds,'minimum_samples':self.config.min_samples}

    def _posture(self,state,timestamp,bbox,points):
        cfg=self.config
        point=lambda name:self.base.rules._point(points,name)
        names=[f'{side}_{joint}' for side in ('left','right') for joint in ('shoulder','hip','knee','ankle')]
        joints={name:point(name) for name in names}
        angle=[];standing=seated=None
        if all(p is not None for p in joints.values()):
            angle=[_angle(joints[f'{side}_hip'],joints[f'{side}_knee'],joints[f'{side}_ankle']) for side in ('left','right')]
            if all(value is not None for value in angle):
                height=bbox[3]-bbox[1]
                standing=min(angle)>=cfg.standing_knee_degrees and all(
                    joints[f'{s}_shoulder'][1]<joints[f'{s}_hip'][1]<joints[f'{s}_knee'][1]<joints[f'{s}_ankle'][1]
                    for s in ('left','right'))
                seated=all(cfg.sitting_min_knee_degrees<=value<=cfg.sitting_max_knee_degrees for value in angle) and all(
                    abs(joints[f'{s}_hip'][1]-joints[f'{s}_knee'][1])/height<=cfg.seated_hip_knee_vertical_height
                    and joints[f'{s}_shoulder'][1]<joints[f'{s}_hip'][1]
                    and joints[f'{s}_ankle'][1]>joints[f'{s}_knee'][1] for s in ('left','right'))
        result={}
        for label,predicate in [('STANDING_POSTURE',standing),('SEATED_POSTURE',seated)]:
            status,measured=self._held(state,label,predicate,timestamp)
            measured.update(knee_angles_degrees=angle,seat_support_verified=False,
                reason='INSUFFICIENT_VISIBLE_JOINTS_OR_DEGENERATE_POSE' if predicate is None else 'IMAGE_POSTURE_NOT_WEARING_VERIFICATION')
            result[label]=(status,measured)
        return result

    def _hands(self,state,timestamp,bbox,points):
        cfg=self.config
        joints={name:self.base.rules._point(points,name)
                for name in ('left_wrist','right_wrist','left_knee','right_knee')}
        if any(p is None for p in joints.values()):
            for key in tuple(state['holds']):
                if key.startswith('hand:'):state['holds'].pop(key)
            state.update(episodes=[],contact_active=False,release=None)
            return {label:('UNKNOWN',{'reason':'INSUFFICIENT_VISIBLE_WRISTS_OR_KNEES',
                'physical_contact_verified':False,'brace_interaction_verified':False}) for label in ACL_LABELS[2:]}
        pairs=[];height=bbox[3]-bbox[1]
        for hand in ('left_wrist','right_wrist'):
            for knee in ('left_knee','right_knee'):
                distance=math.dist(joints[hand],joints[knee])/height
                status,info=self._held(state,'hand:'+hand+':'+knee,distance<=cfg.hand_knee_max_height,timestamp)
                pairs.append({'hand':hand,'knee':knee,'distance_bbox_heights':distance,'status':status,**info})
        candidates=[p for p in pairs if p['status']=='CANDIDATE']
        near=any(p['distance_bbox_heights']<=cfg.hand_knee_max_height for p in pairs)
        status='CANDIDATE' if candidates else 'UNKNOWN' if near else 'NOT_OBSERVED'
        state['episodes']=[t for t in state['episodes'] if timestamp-t<=cfg.repeat_window_seconds]
        if candidates:
            if not state['contact_active']:
                state['episodes'].append(timestamp)
                state['contact_active']=True
            state['release']=None
        elif not near:
            since,count=state.get('release') or (timestamp,0)
            state['release']=(since,count+1)
            if timestamp-since>=cfg.contact_release_seconds and count+1>=2:
                state['contact_active']=False
        else:
            state['release']=None
        repeated='CANDIDATE' if candidates and len(state['episodes'])>=cfg.repeat_min_episodes else 'UNKNOWN'
        shared={'physical_contact_verified':False,'brace_interaction_verified':False,
            'distance_threshold_bbox_heights':cfg.hand_knee_max_height,'pairs':pairs}
        return {'HAND_KNEE_PROXIMITY':(status,{**shared,'reason':'TWO_DIMENSIONAL_PROXIMITY_ONLY' if candidates else 'INSUFFICIENT_HOLD' if near else 'VISIBLE_JOINTS_OUTSIDE_THRESHOLD'}),
                'REPEATED_HAND_KNEE_INTERACTION':(repeated,{**shared,'distinct_episode_count':len(state['episodes']),
                    'episode_candidate_times':list(state['episodes']),'window_seconds':cfg.repeat_window_seconds,
                    'required_observed_release_seconds':cfg.contact_release_seconds,
                    'reason':'REPEATED_PROXIMITY_NOT_VERIFIED_ADJUSTMENT' if repeated=='CANDIDATE' else 'INSUFFICIENT_DISTINCT_VISIBLE_EPISODES'})}

    def consume(self,frame):
        rows=self.base.consume(frame)
        seed={r['track_id']:r for r in rows if r['label']=='UNKNOWN'}
        self.states={tid:s for tid,s in self.states.items()
                     if tid in self.base.states and s['segment']==self.base.states[tid]['segment']}
        counts=Counter(str(t['track_id']) for t in frame.get('tracks',[]) if t.get('track_id') is not None)
        tracks={str(t['track_id']):t for t in frame.get('tracks',[]) if t.get('track_id') is not None}
        for tid,track in tracks.items():
            if tid not in seed:continue
            original=seed[tid]
            valid=tid in self.base.states and counts[tid]==1
            points={p.get('name'):p for p in (track.get('keypoints') or []) if isinstance(p,dict)}
            if not valid:
                values={label:('UNKNOWN',{'reason':'INVALID_OR_AMBIGUOUS_TRACK'}) for label in ACL_LABELS}
            else:
                state=self.states.setdefault(tid,{'segment':original['segment_id'],'holds':{},'episodes':[],
                                                   'contact_active':False,'release':None})
                values=self._posture(state,frame['timestamp'],track['bbox'],points)
                values.update(self._hands(state,frame['timestamp'],track['bbox'],points))
            for label,(status,measured) in values.items():
                record=self.base._record(frame,track,label,status,measured,original['segment_id'])
                record.update(rule_version=ACL_RULE_VERSION,thresholds=asdict(self.config),
                              product_identification='NOT_CONNECTED',wearing_success='NOT_VERIFIED')
                rows.append(record)
        for record in rows:
            for ref in record['evidence_refs']:
                if frame.get('evidence_ref'):ref['evidence_ref']=frame['evidence_ref']
                if frame.get('frame_url'):ref['frame_url']=frame['frame_url']
        return rows


def candidate_intervals(predictions, *, max_gap_seconds=1.5):
    """Do not bridge UNKNOWN, missing Track segments or gaps; no tail extrapolation."""
    intervals=[];active={}
    for row in predictions:
        key=(row['track_id'],row['segment_id'],row['label'])
        if row['status']!='CANDIDATE':
            active.pop(key,None)
            continue
        previous=active.get(key)
        if previous is None or not 0<row['timestamp']-previous['end']<=max_gap_seconds:
            previous={'track_id':row['track_id'],'segment_id':row['segment_id'],'label':row['label'],
                'status':'CANDIDATE','method':'RULE_BASED','verification_status':'NOT_VERIFIED',
                'start':row['timestamp'],'end':row['timestamp'],'duration_seconds':0.0,'sample_count':0,
                'source_ref':deepcopy(row['source_ref']),'evidence_refs':[],
                'duration_basis':'SUPPORTING_SAMPLE_SPAN_NOT_STUDY_STAGE_COMPLETION'}
            intervals.append(previous);active[key]=previous
        previous['end']=row['timestamp']
        previous['duration_seconds']=round(previous['end']-previous['start'],6)
        previous['sample_count']+=1
        previous['evidence_refs'].extend(deepcopy(row['evidence_refs']))
    return intervals


def analyze_acl_behaviors(frames, *, session_id, source_ref=None, config=None):
    engine=ACLBehaviorEngine(session_id=session_id,source_ref=source_ref,config=config)
    predictions=[row for frame in frames for row in engine.consume(frame)]
    return {'method':'RULE_BASED','verification_status':'NOT_VERIFIED','rule_version':ACL_RULE_VERSION,
        'model_inference_executed':False,'existing_model_observations_reused':True,
        'coordinate_system':'IMAGE_PIXELS','floor_id':None,'cad_status':'NOT_CONNECTED',
        'predictions':predictions,'intervals':candidate_intervals(predictions,max_gap_seconds=engine.config.max_gap_seconds),
        'candidate_sample_counts':dict(Counter(r['label'] for r in predictions if r['status']=='CANDIDATE')),
        'unknown_sample_counts':dict(Counter(r['label'] for r in predictions if r['status']=='UNKNOWN')),
        'wearing_success':'NOT_VERIFIED','limitations':list(LIMITATIONS)}

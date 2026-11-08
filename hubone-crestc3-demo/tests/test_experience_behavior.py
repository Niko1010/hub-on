"""Synthetic geometry tests, never a real-world behavior accuracy benchmark."""
import importlib.util
import json
from pathlib import Path
from types import SimpleNamespace

import numpy as np
import pytest

from experience.behavior import (BEHAVIORS,BehaviorConfig,analyze_behaviors,
                                analyze_product_interactions)


def points(dx=0,raised=False,bent=False,posture='standing',hidden=()):
    values={}
    for side,x in [('left',40),('right',60)]:
        values.update({side+'_shoulder':(x+(35 if bent else 0),100 if bent else 60),
            side+'_hip':(x,110),side+'_knee':(x,150),side+'_ankle':(x,190),
            side+'_wrist':(x,30 if raised else 100)})
        if posture=='sitting':
            values.update({side+'_hip':(x,145),side+'_knee':(x+30,145),side+'_ankle':(x+30,190)})
        if posture=='squatting':
            values.update({side+'_hip':(x,165),side+'_knee':(x+30,160),side+'_ankle':(x,190)})
    return [{'name':name,'x':x+dx,'y':y,'confidence':.95,'visible':name not in hidden} for name,(x,y) in values.items()]


def frame(t,*,pose=None,inside=True,track='7',seat=None):
    return {'timestamp':t,'frame_index':int(t*25),'observation_id':int(t*25)+1,
        'source_mode':'REAL_RECORDING','provenance_id':'model-snapshot',
        'tracks':[{'track_id':track,'bbox':[0,0,120,200],'keypoints':points() if pose is None else pose,
                   'inside_zone':inside,'seat_support':seat}]}


def analyze(frames):
    return analyze_behaviors(frames,session_id='test-session',source_ref={
        'kind':'recording','session_id':'test-session','asset_id':'asset','run_id':'run'})


def status(rows,label,t):
    return next(row for row in rows if row['label']==label and row['timestamp']==t)['status']


def test_roi_transitions_require_observed_boundary_and_missing_track_resets():
    frames=[frame(0),frame(.4,inside=False),frame(.8),frame(1.2,inside=False),
            {**frame(1.6),'tracks':[]},frame(2)]
    rows=analyze(frames)
    assert status(rows,'ENTERING',0)=='UNKNOWN'
    assert status(rows,'ENTERING',.8)=='CANDIDATE'
    assert status(rows,'EXITING',1.2)=='CANDIDATE'
    assert status(rows,'ENTERING',2)=='UNKNOWN'
    assert status(rows,'EXITING',2)=='UNKNOWN'
    assert rows[0]['segment_id']!=rows[-1]['segment_id']
    assert all(row['method']=='RULE_BASED' and row['verification_status']=='NOT_VERIFIED' for row in rows)
    assert rows[0]['evidence_refs'][0]=={'observation_id':1,'frame_index':0,'timestamp':0,
        'source_ref':{'kind':'recording','session_id':'test-session','asset_id':'asset','run_id':'run'}}


def test_dwell_is_not_stationary_and_low_motion_requires_valid_temporal_window():
    moving=analyze([frame(t,pose=points(dx=t*30)) for t in (0,.4,.8,1.2,1.6,2,2.4,2.8,3.2,3.6,4,4.4,4.8,5.2)])
    assert status(moving,'WALKING',5.2)=='CANDIDATE'
    assert status(moving,'STATIONARY',5.2)=='NOT_OBSERVED'
    still=analyze([frame(t) for t in (0,.4,.8)])
    assert status(still,'STATIONARY',0)=='UNKNOWN'
    assert status(still,'STATIONARY',.8)=='CANDIDATE'


def test_missing_joints_and_observation_gap_do_not_become_negative_or_continuous_action():
    rows=analyze([frame(0,pose=points(raised=True)),frame(.3,pose=points(raised=True)),
        frame(.7,pose=points(raised=True)),frame(3,pose=points(raised=True)),frame(3.3,pose=[])])
    assert status(rows,'RAISING_HAND',.7)=='CANDIDATE'
    assert status(rows,'RAISING_HAND',3)=='UNKNOWN'
    assert all(status(rows,label,3.3)=='UNKNOWN' for label in ('WALKING','BENDING','RAISING_HAND','STATIONARY'))
    json.dumps(rows,allow_nan=False)


def test_visible_bending_and_deep_squat_require_sustained_pose():
    bend=analyze([frame(t,pose=points(bent=True)) for t in (0,.3,.7)])
    squat=analyze([frame(t,pose=points(posture='squatting')) for t in (0,.3,.7)])
    assert status(bend,'BENDING',.7)=='CANDIDATE'
    assert status(squat,'SQUATTING',0)=='UNKNOWN'
    assert status(squat,'SQUATTING',.7)=='CANDIDATE'


def test_sit_and_stand_transitions_need_explicit_verified_seat_support():
    sequence=[frame(0)]+[frame(t,pose=points(posture='sitting')) for t in (.3,.6,.9)]+[frame(t) for t in (1.2,1.5,1.9)]
    unverified=analyze(sequence)
    assert status(unverified,'SITTING',.9)=='UNKNOWN'
    assert status(unverified,'STANDING_UP',1.9)=='UNKNOWN'
    for sample in sequence:sample['tracks'][0]['seat_support']='HUMAN_VERIFIED'
    verified=analyze(sequence)
    assert status(verified,'SITTING',.9)=='CANDIDATE'
    assert status(verified,'STANDING_UP',1.9)=='CANDIDATE'


def test_product_interactions_never_follow_from_pose_alone_and_invalid_input_is_explicit():
    rows=analyze_product_interactions([frame(0)],session_id='test-session')
    assert len(rows)==8 and all(row['status']=='UNKNOWN' and row['confidence'] is None for row in rows)
    malformed=frame(0);malformed['timestamp']=float('nan')
    with pytest.raises(ValueError):analyze([malformed])
    with pytest.raises(ValueError):BehaviorConfig(stationary_height_per_second=.2)
    with pytest.raises(ValueError):analyze_behaviors([frame(0)],session_id='one',source_ref={'kind':'live','session_id':'two'})
    invalid=frame(0);invalid['tracks'][0]['bbox']=None
    assert len(analyze([invalid]))==len(BEHAVIORS)


def test_recording_serializes_existing_pose_after_crop_translation_without_extra_inference(tmp_path,monkeypatch):
    staged=Path(__file__).parents[1]/'vision/pipeline.py'
    if staged.exists():
        spec=importlib.util.spec_from_file_location('staged_recording_pipeline',staged)
        pipeline=importlib.util.module_from_spec(spec);spec.loader.exec_module(pipeline)
    else:
        from vision import pipeline
    from retailvision.config import ActivityConfig
    from retailvision.cv.pose import PoseResult
    counts={'detector':0,'pose':0}
    monkeypatch.setattr(pipeline,'probe_video',lambda _:SimpleNamespace(width=40,height=30,fps=2,duration_seconds=1,frame_count=2))
    class Capture:
        count=0
        def read(self):
            self.count+=1
            return (True,np.zeros((30,40,3),np.uint8)) if self.count<=2 else (False,None)
        def release(self):pass
    class Detector:
        device='cpu'
        def detect(self,frame):counts['detector']+=1;return []
        def unload(self):pass
    class Pose:
        device='cpu'
        def estimate(self,crops):
            counts['pose']+=1
            confidence=np.full(17,.9,np.float32);confidence[1]=.1
            return [PoseResult(xy=np.full((17,2),2,np.float32),confidence=confidence,crop_width=8,crop_height=17)]
        def unload(self):pass
    class Tracker:
        def update(self,detections,index):return [SimpleNamespace(bbox=(4,3,12,20),confidence=.9,local_track_id=7)]
    monkeypatch.setattr(pipeline,'build_vision',lambda *args:(Detector(),Pose(),Tracker(),ActivityConfig()))
    monkeypatch.setattr(pipeline.cv2,'VideoCapture',lambda _:Capture())
    pipeline.analyze_video(tmp_path/'input.mp4','sid','aid',tmp_path/'frames',recording_mode='REAL_RECORDING')
    doc=json.loads((tmp_path/'frames/observations.json').read_text())
    assert counts=={'detector':2,'pose':2}
    points_out=doc['frames'][0]['tracks'][0]['keypoints']
    assert len(points_out)==17
    assert points_out[0]['name']=='nose' and points_out[0]['x']==6 and points_out[0]['y']==5
    assert points_out[1]['visible'] is False and points_out[1]['x'] is None
    assert doc['frames'][0]['tracks'][0]['pose_status']=='AVAILABLE'

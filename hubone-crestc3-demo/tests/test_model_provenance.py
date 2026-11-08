import hashlib
import json
from pathlib import Path
from types import SimpleNamespace

import pytest

from vision.model_provenance import capture_model_provenance


def fake_detector(weights=None):
    config=SimpleNamespace(weights=weights,device='cuda',imgsz=480,confidence=.35,
                           iou=.45,max_detections=100,batch=1,person_class_id=0,half=True)
    module=SimpleNamespace(parameters=lambda:iter([SimpleNamespace(device='cpu')]))
    args=SimpleNamespace(imgsz=512,conf=.42,iou=.5,max_det=80,batch=1,half=False,classes=[0])
    model=SimpleNamespace(model=module,ckpt={'version':'8.3.17'},predictor=SimpleNamespace(args=args))
    torch=SimpleNamespace(get_num_threads=lambda:3,version=SimpleNamespace(cuda='12.8'))
    return SimpleNamespace(weights=weights,config=config,_model=model,_torch=torch,
                           device='cuda',half=False,fallback_reason='CUDA_UNAVAILABLE')


def test_snapshot_uses_actual_runtime_values_and_caches_loaded_model_hash(tmp_path,monkeypatch):
    weights=tmp_path/'private-model.pt'
    weights.write_bytes(b'loaded-checkpoint')
    detector=fake_detector(weights)
    detector.password='must-not-appear'
    detector.config.secret='must-not-appear'
    reads=[]
    original=Path.open
    def opened(path,*args,**kwargs):
        if path==weights and args and args[0]=='rb':reads.append(path)
        return original(path,*args,**kwargs)
    monkeypatch.setattr(Path,'open',opened)
    first=capture_model_provenance(detector,2,25)
    weights.write_bytes(b'replaced-on-disk-but-not-reloaded')
    detector.config.confidence=.9
    second=capture_model_provenance(detector,2,25)
    assert len(reads)==1
    assert first['weights_sha256']==second['weights_sha256']==hashlib.sha256(b'loaded-checkpoint').hexdigest()
    assert first['provenance_id']!=second['provenance_id']
    assert first['requested_device']=='cuda' and first['actual_device']=='cpu'
    assert first['inference_parameters']['conf']==.42
    assert first['inference_parameters']['imgsz']==512 and first['inference_parameters']['half'] is False
    assert first['cpu_threads']==3 and first['model_version']=='8.3.17'
    assert 'framework metadata' in first['model_version_source']
    assert first['sampling']=={'sample_fps':2,'source_fps':25}
    encoded=json.dumps(first,allow_nan=False)
    assert str(tmp_path) not in encoded and 'must-not-appear' not in encoded
    fresh=capture_model_provenance(fake_detector(weights),2,25)
    assert len(reads)==2 and fresh['weights_sha256']!=first['weights_sha256']


def test_missing_metadata_is_unknown_and_does_not_invent_checkpoint_version():
    snapshot=capture_model_provenance(SimpleNamespace(device='cpu'),2)
    assert snapshot['model_version']=='unknown'
    assert snapshot['model_version_source']=='unknown'
    assert snapshot['weights_sha256'] is None and snapshot['weights_hash_status']=='UNAVAILABLE'
    assert snapshot['actual_device']=='cpu' and snapshot['requested_device']=='cpu'
    assert snapshot['requested_device_source']=='resolved_device_fallback'
    assert snapshot['sampling']['source_fps'] is None
    json.dumps(snapshot,allow_nan=False)


def test_session_read_merges_optional_live_provenance_without_changing_session_storage(client,sid):
    before=client.get(f'/api/sessions/{sid}').json()
    assert 'vision_provenance' not in before
    stored=client.app.state.store.session(sid)
    snapshot=capture_model_provenance(fake_detector(),2)
    client.app.state.live_manager.live.save({'session_id':sid,'status':'STOPPED',
        'vision_provenance':snapshot,'vision_provenance_history':[snapshot]})
    after=client.get(f'/api/sessions/{sid}').json()
    assert after['vision_provenance']==snapshot
    assert after['vision_provenance_history']==[snapshot]
    assert {k:v for k,v in after.items() if k not in ('vision_provenance','vision_provenance_history')}==before
    assert client.app.state.store.session(sid)==stored
    other=client.post('/api/sessions',json={}).json()['session_id']
    assert 'vision_provenance' not in client.get(f'/api/sessions/{other}').json()
    assert client.get('/api/sessions/not-a-session').status_code==404


@pytest.mark.parametrize('has_people',[True,False])
def test_recording_captures_after_successful_predict_once_and_references_every_sample(tmp_path,monkeypatch,has_people):
    import numpy as np
    from retailvision.config import ActivityConfig
    from vision import pipeline
    calls={'detect':0,'pose':0,'provenance':0}
    monkeypatch.setattr(pipeline,'probe_video',lambda _:SimpleNamespace(width=40,height=30,fps=2,duration_seconds=1.5,frame_count=3))
    class Capture:
        index=0
        def read(self):
            self.index+=1
            return (True,np.zeros((30,40,3),np.uint8)) if self.index<=3 else (False,None)
        def release(self):pass
    class Detector:
        device='cpu'
        def detect(self,frame):calls['detect']+=1;return []
        def unload(self):pass
    class Pose:
        device='cpu'
        def estimate(self,crops):calls['pose']+=1;return [None]
        def unload(self):pass
    class Tracker:
        def update(self,detections,index):
            if not has_people or index==1:return []
            return [SimpleNamespace(bbox=(4,3,12,20),confidence=.9,local_track_id=7)]
    def snapshot(*args):
        assert calls['detect']>=1
        if isinstance(args[0],Pose):assert calls['pose']>=1
        calls['provenance']+=1
        return capture_model_provenance(*args)
    monkeypatch.setattr(pipeline,'capture_model_provenance',snapshot)
    monkeypatch.setattr(pipeline,'build_vision',lambda *args:(Detector(),Pose(),Tracker(),ActivityConfig()))
    monkeypatch.setattr(pipeline.cv2,'VideoCapture',lambda _:Capture())
    monkeypatch.setenv('VISION_SAMPLE_FPS','2')
    events,stats=pipeline.analyze_video(tmp_path/'input.mp4','session','asset',tmp_path/'frames',recording_mode='REAL_RECORDING')
    document=json.loads((tmp_path/'frames/observations.json').read_text())
    assert calls=={'detect':3,'pose':2 if has_people else 0,'provenance':2 if has_people else 1}
    assert document['vision_provenance']==stats['vision_provenance']
    provenance_id=stats['vision_provenance']['provenance_id']
    assert bool(events)==has_people
    assert all(e.metadata['provenance_id']==provenance_id for e in events)
    assert len(document['frames'])==3 and all(f['provenance_id']==provenance_id for f in document['frames'])
    assert document['recording_mode']=='REAL_RECORDING' and document['cad_status']=='NOT_CONNECTED'

    assert document['pose_provenance']==stats['pose_provenance']
    if has_people:
        pose_id=stats['pose_provenance']['provenance_id']
        assert pose_id!=provenance_id
        assert [f['pose_provenance_id'] for f in document['frames']]==[pose_id,None,pose_id]
        assert all(e.metadata['pose_provenance_id']==(pose_id if e.event_type=='activity_unknown' else None) for e in events)
    else:
        assert stats['pose_provenance'] is None
        assert all(f['pose_provenance_id'] is None for f in document['frames'])


def test_crop_pose_effective_predictor_parameters_without_detector_config():
    pose=fake_detector()
    del pose.config
    pose.device='cpu'
    pose._model.predictor.args.imgsz=256
    pose._model.predictor.args.conf=.3
    snapshot=capture_model_provenance(pose,2,25)
    assert snapshot['requested_device']=='cpu'
    assert snapshot['requested_device_source']=='resolved_device_fallback'
    assert snapshot['inference_parameters']['imgsz']==256
    assert snapshot['inference_parameters']['conf']==.3

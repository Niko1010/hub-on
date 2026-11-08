import json
import time
from types import SimpleNamespace

import numpy as np
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from backend.live import create_live_router
from database.store import Store
from vision.live import CaptureLease, LiveManager, utc


class FakeSource:
    def __init__(self, sequence):
        self.sequence=iter(sequence)
        self.index=0
        self.closed=False

    def read(self, timeout=.5):
        time.sleep(.11)
        value=next(self.sequence,None)
        if value is None:return None
        if value=='disconnect':return {'kind':'disconnected'}
        epoch,person=value
        self.index+=1
        frame=np.zeros((80,100,3),np.uint8)
        frame[0,0,0]=person
        return {'kind':'frame','frame':frame,'frame_index':self.index,'connection_epoch':epoch,
                'captured_monotonic':time.monotonic(),'captured_at':utc(),
                'source_fps':25,'reported_fps':25}

    def close(self):self.closed=True


class FakeModel:
    def __init__(self):self.calls=0;self.unloaded=False
    def detect(self, frame):self.calls+=1;return bool(frame[0,0,0])
    def unload(self):self.unloaded=True


class FakeTracker:
    def update(self, detections, index):
        return [SimpleNamespace(local_track_id=1,bbox=(10,10,40,60),confidence=.9)] if detections else []
    def reset(self):pass


def wait_for(fn,timeout=6):
    deadline=time.monotonic()+timeout
    while time.monotonic()<deadline:
        if fn():return
        time.sleep(.03)
    raise AssertionError('condition timed out')


def setup_manager(tmp_path,monkeypatch,sequence):
    monkeypatch.setenv('HUBONE_LIVE_SAMPLE_FPS','10')
    monkeypatch.setattr('vision.live.subprocess.run',lambda *args,**kwargs: (_ for _ in ()).throw(FileNotFoundError()))
    store=Store(tmp_path)
    sources=[];models=[]
    def source_factory():
        source=FakeSource(sequence);sources.append(source);return source
    def factory(*args):
        detector=FakeModel();pose=FakeModel();models.append((detector,pose))
        return detector,pose,FakeTracker(),None
    manager=LiveManager(store,source_factory,factory,lambda:True)
    return manager,store,sources,models


def test_live_observations_reuse_single_inference_and_preserve_gaps(tmp_path,monkeypatch):
    manager,store,sources,models=setup_manager(tmp_path,monkeypatch,[(1,1),(1,1),(1,0),(1,1),'disconnect',(2,1)])
    start=manager.start();sid=start['session_id']
    try:
        wait_for(lambda:manager.status()['metrics'].get('sampled_frames')==5)
    finally:
        manager.shutdown()
    state=manager.status()
    assert state['status']=='STOPPED' and state['ended_at']
    assert sources[0].closed and all(m.unloaded for m in models[0])
    assert models[0][0].calls==5
    items=manager.live.observations(sid,0,100)['items']
    assert len(items)==5 and items[2]['tracks']==[]
    ids=[f['tracks'][0]['track_id'] if f['tracks'] else None for f in items]
    assert ids[0]==ids[1] and ids[3]!=ids[1] and ids[4]!=ids[3]
    assert all(i['floor_id'] is None and i['coordinate_system']=='IMAGE_PIXELS' for i in items)
    assert all(b['timestamp']>a['timestamp'] for a,b in zip(items,items[1:]))
    events=store.events(sid)
    assert events and all(e['metadata']['recording_mode']=='LIVE' and not e['metadata']['simulated'] for e in events)
    assert not any(e['event_type']=='zone_exit' for e in events)
    assert state['metrics']['observation_count']==4
    assert state['metrics']['reconnect_count']==1
    assert all((tmp_path/'live_frames'/sid/f['snapshot']).is_file() for f in items)


def test_restart_creates_new_session_and_global_lock_prevents_other_owner(tmp_path,monkeypatch):
    manager,store,_,_=setup_manager(tmp_path,monkeypatch,[(1,1)])
    first=manager.start()['session_id']
    wait_for(lambda:manager.status()['status']=='LIVE')
    other=LiveManager(store,configuration_check=lambda:True)
    try:
        with pytest.raises(ValueError,match='owned by another'):other.start()
        assert manager.live.session(first)['status']=='LIVE'
        with pytest.raises(ValueError,match='already active'):manager.start()
        assert len(store.sessions())==1
    finally:manager.shutdown()
    second=manager.start()['session_id']
    assert second!=first
    manager.shutdown()
    assert len(store.sessions())==2


def test_missing_credentials_does_not_create_session(tmp_path):
    store=Store(tmp_path)
    manager=LiveManager(store,configuration_check=lambda:False)
    with pytest.raises(ValueError,match='NOT CONNECTED'):manager.start()
    assert store.sessions()==[]
    assert manager.status()['status']=='NOT_CONNECTED'


def test_live_router_pagination_session_isolation_and_no_credential_leak(tmp_path,monkeypatch):
    monkeypatch.delenv('HUBONE_RTSP_USERNAME',raising=False)
    monkeypatch.delenv('HUBONE_RTSP_PASSWORD',raising=False)
    store=Store(tmp_path);router,manager=create_live_router(store)
    manager.configuration_check=lambda:False
    app=FastAPI();app.include_router(router)
    with TestClient(app) as client:
        assert client.post('/api/live/start').status_code==409
        assert client.get('/api/live/sessions').json()=={'items':[]}
        assert client.get('/api/live/sessions/other').status_code==404
        assert client.get('/api/live/sessions/other/observations').status_code==404
        assert client.get('/api/live/sessions/other/frames/000000000001.jpg').status_code==404
        state=client.get('/api/live/status').json()
        assert state['credentials_configured'] is False
        assert state['cad_status']=='NOT_CONNECTED'
        assert 'rtsp://' not in json.dumps(state)


@pytest.mark.parametrize('failure_point',['create_session','save_state','start_thread'])
def test_start_failure_releases_camera_lease(tmp_path,monkeypatch,failure_point):
    manager,store,sources,_=setup_manager(tmp_path,monkeypatch,[])
    def fail(*args,**kwargs):raise RuntimeError('injected startup failure')
    if failure_point=='create_session':monkeypatch.setattr(store,'create_session',fail)
    elif failure_point=='save_state':monkeypatch.setattr(manager.live,'save',fail)
    else:monkeypatch.setattr('vision.live.threading.Thread.start',fail)
    with pytest.raises(RuntimeError,match='injected startup failure'):manager.start()
    assert manager.lease is None and manager.thread is None and not sources
    lease=CaptureLease(store.root);lease.close()
    if manager.current:
        assert manager.current['status']=='ERROR' and manager.current['ended_at']


@pytest.mark.parametrize('sample_fps',['invalid','nan','0'])
def test_invalid_sample_rate_finishes_worker_and_releases_lease(tmp_path,monkeypatch,sample_fps):
    manager,store,sources,_=setup_manager(tmp_path,monkeypatch,[])
    monkeypatch.setenv('HUBONE_LIVE_SAMPLE_FPS',sample_fps)
    manager.start()
    manager.thread.join(timeout=3)
    assert not manager.thread.is_alive() and manager.lease is None and not sources
    state=manager.status()
    assert state['status']=='ERROR' and state['ended_at']
    lease=CaptureLease(store.root);lease.close()


def test_frame_directory_failure_releases_lease(tmp_path,monkeypatch):
    manager,store,sources,_=setup_manager(tmp_path,monkeypatch,[])
    (store.root/'live_frames').write_text('injected non-directory',encoding='utf-8')
    manager.start()
    manager.thread.join(timeout=3)
    assert not manager.thread.is_alive() and manager.lease is None and not sources
    assert manager.status()['status']=='ERROR' and manager.status()['ended_at']
    lease=CaptureLease(store.root);lease.close()


def test_final_status_write_failure_still_releases_lease(tmp_path,monkeypatch):
    manager,store,_,_=setup_manager(tmp_path,monkeypatch,[])
    manager.current={'session_id':'test-local-cleanup','status':'CONNECTING','metrics':{}}
    manager.lease=CaptureLease(store.root)
    manager.stop_event.set()
    def fail(state):raise RuntimeError('injected persistence failure')
    monkeypatch.setattr(manager.live,'save',fail)
    with pytest.raises(RuntimeError,match='injected persistence failure'):manager._run()
    assert manager.lease is None
    lease=CaptureLease(store.root);lease.close()


def test_real_iou_uses_inference_cadence_but_observations_keep_source_frame_index(tmp_path,monkeypatch):
    from retailvision.config import TrackerConfig
    from retailvision.cv.tracker import IoUTracker
    from retailvision.schemas import CameraConfig, Detection

    manager,store,_,_=setup_manager(tmp_path,monkeypatch,[])
    tracker_inputs=[];fps_inputs=[];models=[]
    class StridedSource(FakeSource):
        def read(self,timeout=.5):
            packet=super().read(timeout)
            if packet and packet['kind']=='frame':packet['frame_index']*=13
            return packet
    class Detector(FakeModel):
        def detect(self,frame):
            self.calls+=1
            return [Detection((10,10,40,60),.9)]
    def factory(width,height,fps):
        fps_inputs.append(fps)
        detector=Detector();pose=FakeModel();models.extend([detector,pose])
        tracker=IoUTracker(CameraConfig('fake-live','',fps,width,height),TrackerConfig(backend='iou',min_hits=1,match_iou=.15))
        original_update=tracker.update
        def update(detections,index):
            tracker_inputs.append(index)
            return original_update(detections,index)
        tracker.update=update
        return detector,pose,tracker,None
    manager.capture_factory=lambda:StridedSource([(1,1)]*4)
    manager.vision_factory=factory
    sid=manager.start()['session_id']
    try:wait_for(lambda:manager.status()['metrics'].get('sampled_frames')==4)
    finally:manager.shutdown()
    items=manager.live.observations(sid,0,10)['items']
    assert fps_inputs==[10] and tracker_inputs==[0,1,2,3]
    assert [item['frame_index'] for item in items]==[13,26,39,52]
    assert len({item['tracks'][0]['track_id'] for item in items})==1
    assert all(b['timestamp']>a['timestamp'] for a,b in zip(items,items[1:]))
    assert models[0].calls==4 and all(model.unloaded for model in models)


def test_stage_timings_separate_detector_tracker_and_persistence(tmp_path,monkeypatch):
    manager,store,_,_=setup_manager(tmp_path,monkeypatch,[])
    class TimedSource(FakeSource):
        def read(self,timeout=.5):
            packet=super().read(timeout)
            if packet and packet['kind']=='frame':
                packet['rtsp_read_ms']=7.5
                packet['captured_monotonic']-=.02
            return packet
    class TimedDetector(FakeModel):
        device='cpu'
        def detect(self,frame):
            time.sleep(.012)
            return super().detect(frame)
    class TimedTracker(FakeTracker):
        def update(self,detections,index):
            time.sleep(.005)
            return super().update(detections,index)
    detector=TimedDetector();pose=FakeModel()
    manager.capture_factory=lambda:TimedSource([(1,1)]*3)
    manager.vision_factory=lambda *args:(detector,pose,TimedTracker(),None)
    sid=manager.start()['session_id']
    try:wait_for(lambda:manager.status()['metrics'].get('sampled_frames')==3)
    finally:manager.shutdown()
    metrics=manager.status()['metrics']
    assert metrics['rtsp_read_ms']==7.5
    assert metrics['mean_yolo_ms']>=10 and metrics['mean_tracking_ms']>=4
    assert metrics['mean_inference_ms']==pytest.approx(metrics['mean_yolo_ms']+metrics['mean_tracking_ms'])
    assert metrics['frame_queue_age_ms']>=19
    assert metrics['queue_read_wait_ms']>=100
    assert metrics['sample_acquisition_wait_ms']>=metrics['queue_read_wait_ms']
    assert metrics['sampled_pipeline_fps']==metrics['inference_fps']
    assert 0<metrics['sampled_pipeline_fps']<=metrics['configured_sample_fps']==10
    assert metrics['device']=='cpu' and metrics['yolo_cuda_synchronized'] is False
    for name in ('jpeg_encode_ms','evidence_write_ms','observation_build_ms','observation_db_ms',
                 'event_write_ms','status_persist_ms','sample_pipeline_ms','telemetry_ms'):
        assert metrics[name]>=0 and metrics['mean_'+name]>=0
    assert metrics['sample_pipeline_ms']>=metrics['yolo_ms']+metrics['tracking_ms']
    assert 'not model capacity' in metrics['timing_scope']['sampled_pipeline_fps']
    assert detector.calls==3 and len(manager.live.observations(sid,0,10)['items'])==3


def test_default_two_fps_gate_reports_skips_without_repeated_inference(tmp_path,monkeypatch):
    manager,store,_,models=setup_manager(tmp_path,monkeypatch,[])
    monkeypatch.delenv('HUBONE_LIVE_SAMPLE_FPS')
    class StridedSource(FakeSource):
        def read(self,timeout=.5):
            packet=super().read(timeout)
            if packet and packet['kind']=='frame':packet['frame_index']*=3
            return packet
    manager.capture_factory=lambda:StridedSource([(1,1)]*20)
    manager.start()
    try:wait_for(lambda:manager.status()['metrics'].get('sampled_frames')==3)
    finally:manager.shutdown()
    metrics=manager.status()['metrics']
    assert metrics['configured_sample_fps']==2
    assert metrics['sampling_skipped_frames']>0 and metrics['decoder_frames_not_delivered']>0
    assert 0<metrics['sampled_pipeline_fps']<=2
    assert models[0][0].calls==3
    assert metrics['sample_acquisition_wait_ms']>metrics['queue_read_wait_ms']*2


def test_cuda_timing_sync_uses_actual_detector_device_not_requested_environment(monkeypatch):
    from vision.live import synchronize_detector
    calls=[]
    cuda=SimpleNamespace(is_available=lambda:True,synchronize=lambda device:calls.append(device))
    torch=SimpleNamespace(cuda=cuda)
    monkeypatch.setenv('VISION_DEVICE','cuda')
    cpu=SimpleNamespace(device='cpu',_torch=torch)
    assert synchronize_detector(cpu) is False and calls==[]
    resolved=SimpleNamespace(device='cpu',actual_device='cuda:0',_torch=torch)
    assert synchronize_detector(resolved) is True and calls==['cuda:0']
    cuda.is_available=lambda:False
    assert synchronize_detector(resolved) is False and calls==['cuda:0']


def test_stale_frame_breaks_public_track_and_rule_history_with_same_decoder_epoch(tmp_path,monkeypatch):
    """Synthetic source failure sequence; no camera or model is used."""
    manager,store,_,models=setup_manager(tmp_path,monkeypatch,[])
    class StaleSource(FakeSource):
        def read(self,timeout=.5):
            packet=super().read(timeout)
            if packet and packet['kind']=='frame' and packet['frame_index']==2:
                packet['captured_monotonic']-=4
            return packet
    manager.capture_factory=lambda:StaleSource([(1,1)]*3)
    sid=manager.start()['session_id']
    try:wait_for(lambda:manager.status()['metrics'].get('sampled_frames')==2)
    finally:manager.shutdown()
    items=manager.live.observations(sid,0,10)['items']
    assert [item['frame_index'] for item in items]==[1,3]
    assert [item['connection_epoch'] for item in items]==[1,1]
    assert items[1]['track_epoch']>items[0]['track_epoch']
    assert items[1]['tracks'][0]['track_id']!=items[0]['tracks'][0]['track_id']
    for item in items:
        experiment=item['tracks'][0]['pose_experiment']
        assert experiment['history_reset']=='FIRST_OBSERVATION'
        assert experiment['statuses']['entry']=='UNKNOWN'
        assert experiment['measured_criteria']['dwell']['observed_inside_seconds']==0
    assert manager.status()['metrics']['stale_frames_dropped']==1
    assert models[0][0].calls==2
    assert sum(e['event_type']=='person_detected' for e in store.events(sid))==2


def test_live_provenance_revisions_follow_successful_runtime_and_reference_observations_events(tmp_path,monkeypatch):
    """Fake device transitions test identity wiring, not GPU inference correctness."""
    manager,store,_,_=setup_manager(tmp_path,monkeypatch,[])
    class RevisionDetector(FakeModel):
        weights=tmp_path/'fake-only-no-model-loaded.pt'
        actual_device='cuda:0'
        fallback_reason=None
        def detect(self,frame):
            value=super().detect(frame)
            if self.calls>=3:
                self.actual_device='cpu'
                self.fallback_reason='CUDA_INFERENCE_FAILED:TestInjectedFailure'
            return value
    class ZoneTracker(FakeTracker):
        def update(self,detections,index):
            # Third observation leaves ROI, fourth reenters: both create Events
            # after the device revision without manufacturing a new Track ID.
            bbox=(0,10,4,79) if index==2 else (10,10,40,60)
            return [SimpleNamespace(local_track_id=1,bbox=bbox,confidence=.9)]
    detector=RevisionDetector()
    manager.capture_factory=lambda:FakeSource([(1,1)]*4)
    manager.vision_factory=lambda *args:(detector,None,ZoneTracker(),None)
    calls=[]
    def snapshot(current,sample_fps,source_fps):
        assert current is detector and detector.calls>0
        calls.append((detector.calls,detector.actual_device,detector.fallback_reason))
        return {'provenance_id':f'test-provenance-{len(calls)}','actual_device':detector.actual_device,
                'fallback_reason':detector.fallback_reason,'test_fixture':True}
    monkeypatch.setattr('vision.live.capture_model_provenance',snapshot)
    monkeypatch.setattr('vision.live.synchronize_detector',lambda current:current.actual_device.startswith('cuda'))
    sid=manager.start()['session_id']
    try:wait_for(lambda:manager.status()['metrics'].get('sampled_frames')==4)
    finally:manager.shutdown()
    assert calls==[(1,'cuda:0',None),(3,'cpu','CUDA_INFERENCE_FAILED:TestInjectedFailure')]
    items=manager.live.observations(sid,0,10)['items']
    assert [item['provenance_id'] for item in items]==[
        'test-provenance-1','test-provenance-1','test-provenance-2','test-provenance-2']
    session=manager.live.session(sid)
    history=session['vision_provenance_history']
    assert [p['provenance_id'] for p in history]==['test-provenance-1','test-provenance-2']
    assert history[0]['actual_device']=='cuda:0' and history[0]['fallback_reason'] is None
    assert session['vision_provenance']==history[1]
    assert session['provenance_status']=='RECORDED_AFTER_REAL_INFERENCE'
    events=store.events(sid)
    provenance_by_frame={item['frame_index']:item['provenance_id'] for item in items}
    assert {event['metadata']['provenance_id'] for event in events}=={'test-provenance-1','test-provenance-2'}
    for event in events:
        assert event['session_id']==sid
        assert event['metadata']['provenance_id']==provenance_by_frame[event['evidence']['frame_index']]
    assert detector.calls==4 and detector.unloaded

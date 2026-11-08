import json
from types import SimpleNamespace

import pytest

from vision.observations import ObservationRecorder


def saved(client, sid):
    response=client.post(f'/api/sessions/{sid}/assets',data={'kind':'video','recording_mode':'REAL_RECORDING'},files={'file':('home.mp4',b'test-container')})
    assert response.status_code==201
    aid=response.json()['asset_id']
    directory=client.app.state.store.root/'frames'/sid/aid
    directory.mkdir(parents=True)
    recorder=ObservationRecorder(sid,aid,SimpleNamespace(width=704,height=576,fps=25,duration_seconds=2),10,[(0,0),(1,0),(1,1)],False,'REAL_RECORDING')
    recorder.append(0,0,[{'track_id':'1','bbox':[1,2,3,4]}],[])
    recorder.append(12,.48,[],[])
    recorder.save(directory)
    return aid,recorder


def test_observation_ownership_paging_and_no_cad_binding(client,sid):
    aid,recorder=saved(client,sid)
    url=f'/api/sessions/{sid}/assets/{aid}/observations'
    data=client.get(url,params={'limit':1}).json()
    assert data['recording_mode']=='REAL_RECORDING'
    assert data['frames'][0]['timestamp']==10
    assert data['frames'][0]['media_time']==0
    assert data['floor_id'] is None and data['cad_status']=='NOT_CONNECTED'
    assert data['total']==2 and data['observation_count']==1
    page=client.get(url,params={'offset':1,'limit':1,'run_id':recorder.run_id}).json()
    assert page['frames'][0]['tracks']==[]
    assert page['frames'][0]['timestamp']==10.48
    assert client.get(url,params={'run_id':'stale'}).status_code==409
    assert client.get(url,params={'offset':-1}).status_code==422
    other=client.post('/api/sessions',json={}).json()['session_id']
    assert client.get(f'/api/sessions/{other}/assets/{aid}/observations').status_code==404
    assert client.get(f'/api/sessions/{sid}/events').json()==[]


def test_simulated_session_cannot_be_presented_as_real(client):
    sid=client.post('/api/sessions',json={'simulated':True}).json()['session_id']
    aid,_=saved(client,sid)
    data=client.get(f'/api/sessions/{sid}/assets/{aid}/observations').json()
    assert data['simulated'] is True and data['recording_mode']=='SIMULATED'


def test_missing_observations_never_fall_back(client,sid):
    aid=client.post(f'/api/sessions/{sid}/assets',data={'kind':'video'},files={'file':('old.mp4',b'old')}).json()['asset_id']
    response=client.get(f'/api/sessions/{sid}/assets/{aid}/observations')
    assert response.status_code==404 and 'NOT CONNECTED' in response.json()['detail']


def test_public_upload_cannot_claim_live(client,sid):
    response=client.post(f'/api/sessions/{sid}/assets',data={'kind':'video','recording_mode':'LIVE'},files={'file':('bad.mp4',b'bad')})
    assert response.status_code==422


def test_playback_is_asset_scoped_and_uses_range_response(client,sid):
    aid,_=saved(client,sid)
    directory=client.app.state.store.root/'frames'/sid/aid
    path=directory/'observations.json'
    data=json.loads(path.read_text());data['playback_status']='READY';path.write_text(json.dumps(data))
    (directory/'playback.mp4').write_bytes(b'0123456789')
    url=f'/api/sessions/{sid}/assets/{aid}/playback'
    response=client.get(url,headers={'Range':'bytes=2-5'})
    assert response.status_code==206 and response.content==b'2345'
    other=client.post('/api/sessions',json={}).json()['session_id']
    assert client.get(f'/api/sessions/{other}/assets/{aid}/playback').status_code==404


def test_failed_playback_is_explicit_and_preserves_observations(client,sid):
    aid,_=saved(client,sid)
    assert client.get(f'/api/sessions/{sid}/assets/{aid}/playback').status_code==404
    assert client.get(f'/api/sessions/{sid}/assets/{aid}/observations').status_code==200


def test_pipeline_records_every_sample_without_extra_inference(tmp_path,monkeypatch):
    import numpy as np
    from vision import pipeline
    count={'detector':0,'tracker':0}
    probe=SimpleNamespace(width=40,height=30,fps=2,duration_seconds=2,frame_count=4)
    monkeypatch.setattr(pipeline,'probe_video',lambda _:probe)
    class Capture:
        index=0
        def read(self):
            self.index+=1
            return (True,np.zeros((30,40,3),np.uint8)) if self.index<=4 else (False,None)
        def release(self):pass
    class Detector:
        def detect(self,frame):count['detector']+=1;return []
        def unload(self):pass
    class Pose:
        def estimate(self,crops):return [None]
        def unload(self):pass
    class Tracker:
        def update(self,detections,index):
            count['tracker']+=1
            return [] if index==2 else [SimpleNamespace(bbox=(4,3,12,20),confidence=.9,local_track_id=7)]
    from retailvision.config import ActivityConfig
    monkeypatch.setattr(pipeline,'build_vision',lambda *args:(Detector(),Pose(),Tracker(),ActivityConfig()))
    monkeypatch.setattr(pipeline.cv2,'VideoCapture',lambda _:Capture())
    monkeypatch.setenv('VISION_SAMPLE_FPS','2')
    events,stats=pipeline.analyze_video(tmp_path/'input.mp4','session','asset',tmp_path/'frames',offset=8,recording_mode='REAL_RECORDING')
    document=json.loads((tmp_path/'frames/observations.json').read_text())
    assert count=={'detector':4,'tracker':4}
    assert len(document['frames'])==4 and document['frames'][2]['tracks']==[]
    assert stats['track_observations']==3
    assert document['frames'][3]['timestamp']==9.5
    assert all(e.metadata['observation_run_id']==document['run_id'] for e in events)

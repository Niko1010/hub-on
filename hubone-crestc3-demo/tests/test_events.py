import pytest

from backend.models import Event,Segment,ProcessInput
from database.store import Store
from tests.conftest import wait_job


def test_session_isolation_and_speaker_honesty(client,sid):
    other=client.post('/api/sessions',json={}).json()['session_id']
    data={'segments':[{'start':3,'end':6,'text':'穿起来还可以，但是腰部有点紧。'}], 'offset_seconds':10}
    response=client.post(f'/api/sessions/{sid}/transcripts',json=data)
    assert response.status_code==201
    event=response.json()['events'][0]
    assert event['timestamp']==13 and event['metadata']['end_timestamp']==16
    assert event['evidence']['start']==3
    assert event['source']=='manual' and event['metadata']['speaker'] is None
    assert client.get(f'/api/sessions/{other}/events').json()==[]
    assert client.get(f'/api/sessions/{sid}/events').json()[0]['evidence']['quote']==data['segments'][0]['text']


@pytest.mark.parametrize('data',[
    {'start':4,'end':2,'text':'错误'}, {'start':-1,'end':2,'text':'错误'},
    {'start':0,'end':2,'text':' '}, {'start':0,'end':2,'text':'错误','confidence':2},
])
def test_invalid_transcript_bounds(data,client,sid):
    response=client.post(f'/api/sessions/{sid}/transcripts',json={'segments':[data]})
    assert response.status_code==422


def test_untrusted_source_cannot_impersonate_models(client,sid):
    response=client.post(f'/api/sessions/{sid}/events',json={
        'timestamp':0,'source':'video','event_type':'strap_adjustment','description':'fake'})
    assert response.status_code==422
    assert client.get(f'/api/sessions/{sid}/events').json()==[]


def test_wrong_session_asset_cannot_be_processed(client,sid):
    other=client.post('/api/sessions',json={}).json()['session_id']
    asset=client.post(f'/api/sessions/{sid}/assets',data={'kind':'audio'},files={'file':('a.wav',b'ab','audio/wav')}).json()
    assert client.get(f'/api/sessions/{other}/assets/{asset["asset_id"]}').status_code==404
    assert client.post(f'/api/sessions/{other}/audio',json={'asset_id':asset['asset_id']}).status_code==404


def test_known_fixture_is_marked_even_in_real_session(client,sid):
    from backend.config import ROOT
    with (ROOT/'sample_data/audio.wav').open('rb') as f:
        response=client.post(f'/api/sessions/{sid}/assets',data={'kind':'audio'},files={'file':('renamed.wav',f,'audio/wav')})
    assert response.status_code==201 and response.json()['simulated'] is True


def test_upload_and_decode_failure_no_fake_results(client,sid):
    assert client.post(f'/api/sessions/{sid}/assets',data={'kind':'audio'},files={'file':('empty.wav',b'')}).status_code==422
    assert client.post(f'/api/sessions/{sid}/assets',data={'kind':'audio'},files={'file':('bad.exe',b'abc')}).status_code==415
    asset=client.post(f'/api/sessions/{sid}/assets',data={'kind':'audio'},files={'file':('bad.wav',b'invalid')}).json()
    response=client.post(f'/api/sessions/{sid}/audio',json={'asset_id':asset['asset_id']})
    job=wait_job(client,sid,response.json()['job_id'])
    assert job['status']=='failed' and job['error_type']=='invalid_input'
    assert client.get(f'/api/sessions/{sid}/events').json()==[]


def test_report_invalidated_when_evidence_changes(client,sid):
    client.post(f'/api/sessions/{sid}/transcripts',json={'segments':[{'start':1,'end':3,'text':'腰部有点紧。'}]})
    job=client.post(f'/api/sessions/{sid}/analyze',json={'provider':'rules'}).json()
    assert wait_job(client,sid,job['job_id'])['status']=='completed'
    assert client.get(f'/api/sessions/{sid}/report').status_code==200
    client.post(f'/api/sessions/{sid}/events',json={'timestamp':2,'source':'manual','event_type':'observation','description':'补充观察'})
    assert client.get(f'/api/sessions/{sid}/report').status_code==409


def test_polygon_validation():
    with pytest.raises(ValueError):
        ProcessInput(asset_id='a',zone=[(0,0),(1,1),(0,1),(1,0)])
    with pytest.raises(ValueError):
        ProcessInput(asset_id='a',zone=[(-1,0),(1,0),(0,1)])


def test_interrupted_jobs_are_visible(tmp_path):
    from backend.models import Session
    db=Store(tmp_path)
    session=Session()
    db.create_session(session)
    db.save_job({'job_id':'a','session_id':session.session_id,'status':'running'})
    db.recover_jobs()
    assert db.job(session.session_id,'a')['status']=='failed'


def test_websocket_sends_persisted_evidence(client,sid):
    client.post(f'/api/sessions/{sid}/events',json={'timestamp':2,'source':'manual','event_type':'observation','description':'人工观察'})
    with client.websocket_connect(f'/api/sessions/{sid}/stream') as ws:
        data=ws.receive_json()
        assert data['type']=='events_snapshot'
        assert data['events'][0]['source']=='manual'

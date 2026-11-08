"""Isolated API contract tests; fixtures are NOT real observations or human GT.

REAL_* labels below exercise provenance gates only. No media is inferred, no
production Store is opened, and no recognition-accuracy result is published.
"""
import hashlib
import json
from types import SimpleNamespace
from uuid import uuid4

import pytest
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.testclient import TestClient

from backend.experience import create_experience_router
from backend.models import Event, Session
from database.store import Store
from experience.behavior import BEHAVIORS
from experience.core import ExperienceStore, framework
from vision.live import LiveStore
from vision.observations import ObservationRecorder


class Queue:
    """Deterministic stand-in for the existing job runner; never starts a thread."""
    def __init__(self): self.pending={}

    def __call__(self,sid,kind,work):
        jid=uuid4().hex; self.pending[jid]=work
        return {'job_id':jid,'session_id':sid,'kind':kind,'status':'queued'}

    def run(self,jid): return self.pending.pop(jid)(lambda *_:None)


@pytest.fixture
def api(tmp_path,monkeypatch):
    store=Store(tmp_path/'isolated-store'); live=LiveStore(store); queue=Queue()
    app=FastAPI()

    @app.exception_handler(KeyError)
    async def missing(request,exc): return JSONResponse(status_code=404,content={'detail':str(exc.args[0])})

    @app.exception_handler(ValueError)
    async def invalid(request,exc): return JSONResponse(status_code=422,content={'detail':str(exc)})

    app.include_router(create_experience_router(store,queue))
    # The behavior route must consume saved observations, even when every
    # existing visual model construction/inference entry point is unavailable.
    def forbidden(*args,**kwargs): raise AssertionError('Experience review must not run visual inference')
    import adapters.vision
    import adapters.live_vision
    import vision.pipeline
    monkeypatch.setattr(adapters.vision,'build_vision',forbidden)
    monkeypatch.setattr(adapters.live_vision,'build_live_vision',forbidden)
    monkeypatch.setattr(vision.pipeline,'build_vision',forbidden)
    monkeypatch.setattr(vision.pipeline,'analyze_video',forbidden)
    with TestClient(app) as client:
        yield SimpleNamespace(client=client,store=store,live=live,queue=queue,records=ExperienceStore(store))


def session(api,simulated=False):
    return api.store.create_session(Session(name='API fixture only',simulated=simulated))['session_id']


def track(inside=True):
    joints={'left_shoulder':(40,60),'right_shoulder':(60,60),
        'left_hip':(40,110),'right_hip':(60,110),'left_knee':(40,150),'right_knee':(60,150),
        'left_ankle':(40,190),'right_ankle':(60,190),'left_wrist':(40,100),'right_wrist':(60,100)}
    return {'track_id':'fixture-track','bbox':[0,0,120,200],'confidence':.9,
        'image_zone_id':'experience' if inside else None,
        'keypoints':[{'name':name,'x':x,'y':y,'confidence':.95,'visible':True} for name,(x,y) in joints.items()]}


def recording(api,sid,*,asset_simulated=False,document_simulated=False):
    aid=uuid4().hex
    api.store.save_asset({'asset_id':aid,'session_id':sid,'kind':'video','filename':aid+'.mp4',
        'original_name':'synthetic-api-fixture.mp4','sha256':hashlib.sha256(aid.encode()).hexdigest(),
        'simulated':asset_simulated,'recording_mode':'REAL_RECORDING'})
    folder=api.store.root/'frames'/sid/aid; folder.mkdir(parents=True)
    recorder=ObservationRecorder(sid,aid,SimpleNamespace(width=320,height=240,fps=25,duration_seconds=2),
        10,[(0,0),(1,0),(1,1)],document_simulated,'REAL_RECORDING')
    for index,t in enumerate((0,.4,.8,1.2,1.6)):
        recorder.append(index*10,t,[track(index>0)],[])
    recorder.save(folder)
    return {'kind':'recording','asset_id':aid},folder/'observations.json'


def live_source(api,sid,*,status='STOPPED'):
    api.live.save({'session_id':sid,'status':status,'source_type':'RTSP',
        'metrics':{'width':320,'height':240,'source_fps':25}})
    for index,t in enumerate((0,.4,.8)):
        api.live.append({'session_id':sid,'timestamp':t,'frame_index':index*10,
            'snapshot':f'{index*10:012d}.jpg','tracks':[track(index>0)],'event_ids':[]})
    return {'kind':'live'}


def url(sid,action=''): return f'/api/sessions/{sid}/experience'+('/'+action if action else '')


def document(api,sid,ref,**params):
    response=api.client.get(url(sid,'observations'),params={**ref,**params})
    assert response.status_code==200,response.text
    return response.json()


def annotation(doc,**changes):
    ref={k:v for k,v in doc['source_ref'].items() if k in ('kind','asset_id')}
    return {'source_ref':ref,'source_fingerprint':doc['fingerprint'],'track_id':'fixture-track',
        'label':'STATIONARY','start':doc['start'],'end':doc['end'],**changes}


def behavior_run(api,sid,ref):
    queued=api.client.post(url(sid,'behaviors'),json={'source_ref':ref})
    assert queued.status_code==202,queued.text
    return api.queue.run(queued.json()['job_id'])


@pytest.mark.parametrize('kind',['recording','live'])
def test_saved_source_paging_ownership_and_no_source_mutation(api,kind):
    sid=session(api); other=session(api)
    ref,path=recording(api,sid) if kind=='recording' else (live_source(api,sid),None)
    before=path.read_bytes() if path else api.live.observations(sid,0,100)
    first=document(api,sid,ref,limit=1); second=document(api,sid,ref,offset=1,limit=1)
    assert first['fingerprint']==second['fingerprint']
    assert first['total']==(5 if path else 3) and len(first['frames'])==1
    assert second['frames'][0]['timestamp']>first['frames'][0]['timestamp']
    assert first['source_mode']==('REAL_RECORDING' if path else 'REAL_LIVE')
    assert first['coordinate_system']=='IMAGE_PIXELS' and first['cad_status']=='NOT_CONNECTED'
    assert first['frames'][0]['source_ref']['session_id']==sid
    assert first['frames'][0]['tracks'][0]['inside_zone'] is False
    assert second['frames'][0]['tracks'][0]['inside_zone'] is True
    assert api.client.get(url(other,'observations'),params=ref).status_code==404
    assert api.client.get(url(sid,'observations'),params={**ref,'offset':-1}).status_code==422
    assert api.client.get(url(sid,'observations'),params={**ref,'limit':1001}).status_code==422
    assert before==(path.read_bytes() if path else api.live.observations(sid,0,100))
    assert api.store.events(sid)==[]


def test_recording_document_cannot_claim_another_session(api):
    sid=session(api);ref,path=recording(api,sid)
    data=json.loads(path.read_text());data['session_id']=session(api);path.write_text(json.dumps(data))
    result=api.client.get(url(sid,'observations'),params=ref)
    assert result.status_code==422 and 'ownership' in result.json()['detail']


@pytest.mark.parametrize('changes',[
    {'source_fingerprint':'0'*64},{'track_id':'not-observed'},
    {'start':0},{'end':99},{'start':11,'end':10},
    {'verification_status':'HUMAN_VERIFIED'},{'annotator_kind':'HUMAN'},
])
def test_annotation_rejects_wrong_fingerprint_track_interval_and_client_status(api,changes):
    sid=session(api);ref,_=recording(api,sid);doc=document(api,sid,ref)
    response=api.client.post(url(sid,'annotations'),json=annotation(doc,**changes))
    assert response.status_code==422,response.text
    assert api.records.list(sid,'annotation')==[]


def test_annotation_human_confirmation_is_explicit_and_source_immutable(api):
    sid=session(api);ref,path=recording(api,sid);before=path.read_bytes();doc=document(api,sid,ref)
    pending=api.client.post(url(sid,'annotations'),json=annotation(doc)).json()
    reviewed=api.client.post(url(sid,'annotations'),json=annotation(doc,human_confirmed=True)).json()
    assert pending['verification_status']=='NOT_VERIFIED'
    assert reviewed['verification_status']=='HUMAN_VERIFIED' and reviewed['annotator_kind']=='HUMAN'
    assert reviewed['source_ref']['session_id']==sid and reviewed['source_ref']['asset_id']==ref['asset_id']
    assert len(reviewed['evidence_refs'])==5
    assert reviewed['original_observation_modified'] is False and before==path.read_bytes()
    other=session(api)
    assert api.client.post(url(other,'annotations'),json=annotation(doc,human_confirmed=True)).status_code==404


def test_reviewed_range_requires_separate_complete_and_human_flags(api):
    sid=session(api);ref,_=recording(api,sid);doc=document(api,sid,ref)
    body=annotation(doc);body.pop('label')
    pending=api.client.post(url(sid,'reviewed-ranges'),json=body).json()
    reviewed=api.client.post(url(sid,'reviewed-ranges'),json={**body,'complete':True,'human_confirmed':True}).json()
    assert pending['complete'] is False and pending['verification_status']=='NOT_VERIFIED'
    assert reviewed['complete'] is True and reviewed['verification_status']=='HUMAN_VERIFIED'
    assert reviewed['source_fingerprint']==doc['fingerprint']
    assert api.client.post(url(sid,'reviewed-ranges'),json={**body,'track_id':'foreign'}).status_code==422


@pytest.mark.parametrize('kind',['recording','live'])
def test_behavior_jobs_reuse_observations_ten_classes_and_session_scoped_results(api,kind):
    sid=session(api);ref=recording(api,sid)[0] if kind=='recording' else live_source(api,sid)
    original=api.store.session(sid);result=behavior_run(api,sid,ref)
    assert result['model_inference_executed'] is False and result['method']=='RULE_BASED'
    assert result['verification_status']=='NOT_VERIFIED' and 'predictions' not in result
    response=api.client.get(url(sid,'behaviors/'+result['record_id']),params={'limit':10}).json()
    assert response['total']==result['sampled_frames']*10
    assert {p['label'] for p in response['predictions']}==set(BEHAVIORS)
    assert all(p['source_ref']['session_id']==sid and p['cad_status']=='NOT_CONNECTED' for p in response['predictions'])
    assert api.client.get(url(session(api),'behaviors/'+result['record_id'])).status_code==404
    assert api.store.session(sid)==original and api.store.events(sid)==[]


def test_active_capture_cannot_be_frozen_for_annotations_or_behaviors(api):
    sid=session(api);ref=live_source(api,sid,status='LIVE');doc=document(api,sid,ref)
    assert api.client.post(url(sid,'annotations'),json=annotation(doc)).status_code==422
    queued=api.client.post(url(sid,'behaviors'),json={'source_ref':ref}).json()
    with pytest.raises(ValueError,match='Stop capture'):api.queue.run(queued['job_id'])
    assert api.records.list(sid,'behavior_run')==[]


def test_evaluation_without_human_gt_and_stale_source_never_claims_accuracy(api):
    sid=session(api);ref,path=recording(api,sid);run=behavior_run(api,sid,ref)
    result=api.client.post(url(sid,'evaluate'),json={'behavior_run_id':run['record_id']}).json()
    assert result['status']=='NOT_VERIFIED' and result['official_metrics'] is None
    assert result['semantic_accuracy_certified'] is False
    data=json.loads(path.read_text());data['frames'][0]['tracks'][0]['bbox'][0]=1;path.write_text(json.dumps(data))
    result=api.client.post(url(sid,'evaluate'),json={'behavior_run_id':run['record_id']})
    assert result.status_code==422 and 'changed' in result.json()['detail']


@pytest.mark.parametrize('origin',['session','asset','document','live_session'])
def test_simulated_origin_dominates_real_labels_and_cannot_produce_official_metrics(api,origin):
    sid=session(api,simulated=origin in ('session','live_session'))
    ref=live_source(api,sid) if origin=='live_session' else recording(api,sid,
        asset_simulated=origin=='asset',document_simulated=origin=='document')[0]
    doc=document(api,sid,ref);assert doc['source_mode']=='SIMULATED'
    run=behavior_run(api,sid,ref);assert run['source_mode']=='SIMULATED'
    posted=api.client.post(url(sid,'annotations'),json=annotation(doc,human_confirmed=True))
    assert posted.status_code==201 and posted.json()['source_mode']=='SIMULATED'
    result=api.client.post(url(sid,'evaluate'),json={'behavior_run_id':run['record_id']}).json()
    assert result['status']=='REJECTED_SIMULATED' and result['official_metrics'] is None


def test_same_session_training_is_rejected_even_with_human_confirmation(api):
    sid=session(api);ref,_=recording(api,sid);doc=document(api,sid,ref);run=behavior_run(api,sid,ref)
    assert api.client.post(url(sid,'annotations'),json=annotation(doc,human_confirmed=True)).status_code==201
    result=api.client.post(url(sid,'evaluate'),json={'behavior_run_id':run['record_id'],
        'train':[{'session_id':sid,'source_ref':ref}]}).json()
    assert result['status']=='REJECTED_LEAKAGE' and result['official_metrics'] is None


@pytest.mark.parametrize('restriction',[{'authorization_status':'DENIED'},{'deletion_status':'REQUESTED'}])
def test_queued_job_rechecks_revocation_before_consuming_saved_observations(api,restriction):
    sid=session(api);ref,_=recording(api,sid)
    queued=api.client.post(url(sid,'behaviors'),json={'source_ref':ref}).json()
    assert api.client.post(url(sid,'context'),json=restriction).status_code==201
    with pytest.raises(ValueError,match='paused'):api.queue.run(queued['job_id'])
    assert api.records.list(sid,'behavior_run')==[]
    assert api.client.post(url(sid,'behaviors'),json={'source_ref':ref}).status_code==422


def test_job_rechecks_revocation_before_persisting_result(api,monkeypatch):
    sid=session(api);ref,_=recording(api,sid)
    import experience.behavior
    analyze=experience.behavior.analyze_behaviors
    def revoked(frames,**kwargs):
        result=analyze(frames,**kwargs)
        api.records.append(sid,'context',{'authorization_status':'DENIED','deletion_status':'ACTIVE'})
        return result
    monkeypatch.setattr(experience.behavior,'analyze_behaviors',revoked)
    queued=api.client.post(url(sid,'behaviors'),json={'source_ref':ref}).json()
    with pytest.raises(ValueError,match='paused'):api.queue.run(queued['job_id'])
    assert api.records.list(sid,'behavior_run')==[]


def test_study_context_consumer_authorization_and_evidence_ownership(api):
    sid=session(api);other=session(api)
    study=api.client.post('/api/experience/studies',json={'title':'Fixture study','question':'Fixture question',
        'target_dimensions':['WHO','EXPERIENCE']})
    assert study.status_code==201
    assert api.client.post('/api/experience/studies',json={'title':'','question':'x'}).status_code==422
    assert api.client.post(url(sid,'context'),json={'study_id':'missing'}).status_code==404
    assert api.client.post(url(sid,'context'),json={'membership_reference':'test-member'}).status_code==422
    assert api.client.post(url(sid,'context'),json={'consumer_characteristics':{'age_band':'fixture'}}).status_code==422
    own=Event(session_id=sid,timestamp=1,event_type='fixture',source='manual',description='API fixture evidence only')
    foreign=Event(session_id=other,timestamp=1,event_type='fixture',source='manual',description='Foreign fixture only')
    api.store.write_events(sid,[own],'fixture');api.store.write_events(other,[foreign],'fixture')
    body={'study_id':study.json()['record_id'],'research_purpose':'Explicit fixture scope',
        'authorization_status':'AUTHORIZED','authorization_reference':'fixture-consent',
        'membership_reference':'test-member','consumer_characteristics':{'age_band':'fixture'},
        'product_present_verified':True,'product_evidence_refs':['event:'+own.event_id]}
    assert api.client.post(url(sid,'context'),json={**body,'product_evidence_refs':['event:'+foreign.event_id]}).status_code==422
    assert api.client.post(url(sid,'context'),json=body).status_code==201
    overview=api.client.get(url(sid)).json()
    assert overview['context']['study_id']==study.json()['record_id']
    assert overview['identity_association']=='NOT_CONNECTED' and overview['cad_status']=='NOT_CONNECTED'
    assert api.store.events(sid)==[own.model_dump()]


def test_business_import_requires_authorization_source_reference_and_same_session_evidence(api):
    sid=session(api);metric=framework()['dimensions'][0]['metrics'][0]['id']
    body={'metric_id':metric,'timestamp':0,'value':'fixture value','source_type':'MEMBER_IMPORT'}
    assert api.client.post(url(sid,'business-inputs'),json=body).status_code==422
    context={'authorization_status':'AUTHORIZED','authorization_reference':'fixture-consent','research_purpose':'Fixture only'}
    assert api.client.post(url(sid,'context'),json=context).status_code==201
    assert api.client.post(url(sid,'business-inputs'),json=body).status_code==422
    body.update(external_record_reference='fixture-member-record',human_confirmed=True)
    assert api.client.post(url(sid,'business-inputs'),json={**body,'metric_id':'unknown'}).status_code==422
    assert api.client.post(url(sid,'business-inputs'),json={**body,'evidence_refs':['event:foreign']}).status_code==422
    response=api.client.post(url(sid,'business-inputs'),json=body)
    assert response.status_code==201,response.text
    result=response.json()
    assert result['source_mode']=='USER_PROVIDED' and result['method']=='MANUAL_IMPORT'
    assert result['verification_status']=='HUMAN_VERIFIED' and result['external_system_connected'] is False
    manual=api.client.post(url(sid,'business-inputs'),json={**body,'source_type':'HUMAN_FEEDBACK','human_confirmed':False}).json()
    assert manual['method']=='HUMAN_INPUT' and manual['verification_status']=='NOT_VERIFIED'


def test_main_application_registers_additive_experience_routes(tmp_path):
    from backend.main import create_app
    with TestClient(create_app(tmp_path/'app-integration')) as client:
        sid=client.post('/api/sessions',json={'name':'API wiring fixture'}).json()['session_id']
        response=client.get(url(sid))
        assert response.status_code==200 and response.json()['session_id']==sid
        assert client.get('/api/experience/framework').json()['schema_version']=='hubone-experience-dictionary/1.2.0'
        assert client.get(f'/api/sessions/{sid}').status_code==200
        assert client.get(f'/api/sessions/{sid}/events').json()==[]

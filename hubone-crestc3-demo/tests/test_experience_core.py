"""Isolated fixtures test guards; these are not model accuracy/consumer evidence."""
import copy
import json
from pathlib import Path

import pytest
from pydantic import ValidationError
from backend.models import Session, Event
from database.store import Store
from vision.live import LiveStore
from experience.core import (ExperienceStore, SourceRef, ResearchContext, AnnotationInput,
    load_source, validate_interval, evidence_index, framework)
from experience.research import run_research,current_research_fingerprint

@pytest.fixture
def sample(tmp_path):
    store=Store(tmp_path)
    sid=store.create_session(Session(name='Isolated code fixture'))['session_id']
    sid2=store.create_session(Session(name='Other fixture'))['session_id']
    live=LiveStore(store)
    live.save({'session_id':sid,'status':'STOPPED','metrics':{'width':100,'height':100,'source_fps':25}})
    name='000000000001.jpg'
    path=tmp_path/'live_frames'/sid/name;path.parent.mkdir(parents=True);path.write_bytes(b'test-only-jpeg-fixture')
    event=Event(session_id=sid,timestamp=1,source='video',event_type='person_detected',description='Test-only source record',
        evidence={'snapshot':name,'frame_index':1},metadata={'source_type':'RTSP','source_mode':'LIVE','simulated':False})
    store.write_events(sid,[event],'live')
    live.append({'session_id':sid,'timestamp':1,'frame_index':1,'snapshot':name,'event_ids':[event.event_id],
        'tracks':[{'track_id':'0-1-1','bbox':[1,2,40,80],'image_zone_id':'image-roi','keypoints':[]}],
        'source_type':'RTSP','source_mode':'LIVE'})
    return store,ExperienceStore(store),sid,sid2,event

def test_framework_preserves_business_axes():
    data=framework()
    assert {d['id'] for d in data['dimensions']}=={'WHO','ATTENTION','UNDERSTANDING','EXPERIENCE','DECISION','LATENT_NEEDS'}
    assert len(data['support_dimensions'])==5 and len(data['report_templates'])==8
    for dimension in data['dimensions']:
        for metric in dimension['metrics']:
            assert all(key in metric for key in ('definition','source','collection','calculation','confidence','conditions','exclusions','pdf_ref'))

def test_member_attributes_require_project_authorization():
    with pytest.raises(ValidationError): ResearchContext(membership_reference='project-token')
    with pytest.raises(ValidationError): ResearchContext(consumer_characteristics={'age_band':'adult'},authorization_status='AUTHORIZED')
    context=ResearchContext(membership_reference='project-token',authorization_status='AUTHORIZED',
        authorization_reference='test-consent-record',research_purpose='test-only research')
    assert context.membership_reference=='project-token'

def test_no_verified_product_without_evidence():
    with pytest.raises(ValidationError): ResearchContext(product_present_verified=True)

def test_side_records_do_not_modify_source_or_cross_session(sample):
    store,records,sid,other,event=sample
    before=copy.deepcopy(store.events(sid))
    record=records.append(sid,'annotation',{'label':'UNKNOWN'})
    assert store.events(sid)==before
    with pytest.raises(KeyError): records.record(other,record['record_id'])
    assert records.list(other,'annotation')==[]

def test_live_source_zone_and_no_fabricated_keypoints(sample):
    store,_,sid,_,_=sample
    document=load_source(store,sid,SourceRef(kind='live'))
    assert document['source_mode']=='REAL_LIVE'
    assert document['frames'][0]['tracks'][0]['inside_zone'] is True
    assert document['frames'][0]['tracks'][0]['keypoints']==[]
    assert document['media_kind']=='SAMPLED_FRAMES'
    assert document['cad_status']=='NOT_CONNECTED'

def test_source_reference_requires_compatible_asset():
    with pytest.raises(ValidationError): SourceRef(kind='live',asset_id='irrelevant')
    with pytest.raises(ValidationError): SourceRef(kind='recording')

def test_annotation_requires_current_source_and_observed_track(sample):
    store,_,sid,_,_=sample
    doc=load_source(store,sid,SourceRef(kind='live'))
    body=AnnotationInput(source_ref=SourceRef(kind='live'),source_fingerprint=doc['fingerprint'],
        track_id='0-1-1',label='UNKNOWN',start=1,end=1)
    assert validate_interval(doc,body)==[doc['frames'][0]['evidence_ref']]
    with pytest.raises(ValueError): validate_interval(doc,body.model_copy(update={'track_id':'wrong'}))
    with pytest.raises(ValueError): validate_interval(doc,body.model_copy(update={'end':5}))
    with pytest.raises(ValueError): validate_interval(doc,body.model_copy(update={'source_fingerprint':'0'*64}))

def test_live_evidence_bridge_keeps_original_event(sample):
    store,_,sid,_,event=sample
    before=store.events(sid)
    index=evidence_index(store,sid)
    assert index[event.event_id]['frame_url'].endswith('/000000000001.jpg')
    assert store.events(sid)==before

def test_live_evidence_requires_session_observation_membership(sample):
    store,_,sid,_,event=sample
    forged=Event(session_id=sid,timestamp=1,source='video',event_type='person_detected',description='not attached',
        evidence={'snapshot':'000000000001.jpg'},metadata={'source_type':'RTSP'})
    store.write_events(sid,[forged],'fixture')
    with pytest.raises(ValueError,match='reference mismatch'): evidence_index(store,sid)

def test_live_evidence_rejects_traversal(sample):
    store,_,sid,_,_=sample
    forged=Event(session_id=sid,timestamp=1,source='video',event_type='person_detected',description='bad path',
        evidence={'snapshot':'../000000000001.jpg'},metadata={'source_type':'RTSP'})
    store.write_events(sid,[forged],'fixture')
    with pytest.raises(ValueError,match='Invalid LIVE'): evidence_index(store,sid)

def test_original_recording_frame_contract_retained(sample):
    store,_,sid,_,_=sample
    asset={'asset_id':'fixture-asset','session_id':sid,'kind':'video','filename':'fixture.mp4','original_name':'fixture',
        'simulated':False,'sha256':'a'*64,'recording_mode':'REAL_RECORDING'}
    store.save_asset(asset)
    event=Event(session_id=sid,timestamp=2,source='video',event_type='person_detected',description='recording fixture',
        evidence={'asset_id':'fixture-asset','snapshot':'0000020.jpg'},metadata={})
    store.write_events(sid,[event],'recording')
    assert evidence_index(store,sid)[event.event_id]['frame_url'].endswith('/frames/0000020.jpg')

def test_research_is_draft_and_uses_existing_validated_decision(sample):
    store,records,sid,_,_=sample
    records.append(sid,'context',ResearchContext(environment='HOME_TEST').model_dump())
    report=run_research(store,records,sid)
    assert report['status']=='DRAFT_REQUIRES_HUMAN_REVIEW'
    assert report['generation']['model_inference_executed'] is False
    assert len(report['workflow'])==4
    assert len(report['report_templates'])==8
    assert report['unique_consumer_count'] is None
    assert report['product_interaction_status']=='UNKNOWN'
    assert all(not x['product_recommendations'] for x in report['report_templates'])
    assert all(m['status']=='INSUFFICIENT_EVIDENCE' for d in report['dimensions'] for m in d['metrics'])

def test_real_research_excludes_simulation_and_reference_audio(sample):
    store,records,sid,_,_=sample
    for description,metadata in [('simulated words',{'simulated':True}),('reference sample',{'research_scope':'REFERENCE_TECHNICAL_TEST'})]:
        event=Event(session_id=sid,timestamp=1,source='audio',event_type='utterance',description=description,
            evidence={'quote':description},metadata={'raw_text':description,**metadata})
        store.write_events(sid,[event],'test-audio')
    report=run_research(store,records,sid)
    assert len(report['excluded_evidence'])==2
    assert report['feedback']['utterance_count']==0
    assert not report['temporal_links']

def test_policy_denied_or_deletion_requested_pauses_new_research(sample):
    store,records,sid,_,_=sample
    records.append(sid,'context',ResearchContext(deletion_status='REQUESTED').model_dump())
    with pytest.raises(ValueError,match='paused'): run_research(store,records,sid)

def test_simulated_asset_cannot_be_laundered_by_missing_event_metadata(sample):
    store,records,sid,_,_=sample
    store.save_asset({'asset_id':'simulated-audio','session_id':sid,'kind':'audio',
        'filename':'simulated.wav','original_name':'simulated','simulated':True})
    event=Event(session_id=sid,timestamp=1,source='audio',event_type='utterance',description='fixture synthetic speech',
        evidence={'asset_id':'simulated-audio','quote':'fixture synthetic speech'},metadata={'raw_text':'fixture synthetic speech'})
    store.write_events(sid,[event],'fixture')
    report=run_research(store,records,sid)
    assert report['feedback']['utterance_count']==0
    assert event.event_id in {e['event_id'] for e in report['excluded_evidence']}

def test_report_fingerprint_changes_when_source_or_context_changes(sample):
    store,records,sid,_,_=sample
    before=current_research_fingerprint(store,records,sid)
    records.append(sid,'context',ResearchContext(research_purpose='new purpose').model_dump())
    assert current_research_fingerprint(store,records,sid)!=before

def test_changed_observations_exclude_stale_behavior_summary(sample):
    store,records,sid,_,_=sample
    doc=load_source(store,sid,SourceRef(kind='live'))
    records.append(sid,'behavior_run',{'source_ref':doc['source_ref'],'source_fingerprint':doc['fingerprint'],
        'predictions':[{'label':'WALKING','status':'CANDIDATE'}]})
    before=current_research_fingerprint(store,records,sid)
    assert run_research(store,records,sid)['behavior_summary']['candidates']=={'WALKING':1}
    LiveStore(store).append({'session_id':sid,'timestamp':2,'frame_index':2,'snapshot':'000000000002.jpg',
        'tracks':[],'event_ids':[]})
    assert current_research_fingerprint(store,records,sid)!=before
    report=run_research(store,records,sid)
    assert report['behavior_summary']['candidates']=={}
    assert report['behavior_summary']['source_states'][0]['status']=='SOURCE_CHANGED'

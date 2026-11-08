"""Isolated synthetic contracts; never camera, consumer evidence or LLM inference."""
from copy import deepcopy
from dataclasses import replace
import json
from pathlib import Path

import httpx
import pytest

from adapters.providers import GenerationResponse,HTTPProvider,ProviderConfig
from backend.models import Session,ResearchBrief,Event
from experience.acl import (protocol,overview,observation_context,preliminary,StageInput,
    FeedbackInput,save_feedback,save_stage)
from experience.research import run_research,current_research_fingerprint
from tests.test_experience_api import api,track,live_source,url


@pytest.fixture(autouse=True)
def no_network(monkeypatch):
    def forbidden(*args,**kwargs):raise AssertionError('No external HTTP in ACL software tests')
    monkeypatch.setattr(httpx.HTTPTransport,'handle_request',forbidden)


def acl_session(api):
    return api.store.create_session(Session(product='ACL Knee Brace',name='Synthetic ACL test only',simulated=False,
        research=ResearchBrief(question='ACL usability test fixture',tasks=['Planned ACL task'],
            objective='Isolated software fixture, not real consumer research',decision_to_support='Test evidence gates')) )['session_id']


def source(api,sid,count=12,status='STOPPED',tracks=1):
    api.live.save({'session_id':sid,'status':status,'source_type':'RTSP','metrics':{'width':320,'height':240,'source_fps':25}})
    folder=api.store.root/'live_frames'/sid;folder.mkdir(parents=True)
    for n in range(count):
        people=[]
        for k in range(tracks):
            person=track();person['track_id']=f'fixture-{k}';people.append(person)
        name=f'{n*10:012d}.jpg';(folder/name).write_bytes(b'isolated fixture; not a rendered evidence image')
        api.live.append({'session_id':sid,'timestamp':n*.4,'frame_index':n*10,'snapshot':name,'tracks':people,'event_ids':[]})


def authorize(api,sid):
    api.records.append(sid,'context',{'research_purpose':'Fixture-only authorized API test','environment':'HOME_TEST',
        'authorization_status':'AUTHORIZED','authorization_reference':'TEST_ONLY',
        'deletion_status':'ACTIVE','product_present_verified':False,'product_evidence_refs':[],
        'time_alignment_status':'UNKNOWN'})


def fake_deepseek(monkeypatch,data,callback=None):
    cfg=ProviderConfig('deepseek','https://api.deepseek.com','deepseek-flash','fixture-not-real',pro_model='deepseek-v4-pro')
    monkeypatch.setattr(ProviderConfig,'from_env',classmethod(lambda cls:cfg))
    monkeypatch.setenv('HUBONE_DEEPSEEK_CLOUD_ENABLED','1')
    calls=[]
    def generate(self,request):
        calls.append(request)
        if callback:callback()
        return GenerationResponse(deepcopy(data),{'provider':'OFFLINE_FIXTURE','model':self.config.model,
            'model_inference_executed':False,'processing_method':'OFFLINE_TEST'})
    monkeypatch.setattr(HTTPProvider,'generate',generate)
    return calls


def test_protocol_is_acl_and_crest_dictionary_remains_unchanged(api):
    before=api.client.get('/api/experience/framework').json()['crest_c3_template']
    value=api.client.get('/api/experience/acl/protocol').json()
    assert value['product']=='ACL Knee Brace' and len(value['stages'])==8 and len(value['feedback_fields'])==7
    assert all(s['status']=='TEMPLATE_NOT_OBSERVED' for s in value['stages'])
    sid=api.store.create_session(Session(product='Crest C3'))['session_id']
    assert api.client.get(url(sid,'acl')).status_code==422
    assert api.client.get('/api/experience/framework').json()['crest_c3_template']==before


def test_empty_acl_overview_never_fabricates_phase_or_feedback(api):
    sid=acl_session(api);doc=overview(api.store,api.records,sid)
    assert all(s['status']=='INSUFFICIENT_EVIDENCE' and s['duration_seconds'] is None for s in doc['stage_summary'])
    assert doc['feedback']==[] and doc['source_status']=='NOT_CONNECTED'
    assert doc['latest_preliminary'] is None and doc['latest_research'] is None


def test_live_preview_uses_existing_observations_and_bounded_window(api):
    sid=acl_session(api);source(api,sid,140,status='LIVE')
    before=api.store.events(sid)
    doc=overview(api.store,api.records,sid)
    assert doc['source_status']=='LIVE' and doc['source_sampled_frames']==140
    assert doc['live_candidates']['status']=='PROVISIONAL' and doc['live_candidates']['sampled_frames']==120
    assert doc['live_candidates']['model_inference_executed'] is False
    assert doc['behavior_runs']==[] and api.store.events(sid)==before


def test_feedback_retains_original_manual_text_and_defaults_unverified(api):
    sid=acl_session(api)
    response=api.client.post(url(sid,'acl/feedback'),json={'timestamp':3,'values':{'comfort':'Synthetic fixture text only'}})
    assert response.status_code==201,response.text
    value=response.json();events=api.store.events(sid)
    assert value['verification_status']=='NOT_VERIFIED' and value['method']=='HUMAN_INPUT'
    assert events[0]['source']=='manual' and events[0]['metadata']['raw_text']=='Synthetic fixture text only'
    assert events[0]['evidence']['quote']=='Synthetic fixture text only' and not events[0]['metadata']['simulated']
    assert api.records.context(sid)['product_present_verified'] is False
    assert 'removal_difficulty' not in value['values']


@pytest.mark.parametrize('body',[{'timestamp':0,'values':{}},{'timestamp':0,'values':{'invented':'x'}},
    {'timestamp':0,'values':{'comfort':'  '}},{'timestamp':0,'values':{'comfort':'x'},'evidence_refs':['event:foreign']}])
def test_invalid_feedback_does_not_create_records(api,body):
    sid=acl_session(api)
    assert api.client.post(url(sid,'acl/feedback'),json=body).status_code==422
    assert api.store.events(sid)==[] and api.records.list(sid,'acl_feedback')==[]


def test_stage_interval_is_recorded_only_by_explicit_input_and_correct_source(api):
    sid=acl_session(api);source(api,sid)
    value=save_stage(api.store,api.records,sid,StageInput(stage_id='wear',start=.4,end=1.2))
    assert value['duration_seconds']==pytest.approx(.8) and value['verification_status']=='NOT_VERIFIED'
    assert value['evidence_refs'] and all(r.startswith('observation:') for r in value['evidence_refs'])
    assert api.records.context(sid)['product_present_verified'] is False
    assert overview(api.store,api.records,sid)['stage_summary'][2]['status']=='NOT_VERIFIED'
    with pytest.raises(ValueError,match='saved observation'):save_stage(api.store,api.records,sid,StageInput(stage_id='wear',start=100))
    other=acl_session(api);source(api,other)
    with pytest.raises(ValueError,match='not available'):save_stage(api.store,api.records,other,StageInput(stage_id='wear',start=0,evidence_refs=value['evidence_refs']))


def test_only_explicit_user_confirmation_changes_human_verification(api):
    sid=acl_session(api);source(api,sid)
    value=save_feedback(api.store,api.records,sid,FeedbackInput(timestamp=1,values={'fit':'Fixture'},human_confirmed=True))
    assert value['verification_status']=='HUMAN_VERIFIED'
    assert api.records.context(sid)['product_present_verified'] is False


def test_frozen_behavior_job_reuses_source_without_visual_inference(api):
    sid=acl_session(api);source(api,sid,status='LIVE')
    queued=api.client.post(url(sid,'acl/behaviors'),json={'source_ref':{'kind':'live'}}).json()
    with pytest.raises(ValueError,match='Stop capture'):api.queue.run(queued['job_id'])
    state=api.live.session(sid);state['status']='STOPPED';api.live.save(state)
    queued=api.client.post(url(sid,'acl/behaviors'),json={'source_ref':{'kind':'live'}}).json()
    result=api.queue.run(queued['job_id'])
    assert result['method']=='RULE_BASED' and result['verification_status']=='NOT_VERIFIED'
    assert result['sampled_frames']==12 and result['model_inference_executed'] is False
    assert api.store.events(sid)==[]


def test_observation_selection_is_original_bounded_and_covers_last_time(api):
    sid=acl_session(api);source(api,sid,80,tracks=3)
    before=api.live.observations(sid,0,100)['items']
    entries,context=observation_context(api.store,api.records,sid)
    assert len(entries)<=24 and context['status']=='SELECTION_NOT_EXHAUSTIVE'
    assert context['source_frame_count']==80 and context['source_record_count']==240
    assert max(e['timestamp'] for e in entries.values())==pytest.approx(79*.4)
    assert all(e['source_record_type']=='Observation' and e['method']=='MODEL_BASED' and e['frame_url'] for e in entries.values())
    assert context['derived_candidates']==[] and api.store.events(sid)==[]
    assert api.live.observations(sid,0,100)['items']==before


def test_preliminary_single_mock_call_and_real_source_references(api,monkeypatch):
    sid=acl_session(api);source(api,sid);authorize(api,sid)
    entries,_=observation_context(api.store,api.records,sid);eid=next(iter(entries))
    data={'summary':'Synthetic summary, no consumer conclusion','findings':[{'topic':'Raw record',
        'statement':entries[eid]['description'],'classification':'FACT','evidence_ids':[eid]}],
        'data_gaps':['No actual human feedback in this fixture']}
    calls=fake_deepseek(monkeypatch,data)
    value=preliminary(api.store,api.records,sid)
    assert len(calls)==1 and calls[0].task=='research'
    assert value['generation']['model_inference_executed'] is False and value['publication_status']=='NOT_PUBLISHED'
    assert value['evidence_index'] and api.store.events(sid)==[]


def test_preliminary_rejects_rewritten_fact_without_retry(api,monkeypatch):
    sid=acl_session(api);source(api,sid);authorize(api,sid)
    entries,_=observation_context(api.store,api.records,sid);eid=next(iter(entries))
    calls=fake_deepseek(monkeypatch,{'summary':'Fixture','findings':[{'topic':'Wrong','statement':'Brace was successfully fitted',
        'classification':'FACT','evidence_ids':[eid]}],'data_gaps':['Fixture']})
    with pytest.raises(ValueError,match='FACT'):preliminary(api.store,api.records,sid)
    assert len(calls)==1 and api.records.list(sid,'acl_preliminary')==[]


def test_preliminary_rejects_source_change_during_call(api,monkeypatch):
    sid=acl_session(api);source(api,sid);authorize(api,sid)
    data={'summary':'Fixture','findings':[{'topic':'Missing','statement':'Evidence unavailable',
        'classification':'INSUFFICIENT_EVIDENCE','evidence_ids':[]}],'data_gaps':['Fixture']}
    def mutate():save_feedback(api.store,api.records,sid,FeedbackInput(timestamp=1,values={'fit':'New fixture source'}))
    calls=fake_deepseek(monkeypatch,data,mutate)
    with pytest.raises(ValueError,match='source changed'):preliminary(api.store,api.records,sid)
    assert len(calls)==1


def test_acl_report_does_not_apply_crest_template_or_feedback_advice(api):
    sid=acl_session(api);source(api,sid);authorize(api,sid)
    save_feedback(api.store,api.records,sid,FeedbackInput(timestamp=1,values={'comfort':'固定带很紧（软件测试）'}))
    value=run_research(api.store,api.records,sid,provider='rules')
    assert value['product']=='ACL Knee Brace' and value['product_template']['product']=='ACL Knee Brace'
    assert 'crest_c3_template' not in value and value['feedback']['clusters']==[]
    assert value['research']['question']=='ACL usability test fixture'
    assert value['decision_analysis']['options']==[] and value['human_feedback']
    assert any(e['source_record_type']=='Observation' for e in value['evidence_index'] if 'source_record_type' in e)


def test_acl_pro_uses_existing_decision_guard_and_preserves_sources(api,monkeypatch):
    sid=acl_session(api);source(api,sid);authorize(api,sid)
    raw=run_research(api.store,api.records,sid,provider='rules')['decision_analysis']
    calls=fake_deepseek(monkeypatch,raw)
    value=run_research(api.store,api.records,sid,provider='llm')
    assert len(calls)==1 and calls[0].task=='decision'
    context=calls[0].payload['comparison_context']['acl_context']
    assert context['candidate_policy'].startswith('RULE_BASED') and context['product_presence_verified'] is False
    assert value['generation']['validation']=='schema_and_reference_integrity_passed'


def test_missing_evidence_frame_blocks_model_before_call(api,monkeypatch):
    sid=acl_session(api);source(api,sid);authorize(api,sid)
    (api.store.root/'live_frames'/sid/'000000000000.jpg').unlink()
    calls=fake_deepseek(monkeypatch,{})
    with pytest.raises(ValueError,match='evidence frame is unavailable'):preliminary(api.store,api.records,sid)
    assert calls==[]


def test_acl_report_exposes_own_rule_counts_without_relabeling_as_verified(api):
    sid=acl_session(api);source(api,sid);authorize(api,sid)
    job=api.client.post(url(sid,'acl/behaviors'),json={'source_ref':{'kind':'live'}}).json()
    run=api.queue.run(job['job_id'])
    value=run_research(api.store,api.records,sid,provider='rules')
    assert value['behavior_summary']['candidates']==run['candidate_sample_counts']
    assert value['behavior_summary']['verification_status']=='NOT_VERIFIED'
    assert value['behavior_summary']['method']=='RULE_BASED'


def test_acl_machine_selection_keeps_all_human_events_and_time_boundaries():
    from experience.acl import select_model_evidence,model_selection_context
    index={}
    kinds=('person_detected','zone_enter','zone_exit')
    for n in range(130):
        index[f'm-{n}']={'event_id':f'm-{n}','timestamp':float(n),'source':'video',
            'event_type':kinds[n%3],'processing_method':'REAL_MODEL' if n%3==0 else 'RULE_BASED'}
    for n in range(7):
        index[f'h-{n}']={'event_id':f'h-{n}','timestamp':130+n,'source':'manual',
            'event_type':'utterance','processing_method':'MANUAL'}
    for n in range(24):
        index[f'o-{n}']={'event_id':f'o-{n}','timestamp':float(n),'source':'video',
            'event_type':'track_observation','processing_method':'REAL_MODEL','source_record_type':'Observation'}
    before=deepcopy(index);selected,audit=select_model_evidence(index)
    assert index==before and len(selected)==43
    assert all(f'h-{n}' in selected for n in range(7)) and all(f'o-{n}' in selected for n in range(24))
    assert 'm-0' in selected and 'm-129' in selected and any(50<=v['timestamp']<=80 for k,v in selected.items() if k.startswith('m-'))
    assert audit['source_original_event_count']==137 and audit['omitted_original_event_count']==118
    assert set(audit['omitted_original_event_ids'])==set(index)-set(selected)
    wire=model_selection_context({**audit,'not_selected_observation_ids':list(range(1900))})
    assert 'omitted_original_event_ids' not in wire and 'not_selected_observation_ids' not in wire
    assert wire['not_selected_observation_count']==1900 and audit['omitted_original_event_ids']


def test_acl_pro_selects_repeated_visual_events_but_report_retains_full_evidence(api,monkeypatch):
    from experience.acl import select_model_evidence,single_request_preflight
    from experience.core import evidence_index
    from analysis.decision import rules_decision
    sid=acl_session(api);source(api,sid,80,tracks=3);authorize(api,sid)
    events=[Event(session_id=sid,timestamp=n*.2,source='video',event_type='person_detected',
        description='Synthetic machine fixture only',metadata={'processing_method':'REAL_MODEL','input_origin':'TEST'}) for n in range(130)]
    api.store.write_events(sid,events,'acl-offline-fixture')
    values={key:'Synthetic human fixture '+key for key,_ in __import__('experience.acl',fromlist=['FIELDS']).FIELDS}
    save_feedback(api.store,api.records,sid,FeedbackInput(timestamp=30,values=values))
    full=evidence_index(api.store,sid);observations,_=observation_context(api.store,api.records,sid);full.update(observations)
    selected,_=select_model_evidence(full)
    single_request_preflight(api.store.session(sid),selected)
    raw=rules_decision([],selected,'Synthetic selected-source fixture',api.store.session(sid)['research'])
    calls=fake_deepseek(monkeypatch,raw)
    report=run_research(api.store,api.records,sid,provider='llm')
    assert len(calls)==1 and len(calls[0].payload['untrusted_events'])==43
    assert len(report['evidence_index'])==161 and len(api.store.events(sid))==137
    assert report['event_selection']['omitted_original_event_count']==118
    assert all(e['event_id'] in selected for e in api.store.events(sid) if e['source']=='manual')


def test_unknown_stage_is_independent_record_without_invented_event(api):
    sid=acl_session(api)
    response=api.client.post(url(sid,'acl/stages'),json={'stage_id':'wear','start':None,'end':None,'notes':'Times are not known'})
    assert response.status_code==201,response.text
    value=response.json()
    assert value['start'] is None and value['end'] is None and value['duration_seconds'] is None
    assert value['event_id'] is None and value['source_fingerprint'] is None and api.store.events(sid)==[]
    summary=overview(api.store,api.records,sid)['stage_summary'][2]
    assert summary['timing_status']=='UNKNOWN' and summary['stage_verification_status']=='NOT_VERIFIED'
    assert summary['feedback_status']=='INSUFFICIENT_EVIDENCE' and summary['record_count']==1


@pytest.mark.parametrize('start,end,anchor',[(None,.8,.8),(.8,None,.8),(.4,1.2,.4)])
def test_known_stage_boundaries_keep_missing_values_and_source_anchors(api,start,end,anchor):
    sid=acl_session(api);source(api,sid)
    before=api.live.observations(sid,0,100)['items']
    response=api.client.post(url(sid,'acl/stages'),json={'stage_id':'wear','start':start,'end':end})
    assert response.status_code==201,response.text
    value=response.json();event=api.store.events(sid)[0]
    assert value['start']==start and value['end']==end
    assert event['timestamp']==anchor and event['metadata']['start_timestamp']==start and event['metadata']['end_timestamp']==end
    assert value['evidence_refs'] and value['verification_status']=='NOT_VERIFIED'
    summary=overview(api.store,api.records,sid)['stage_summary'][2]
    assert summary['timing_status']==('RECORDED' if start is not None and end is not None else 'PARTIAL')
    assert summary['duration_seconds']==(end-start if start is not None and end is not None else None)
    assert api.live.observations(sid,0,100)['items']==before


@pytest.mark.parametrize('boundaries',[{'end':9},{'start':9},{'start':.8,'end':.4},{'end':-1},{'start':-1}])
def test_invalid_stage_boundaries_do_not_write_any_record(api,boundaries):
    sid=acl_session(api);source(api,sid)
    response=api.client.post(url(sid,'acl/stages'),json={'stage_id':'wear',**boundaries})
    assert response.status_code==422
    assert api.records.list(sid,'acl_stage')==[] and api.store.events(sid)==[]


def feedback_link(api,sid,feedback,**changes):
    body={'feedback_record_id':feedback['record_id'],'feedback_field':'comfort','stage_id':'wear',**changes}
    return api.client.post(url(sid,'acl/feedback-links'),json=body)


def test_feedback_topic_link_preserves_verified_quote_without_completing_stage(api):
    sid=acl_session(api)
    feedback=save_feedback(api.store,api.records,sid,FeedbackInput(timestamp=418.453,values={'comfort':'Original human words'},human_confirmed=True))
    before_records=deepcopy(api.records.list(sid,'acl_feedback'));before_events=deepcopy(api.store.events(sid))
    result=feedback_link(api,sid,feedback)
    assert result.status_code==201,result.text
    link=result.json()
    assert link['link_kind']=='TOPIC_ASSOCIATION' and link['verification_status']=='NOT_VERIFIED'
    assert link['proves_stage_completion'] is False and link['feedback_event_id']==before_events[0]['event_id']
    doc=overview(api.store,api.records,sid);item=doc['feedback_items'][0];summary=doc['stage_summary'][2]
    assert item['original_text']=='Original human words' and item['verification_status']=='HUMAN_VERIFIED'
    assert item['linked_stages'][0]['verification_status']=='NOT_VERIFIED'
    assert summary['status']=='FEEDBACK_AVAILABLE' and summary['feedback_status']=='FEEDBACK_AVAILABLE'
    assert summary['stage_verification_status']=='INSUFFICIENT_EVIDENCE' and summary['timing_status']=='UNKNOWN'
    assert summary['start'] is None and summary['end'] is None and summary['duration_seconds'] is None
    assert summary['linked_feedback'][0]['verification_status']=='HUMAN_VERIFIED'
    assert summary['linked_feedback'][0]['link_verification_status']=='NOT_VERIFIED'
    assert api.records.list(sid,'acl_feedback')==before_records and api.store.events(sid)==before_events
    assert api.records.list(sid,'acl_stage')==[] and api.records.context(sid)['product_present_verified'] is False


def test_feedback_links_are_append_only_and_do_not_raise_stage_verification(api):
    sid=acl_session(api)
    feedback=save_feedback(api.store,api.records,sid,FeedbackInput(timestamp=2,values={'comfort':'Fixture'}))
    stage=save_stage(api.store,api.records,sid,StageInput(stage_id='wear'))
    first=feedback_link(api,sid,feedback,stage_record_id=stage['record_id']).json()
    second=feedback_link(api,sid,feedback,stage_record_id=stage['record_id'],human_confirmed=True,notes='Explicit confirmation of topic only').json()
    assert first['record_id']!=second['record_id'] and first['verification_status']=='NOT_VERIFIED'
    assert second['verification_status']=='HUMAN_VERIFIED'
    doc=overview(api.store,api.records,sid)
    assert len(doc['feedback_links'])==2 and len(doc['feedback_items'][0]['linked_stages'])==2
    assert doc['stage_summary'][2]['status']=='NOT_VERIFIED'
    assert doc['stage_summary'][2]['stage_verification_status']=='NOT_VERIFIED'
    assert doc['feedback_items'][0]['verification_status']=='NOT_VERIFIED'


def test_feedback_event_mapping_uses_field_metadata_not_list_order(api):
    sid=acl_session(api)
    value=save_feedback(api.store,api.records,sid,FeedbackInput(timestamp=2,values={'comfort':'Comfort words','fit':'Fit words'}))
    reversed_record=api.records.append(sid,'acl_feedback',{k:v for k,v in {**value,'event_ids':value['event_ids'][::-1]}.items()
        if k not in ('record_id','session_id','record_kind','created_at')})
    response=feedback_link(api,sid,reversed_record)
    assert response.status_code==201,response.text
    event=next(e for e in api.store.events(sid) if e['event_id']==response.json()['feedback_event_id'])
    assert event['metadata']['feedback_field']=='comfort' and event['metadata']['raw_text']=='Comfort words'


def test_feedback_links_reject_foreign_wrong_stage_ai_and_mismatched_original(api):
    sid=acl_session(api);other=acl_session(api)
    own=save_feedback(api.store,api.records,sid,FeedbackInput(timestamp=2,values={'comfort':'Own words'}))
    foreign=save_feedback(api.store,api.records,other,FeedbackInput(timestamp=2,values={'comfort':'Other words'}))
    foreign_stage=save_stage(api.store,api.records,other,StageInput(stage_id='wear'))
    wrong_stage=save_stage(api.store,api.records,sid,StageInput(stage_id='remove'))
    report=api.records.append(sid,'acl_research',{'summary':'Derived report is not original evidence'})
    invalid=[{'feedback_record_id':foreign['record_id']},{'feedback_field':'fit'},
        {'stage_record_id':foreign_stage['record_id']},{'stage_record_id':wrong_stage['record_id']},
        {'feedback_record_id':report['record_id']},{'evidence_refs':['report:'+report['record_id']]},
        {'evidence_refs':['event:'+foreign['event_ids'][0]]}]
    ai=Event(session_id=sid,timestamp=1,source='AI_analysis',event_type='research',description='Derived only')
    api.store.write_events(sid,[ai],'isolated-ai-record')
    invalid.append({'evidence_refs':['event:'+ai.event_id]})
    for changes in invalid:
        assert feedback_link(api,sid,own,**changes).status_code in (404,422),changes
    changed=api.records.append(sid,'acl_feedback',{k:v for k,v in {**own,'values':{'comfort':'Rewritten words'}}.items()
        if k not in ('record_id','session_id','record_kind','created_at')})
    assert feedback_link(api,sid,changed).status_code==422
    assert api.records.list(sid,'acl_feedback_link')==[]


def test_feedback_link_validates_observation_ownership_and_changes_research_fingerprint(api):
    sid=acl_session(api);other=acl_session(api);source(api,sid);source(api,other)
    own=save_feedback(api.store,api.records,sid,FeedbackInput(timestamp=2,values={'comfort':'Own words'}))
    from experience.core import load_source,SourceRef
    own_ref=load_source(api.store,sid,SourceRef(kind='live'))['frames'][0]['evidence_ref']
    foreign_ref=load_source(api.store,other,SourceRef(kind='live'))['frames'][0]['evidence_ref']
    assert feedback_link(api,sid,own,evidence_refs=[foreign_ref]).status_code==422
    before=current_research_fingerprint(api.store,api.records,sid)
    response=feedback_link(api,sid,own,evidence_refs=[own_ref])
    assert response.status_code==201,response.text
    assert current_research_fingerprint(api.store,api.records,sid)!=before


def test_flash_and_pro_receive_original_feedback_link_and_independent_phase_states(api,monkeypatch):
    sid=acl_session(api);source(api,sid);authorize(api,sid)
    original='Original fixture statement, not an observed stage time'
    feedback=save_feedback(api.store,api.records,sid,FeedbackInput(timestamp=418.453,values={'comfort':original},human_confirmed=True))
    assert feedback_link(api,sid,feedback).status_code==201
    data={'summary':'Fixture only','findings':[{'topic':'Missing timing','statement':'No stage time provided',
        'classification':'INSUFFICIENT_EVIDENCE','evidence_ids':[]}],'data_gaps':['Fixture unknown boundaries']}
    calls=fake_deepseek(monkeypatch,data)
    preliminary(api.store,api.records,sid)
    context=calls[0].payload['stage_context']
    assert context['feedback_items'][0]['original_text']==original and context['feedback_links']
    assert context['stage_summary'][2]['timing_status']=='UNKNOWN'
    assert context['stage_summary'][2]['status']=='FEEDBACK_AVAILABLE'
    assert 'TOPIC_ASSOCIATION' in calls[0].system
    raw=run_research(api.store,api.records,sid,provider='rules')['decision_analysis']
    calls=fake_deepseek(monkeypatch,raw)
    report=run_research(api.store,api.records,sid,provider='llm')
    assert len(calls)==1
    context=calls[0].payload['comparison_context']['acl_context']['stage_context']
    assert context['feedback_items'][0]['original_text']==original
    assert context['stage_summary'][2]['stage_verification_status']=='INSUFFICIENT_EVIDENCE'
    assert report['stage_context']==context and context['feedback_links'][0]['verification_status']=='NOT_VERIFIED'


def test_overview_marks_old_reports_stale_without_mutating_them(api):
    sid=acl_session(api);source(api,sid)
    initial=overview(api.store,api.records,sid)
    assert initial['latest_preliminary_source_changed'] is None and initial['latest_research_source_changed'] is None
    frozen=current_research_fingerprint(api.store,api.records,sid)
    first=api.records.append(sid,'acl_preliminary',{'summary':'Stored original draft','source_snapshot_sha256':frozen})
    second=api.records.append(sid,'acl_research',{'summary':'Stored original draft','source_snapshot_sha256':frozen})
    fresh=overview(api.store,api.records,sid)
    assert fresh['latest_preliminary_source_changed'] is False and fresh['latest_research_source_changed'] is False
    save_stage(api.store,api.records,sid,StageInput(stage_id='wear'))
    stale=overview(api.store,api.records,sid)
    assert stale['latest_preliminary_source_changed'] is True and stale['latest_research_source_changed'] is True
    assert api.records.record(sid,first['record_id'])==first and api.records.record(sid,second['record_id'])==second


def test_research_rejects_feedback_link_added_while_collecting_stage_context(api,monkeypatch):
    import experience.acl as acl
    sid=acl_session(api);source(api,sid)
    feedback=save_feedback(api.store,api.records,sid,FeedbackInput(timestamp=2,values={'comfort':'Original fixture'}))
    original=acl.stage_context;calls=[]
    def changed_context(store,records,target):
        result=original(store,records,target)
        calls.append(target)
        acl.save_feedback_link(store,records,target,acl.FeedbackLinkInput(
            feedback_record_id=feedback['record_id'],feedback_field='comfort',stage_id='wear'))
        return result
    monkeypatch.setattr(acl,'stage_context',changed_context)
    with pytest.raises(ValueError,match='ACL source changed'):
        run_research(api.store,api.records,sid,provider='rules')
    assert calls==[sid] and len(api.records.list(sid,'acl_feedback_link'))==1
    assert api.records.list(sid,'acl_research')==[] and api.records.list(sid,'research_report')==[]

"""Offline integration tests: fixtures and MockTransport, never actual inference.

No production Store, database, .env or server is opened by these tests.
"""
import copy
import importlib
import json
from pathlib import Path
from types import SimpleNamespace

import httpx
import pytest

from tests.test_deepseek_provider import (isolated_model_environment, providers,
    configure, mock_api, answer, REAL_HTTPX_CLIENT)

M=Path(__file__).resolve().parents[1]


@pytest.fixture
def modules(providers):
    return SimpleNamespace(providers=providers,decision=importlib.import_module('analysis.decision'),
        mock=importlib.import_module('adapters.mock_provider'),
        research=importlib.import_module('experience.research'),
        models=importlib.import_module('backend.models'))


@pytest.fixture
def scenario(modules):
    fixture=json.loads((M/'sample_data/decision_session.example.json').read_text(encoding='utf-8'))
    session=modules.models.Session(session_id='offline-integration-fixture',simulated=True,
        research=modules.models.ResearchBrief(**fixture['research'])).model_dump()
    demo=importlib.import_module('analysis.demo')
    events=[e.model_dump() for e in demo.fixture_events(session['session_id'],fixture,{})]
    return session,modules.decision.evidence_snapshot(session,events)


@pytest.mark.parametrize('scores,expected,wrong',[
    ((5,5,1),'P1','P3'),((3,3,3),'P2','P1'),((1,1,5),'P3','P2')])
def test_generate_decision_derives_scores_and_priorities_with_auditable_provenance(monkeypatch,modules,scenario,scores,expected,wrong):
    session,index=scenario
    raw,_=modules.decision.generate_decision(session,index,'mock')
    for card in raw['decision_cards']:
        card.update(impact=scores[0],urgency=scores[1],effort=scores[2],priority_score=8,priority=wrong)
    for option in raw['options']:option['priority']=wrong
    original=copy.deepcopy(raw);evidence_before=copy.deepcopy(index)
    configure(monkeypatch)
    seen=mock_api(monkeypatch,modules.providers,answer(json.dumps(raw,ensure_ascii=False),usage={'prompt_tokens':20,'completion_tokens':10,'total_tokens':30}))
    result,provenance=modules.decision.generate_decision(session,index,'llm')
    score=scores[0]+scores[1]+6-scores[2]
    assert all(card['priority_score']==score and card['priority']==expected for card in result['decision_cards'])
    assert all(option['priority']==expected for option in result['options'])
    assert index==evidence_before and raw==original
    assert result['claims']==raw['claims'] and result['diagnoses']==raw['diagnoses']
    derivation=provenance['priority_derivation']
    assert derivation['method']=='DETERMINISTIC_FROM_MODEL_SCORES'
    assert derivation['model_reasoning_review_required'] is True and len(derivation['changes'])==6
    assert {c['new'] for c in derivation['changes'] if c['field'].endswith('priority_score')}=={score}
    assert provenance['usage']['total_tokens']==30
    assert provenance['response_sha256']!=provenance['normalized_response_sha256']
    assert provenance['validation']=='schema_and_reference_integrity_passed'
    assert provenance['semantic_truth_verified'] is False
    assert provenance['context_preparation']['mode']=='DIRECT'
    assert len(seen)==1 and seen[0]['body']['model']=='deepseek-v4-pro'


def test_mock_path_does_not_call_normalizer_or_cloud(monkeypatch,modules,scenario):
    session,index=scenario
    monkeypatch.setattr(modules.decision,'normalize_model_priorities',lambda raw:pytest.fail('Mock must not be normalized'))
    result,provenance=modules.decision.generate_decision(session,index,'mock')
    assert [o['priority'] for o in result['options']]==['P1','P2']
    assert provenance['provider']=='mock' and provenance['processing_method']=='MOCK'
    assert provenance['model_inference_executed'] is False
    assert provenance['priority_derivation']['changes']==[] and provenance['context_preparation'] is None
    with pytest.raises(ValueError,match='SIMULATED'):
        modules.decision.generate_decision({**session,'simulated':False},index,'mock')


def test_model_normalization_does_not_repair_fabricated_fact(monkeypatch,modules,scenario):
    session,index=scenario;raw,_=modules.decision.generate_decision(session,index,'mock')
    raw['claims'][0]['statement']='This sentence does not exist in the supplied original evidence.'
    raw['decision_cards'][0]['priority_score']=3
    configure(monkeypatch);seen=mock_api(monkeypatch,modules.providers,answer(json.dumps(raw)))
    with pytest.raises(ValueError,match='FACT'):
        modules.decision.generate_decision(session,index,'llm')
    assert len(seen)==1


@pytest.mark.parametrize('fault',[None,'changed_quote','cross_chunk','not_selected_reference','derived_fact'])
def test_batched_context_keeps_selected_originals_and_rejects_derived_or_unseen_facts(monkeypatch,modules,scenario,fault):
    session,index=scenario;original=copy.deepcopy(index)
    configure(monkeypatch,HUBONE_DEEPSEEK_BATCH_EVENTS='2',HUBONE_DEEPSEEK_MAX_BATCHES='4')
    requests=[];batch_refs=[];omitted=[]
    def handle(request):
        body=json.loads(request.content);payload=json.loads(body['messages'][1]['content']);requests.append((body,payload))
        if 'research_context' in payload:
            events=payload['untrusted_events'];selected=events[0];batch_refs.append(selected['event_id']);omitted.extend(e['event_id'] for e in events[1:])
            data={'summary':'DERIVED note, never original evidence','selected_evidence_ids':[selected['event_id']],
                'quotes':[{'event_id':selected['event_id'],'quote':selected['raw_text'] or selected['description']}],
                'limitations':['Software fixture only; selection is not exhaustive.']}
            if fault=='changed_quote':data['quotes'][0]['quote']='An invented replacement quote'
            if fault=='cross_chunk':
                other=next(key for key in index if key not in {e['event_id'] for e in events})
                data['selected_evidence_ids']=[other];data['quotes']=[{'event_id':other,'quote':index[other]['raw_text'] or index[other]['description']}]
        else:
            assert all(e=={k:index[e['event_id']][k] for k in e} for e in payload['untrusted_events'])
            assert all(note['classification']=='DERIVED' and note['use_as_original_evidence'] is False for note in payload['derived_batch_notes'])
            data=modules.mock.MockProvider().generate(modules.providers.GenerationRequest('fixture',payload)).data
            if fault=='not_selected_reference':
                eid=omitted[0];data['claims'][0].update(evidence_ids=[eid],statement=index[eid]['raw_text'] or index[eid]['description'])
            if fault=='derived_fact':data['claims'][0]['statement']='DERIVED note, never original evidence'
        return httpx.Response(200,json=answer(json.dumps(data,ensure_ascii=False)))
    transport=httpx.MockTransport(handle)
    monkeypatch.setattr(modules.providers.httpx,'Client',lambda **kwargs:REAL_HTTPX_CLIENT(transport=transport,**kwargs))
    if fault:
        with pytest.raises(ValueError):modules.decision.generate_decision(session,index,'llm')
        assert len(requests)==(1 if fault in ('changed_quote','cross_chunk') else 5)
    else:
        result,provenance=modules.decision.generate_decision(session,index,'llm')
        audit=provenance['context_preparation']
        assert audit['mode']=='BATCHED_SELECTION' and audit['model_calls']==4
        assert audit['source_event_count']==8 and audit['selected_event_count']==4
        assert audit['selection_is_exhaustive'] is False
        assert set(audit['selected_ids'])==set(batch_refs) and set(audit['not_selected_ids'])==set(omitted)
        assert set(audit['source_coverage_ids'])==set(index)
        assert all(set(item['evidence_ids'])<=set(batch_refs) for item in modules.decision.analysis_items(result))
        assert len(requests)==5
        assert all(body['model']=='deepseek-flash' and body['max_tokens']==4096 for body,payload in requests[:-1])
        assert requests[-1][0]['model']=='deepseek-v4-pro'
        assert requests[-1][1]['context_selection']['exhaustive'] is False
    assert index==original


def test_batch_budget_failure_happens_before_any_model_request(monkeypatch,modules,scenario):
    session,index=scenario
    configure(monkeypatch,HUBONE_DEEPSEEK_BATCH_EVENTS='1',HUBONE_DEEPSEEK_MAX_BATCHES='1')
    seen=mock_api(monkeypatch,modules.providers,answer())
    with pytest.raises(ValueError,match='分段数'):
        modules.decision.generate_decision(session,index,'llm')
    assert seen==[]


def research_fixture(monkeypatch,modules,*,simulated,authorization='UNKNOWN',reference=None):
    sid='offline-research-gate-fixture'
    session=modules.models.Session(session_id=sid,simulated=simulated).model_dump()
    context={'authorization_status':authorization,'authorization_reference':reference,'deletion_status':'ACTIVE',
        'research_purpose':'Offline authorization gate test','product_present_verified':False,'product_evidence_refs':[],
        'environment':'HOME_TEST','time_alignment_status':'UNKNOWN'}
    store=SimpleNamespace(session=lambda requested:copy.deepcopy(session),events=lambda requested:[],assets=lambda requested:[])
    records=SimpleNamespace(context=lambda requested:copy.deepcopy(context),list=lambda *args:[])
    monkeypatch.setattr(modules.research,'framework',lambda:{'dimensions':[],'report_templates':[],'crest_c3_template':{}})
    monkeypatch.setattr(modules.research,'evidence_index',lambda *args:{})
    calls=[]
    def generate(effective,index):
        calls.append((effective,index))
        return modules.decision.rules_decision([],{},'Offline fixture',effective['research']),{
            'processing_method':'MOCK','provider':'offline-gate-double','model_inference_executed':False}
    monkeypatch.setattr(modules.research,'generate_decision',generate)
    return sid,store,records,calls


@pytest.mark.parametrize('simulated,authorization,reference',[(True,'UNKNOWN',None),(False,'AUTHORIZED','declared-test-record')])
def test_research_official_deepseek_cloud_requires_toggle_and_simulated_or_authorized_scope(monkeypatch,modules,simulated,authorization,reference):
    sid,store,records,calls=research_fixture(monkeypatch,modules,simulated=simulated,authorization=authorization,reference=reference)
    config=modules.providers.ProviderConfig('deepseek','https://api.deepseek.com','deepseek-flash','offline-dummy')
    monkeypatch.setattr(modules.providers.ProviderConfig,'from_env',classmethod(lambda cls:config))
    monkeypatch.setenv('HUBONE_DEEPSEEK_CLOUD_ENABLED','1')
    report=modules.research.run_research(store,records,sid,'llm')
    assert len(calls)==1 and report['generation']['model_inference_executed'] is False
    assert report['status']=='DRAFT_REQUIRES_HUMAN_REVIEW' and report['publication_status']=='NOT_PUBLISHED'
    assert [row['role'] for row in report['workflow']]==['Observation Agent','Research Agent','Evidence Agent','Decision Agent']


@pytest.mark.parametrize('simulated,authorization,reference,enabled,name,base',[
    (False,'UNKNOWN',None,'1','deepseek','https://api.deepseek.com'),
    (False,'AUTHORIZED',None,'1','deepseek','https://api.deepseek.com'),
    (True,'UNKNOWN',None,'0','deepseek','https://api.deepseek.com'),
    (False,'AUTHORIZED','record','0','deepseek','https://api.deepseek.com'),
    (True,'UNKNOWN',None,'1','deepseek','https://unapproved.invalid'),
    (True,'UNKNOWN',None,'1','deepseek','http://api.deepseek.com'),
    (True,'UNKNOWN',None,'1','custom','https://api.deepseek.com'),
    (True,'UNKNOWN',None,'1','deepseek','https://api.deepseek.com:444'),
    (True,'DENIED',None,'1','deepseek','https://api.deepseek.com'),
])
def test_research_cloud_gate_blocks_before_generation(monkeypatch,modules,simulated,authorization,reference,enabled,name,base):
    sid,store,records,calls=research_fixture(monkeypatch,modules,simulated=simulated,authorization=authorization,reference=reference)
    config=modules.providers.ProviderConfig(name,base,'offline-model','explicit-offline-key')
    monkeypatch.setattr(modules.providers.ProviderConfig,'from_env',classmethod(lambda cls:config))
    monkeypatch.setenv('HUBONE_DEEPSEEK_CLOUD_ENABLED',enabled)
    with pytest.raises(ValueError):modules.research.run_research(store,records,sid,'llm')
    assert not calls


def test_existing_local_research_does_not_require_cloud_opt_in(monkeypatch,modules):
    sid,store,records,calls=research_fixture(monkeypatch,modules,simulated=False)
    config=modules.providers.ProviderConfig('ollama','http://127.0.0.1:11434/v1','local-fixture')
    monkeypatch.setattr(modules.providers.ProviderConfig,'from_env',classmethod(lambda cls:config))
    report=modules.research.run_research(store,records,sid,'llm')
    assert len(calls)==1 and report['publication_status']=='NOT_PUBLISHED'

"""Research API guards using isolated fixtures and mocked model output only."""
import copy

import pytest

from adapters.providers import GenerationResponse, HTTPProvider, ProviderConfig
from backend.models import Event, ResearchBrief
from experience.research import run_research
from tests.test_experience_api import api, session, url


def evidence(api,sid,text='Synthetic API fixture statement only'):
    event=Event(session_id=sid,timestamp=1,source='manual',event_type='fixture',description=text)
    api.store.write_events(sid,[event],'test-only')
    return event


def queued(api,sid,provider='rules'):
    response=api.client.post(url(sid,'research'),json={'provider':provider})
    assert response.status_code==202,response.text
    return response.json()['job_id']


def report(api,sid): return api.queue.run(queued(api,sid))


def review_body(report,**changes):
    return {'report_id':report['record_id'],'report_sha256':report['report_sha256'],
        'human_confirmed':True,'decision':'APPROVED','notes':'Software fixture review; not actual human research validation',**changes}


def mock_gateway(monkeypatch,raw,base='http://127.0.0.1:11434/v1'):
    calls=[]
    monkeypatch.setattr(ProviderConfig,'from_env',classmethod(lambda cls:ProviderConfig('ollama',base,'fixture-model')))
    def forbidden(*args,**kwargs):raise AssertionError('No real LLM or network request allowed in this test')
    monkeypatch.setattr(HTTPProvider,'generate',forbidden)
    class FakeProvider:
        def generate(self,request):
            calls.append(request)
            return GenerationResponse(copy.deepcopy(raw),{'provider':'MOCK_TEST','model':'fixture-only',
                'processing_method':'MOCK_TEST','model_inference_executed':False})
    monkeypatch.setattr('analysis.decision.get_provider',lambda *_:FakeProvider())
    return calls


@pytest.mark.parametrize('mutation',[
    lambda raw:raw['claims'][0].update(evidence_ids=['another-session-evidence']),
    lambda raw:raw['claims'][0].update(statement='Invented definitive consumer conclusion'),
    lambda raw:raw['claims'][0].update(classification='CONFIRMED'),
])
def test_llm_api_cannot_save_forged_evidence_fact_or_classification(api,monkeypatch,mutation):
    sid=session(api);evidence(api,sid)
    raw=run_research(api.store,api.records,sid)['decision_analysis'];mutation(raw)
    calls=mock_gateway(monkeypatch,raw)
    with pytest.raises(ValueError):api.queue.run(queued(api,sid,'llm'))
    assert len(calls)==1 and api.records.list(sid,'research_report')==[]
    assert api.store.report(sid) is None and len(api.store.events(sid))==1


def test_mocked_valid_llm_output_stays_draft_and_keeps_actual_provenance(api,monkeypatch):
    sid=session(api);original=evidence(api,sid)
    raw=run_research(api.store,api.records,sid)['decision_analysis']
    calls=mock_gateway(monkeypatch,raw)
    value=api.queue.run(queued(api,sid,'llm'))
    assert len(calls)==1 and value['generation']['model_inference_executed'] is False
    assert value['generation']['provider']=='MOCK_TEST'
    assert value['generation']['validation']=='schema_and_reference_integrity_passed'
    assert value['generation']['semantic_truth_verified'] is False
    assert value['publication_status']=='NOT_PUBLISHED' and value['status']=='DRAFT_REQUIRES_HUMAN_REVIEW'
    assert api.store.events(sid)==[original.model_dump()]


def test_local_only_research_blocks_cloud_before_gateway_call(api,monkeypatch):
    sid=session(api);evidence(api,sid)
    raw=run_research(api.store,api.records,sid)['decision_analysis']
    calls=mock_gateway(monkeypatch,raw,base='https://cloud.example.invalid/v1')
    with pytest.raises(ValueError,match='Cloud research is NOT CONNECTED'):
        api.queue.run(queued(api,sid,'llm'))
    assert calls==[] and api.records.list(sid,'research_report')==[]


def test_review_requires_human_confirmation_correct_hash_and_session(api):
    sid=session(api);evidence(api,sid);value=report(api,sid)
    body=review_body(value)
    assert api.client.post(url(sid,'reviews'),json={**body,'human_confirmed':False}).status_code==422
    assert api.client.post(url(sid,'reviews'),json={**body,'report_sha256':'0'*64}).status_code==422
    assert api.client.post(url(session(api),'reviews'),json=body).status_code==404
    response=api.client.post(url(sid,'reviews'),json=body)
    assert response.status_code==201,response.text
    saved=response.json()
    assert saved['verification_status']=='HUMAN_VERIFIED' and saved['automatic_publication'] is False
    assert saved['publication_status']=='LOCAL_REVIEW_ONLY'
    frozen=api.records.record(sid,value['record_id'],'research_report')
    assert frozen['status']=='DRAFT_REQUIRES_HUMAN_REVIEW' and frozen['publication_status']=='NOT_PUBLISHED'


@pytest.mark.parametrize('changed',['event','context','research_brief'])
def test_review_rejects_changed_evidence_context_or_research_question(api,changed):
    sid=session(api);evidence(api,sid);value=report(api,sid)
    if changed=='event':evidence(api,sid,'A new fixture statement after the report')
    elif changed=='context':
        response=api.client.post(url(sid,'context'),json={'research_purpose':'Changed research scope after the draft'})
        assert response.status_code==201
    else:
        api.store.update_research(sid,ResearchBrief(question='Changed question after the draft').model_dump())
    response=api.client.post(url(sid,'reviews'),json=review_body(value))
    assert response.status_code==422,response.text
    assert api.records.list(sid,'report_review')==[]


def test_queued_research_rechecks_authorization_and_does_not_write_report(api):
    sid=session(api);evidence(api,sid);job=queued(api,sid)
    assert api.client.post(url(sid,'context'),json={'authorization_status':'DENIED'}).status_code==201
    with pytest.raises(ValueError,match='paused'):api.queue.run(job)
    assert api.records.list(sid,'research_report')==[]


def test_reference_audio_never_becomes_consumer_research_claims(api):
    sid=session(api)
    reference=Event(session_id=sid,timestamp=0,source='audio',event_type='utterance',
        description='Fixture technical sample text',evidence={'quote':'Fixture technical sample text'},
        metadata={'raw_text':'Fixture technical sample text','research_scope':'REFERENCE_TECHNICAL_TEST',
                  'input_origin':'REAL_RECORDING_REFERENCE'})
    api.store.write_events(sid,[reference],'fixture-reference')
    value=report(api,sid)
    assert value['timeline']==[] and value['evidence_index']==[]
    assert value['excluded_evidence'][0]['event_id']==reference.event_id
    assert all(item['classification']=='INSUFFICIENT_EVIDENCE' for item in value['decision_analysis']['claims'])

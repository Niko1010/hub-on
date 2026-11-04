"""Cloud software tests only: fixtures + MockTransport, never local Ollama/hardware."""
import copy
import json

import httpx
import pytest

from adapters.providers import GenerationRequest, HTTPProvider, ProviderConfig
from analysis.decision import evidence_snapshot, generate_decision, validate_analysis
from analysis.demo import fixture_events
from analysis.report import build_report
from backend.config import ROOT, CapabilityError
from backend.models import Session, ResearchBrief
from tests.conftest import wait_job


@pytest.fixture
def scenario():
    fixture=json.loads((ROOT/'sample_data/decision_session.example.json').read_text())
    session=Session(session_id='software-test',simulated=True,research=ResearchBrief(**fixture['research'])).model_dump()
    events=[e.model_dump() for e in fixture_events(session['session_id'],fixture,{})]
    index=evidence_snapshot(session,events)
    return session,events,index


def test_mock_report_is_complete_but_never_real_model(scenario):
    session,events,index=scenario
    report=build_report(session,events,'mock')
    assert report['processing_method']=='MOCK' and report['simulated'] is True
    assert report['generation']['provider']=='mock'
    assert report['generation']['model_inference_executed'] is False
    assert report['generation']['semantic_truth_verified'] is False
    assert report['generation']['local_hardware_verified'] is False
    a=report['decision_analysis']
    assert {c['classification'] for c in a['claims']}=={'FACT','INFERENCE','INSUFFICIENT_EVIDENCE'}
    assert report['research']['question']==session['research']['question']
    assert len(report['quotes'])==4 and report['observations']
    assert a['diagnoses'][0]['alternative_explanations']
    assert a['options'] and a['experiments']
    for section in ['研究问题','可观察行为','消费者原话','多模态证据','替代解释','改进选项','验证实验','当前决策','完整原始证据索引']:
        assert section in report['markdown']
    for item in [*a['claims'],*a['diagnoses'],*a['options'],*a['experiments'],a['decision']]:
        assert set(item['evidence_ids'])<=set(index)
        assert all(eid in report['markdown'] for eid in item['evidence_ids'])


@pytest.mark.parametrize('mutation',[
    lambda a:a['claims'][0].update(evidence_ids=['another-session-event']),
    lambda a:a['claims'][0].update(statement='已证实腰带结构导致缺陷'),
    lambda a:a['claims'][0].update(classification='CONFIRMED'),
    lambda a:a['diagnoses'][0].update(alternative_explanations=[]),
    lambda a:a['options'][0].update(diagnosis_ids=['missing-diagnosis']),
    lambda a:a['experiments'][0].update(option_ids=['missing-option']),
    lambda a:a.update(experiments=[]),
    lambda a:a['claims'][0].update(evidence_ids=[]),
    lambda a:a['claims'][1].update(claim_id=a['claims'][0]['claim_id']),
    lambda a:a['decision'].update(data_gaps=['  ']),
    lambda a:a['diagnoses'][0].update(classification='FACT'),
])
def test_reject_bad_schema_claims_and_links(scenario,mutation):
    session,_,index=scenario
    raw,_=generate_decision(session,index,'mock')
    mutation(raw)
    with pytest.raises(ValueError): validate_analysis(raw,index)


def test_mock_is_explicit_and_simulated_session_only(scenario,client,sid):
    session,_,index=scenario
    session['simulated']=False
    with pytest.raises(ValueError,match='SIMULATED'): generate_decision(session,index,'mock')
    assert client.post(f'/api/sessions/{sid}/analyze',json={'provider':'mock'}).status_code==422
    assert client.get(f'/api/sessions/{sid}/report').status_code==409


def test_evidence_asset_time_and_raw_quote_validation(scenario):
    session,events,_=scenario
    event=copy.deepcopy(next(e for e in events if e['source']=='audio'))
    event['evidence']['asset_id']='a1'
    event['timestamp']+=10;event['metadata']['end_timestamp']+=10;event['metadata']['offset_seconds']=10
    asset={'asset_id':'a1','session_id':session['session_id'],'kind':'audio','sha256':'test-fixture-hash'}
    entry=evidence_snapshot(session,[event],[asset])[event['event_id']]
    assert entry['timestamp']==entry['media_time']+10
    assert entry['media_url'].endswith('/assets/a1')
    assert entry['asset_sha256']=='test-fixture-hash'
    event['timestamp']+=1
    with pytest.raises(ValueError,match='偏移'): evidence_snapshot(session,[event],[asset])
    event['timestamp']-=1;event['evidence']['quote']='伪造原话'
    with pytest.raises(ValueError,match='原话'): evidence_snapshot(session,[event],[asset])
    event['evidence']['quote']=event['metadata']['raw_text'];asset['session_id']='foreign'
    with pytest.raises(ValueError,match='Session'): evidence_snapshot(session,[event],[asset])


def test_duplicate_and_derived_evidence_rejected(scenario):
    session,events,_=scenario
    with pytest.raises(ValueError,match='重复'): evidence_snapshot(session,[events[0],events[0]])
    events[0]['source']='AI_analysis'
    with pytest.raises(ValueError,match='派生'): evidence_snapshot(session,events)


@pytest.mark.parametrize('name,path', [('ollama','/v1/chat/completions'),('openai','/v1/chat/completions'),
                                       ('anthropic','/v1/messages'),('custom','/custom/v1/chat/completions')])
def test_four_provider_wire_contracts_mock_http_only(name,path,monkeypatch,scenario):
    session,_,index=scenario
    expected,_=generate_decision(session,index,'mock')
    seen=[]
    def handle(request):
        body=json.loads(request.content);seen.append(body)
        assert request.url.path==path
        assert body['model']=='MOCK_HTTP_PROTOCOL_ONLY'
        if name=='anthropic':
            assert request.headers['x-api-key']=='fake-test-key'
            assert 'Authorization' not in request.headers
            assert body['tool_choice']=={'type':'tool','name':'evidence_to_decision'}
            assert body['tools'][0]['input_schema']['additionalProperties'] is False
            payload={'id':'mock-http','model':'MOCK_HTTP_PROTOCOL_ONLY','stop_reason':'tool_use',
                     'content':[{'type':'tool_use','name':'evidence_to_decision','input':expected}]}
        else:
            assert request.headers.get('Authorization')==('Bearer fake-test-key' if name!='ollama' else None)
            assert body['response_format']['type']=='json_schema'
            assert body['response_format']['json_schema']['strict'] is True
            payload={'id':'mock-http','model':'MOCK_HTTP_PROTOCOL_ONLY',
                     'choices':[{'finish_reason':'stop','message':{'content':json.dumps(expected)}}]}
        return httpx.Response(200,json=payload)
    real=httpx.Client
    monkeypatch.setattr('adapters.providers.httpx.Client',lambda **kw:real(transport=httpx.MockTransport(handle)))
    config=ProviderConfig(name,'http://127.0.0.1'+('/custom/v1' if name=='custom' else '/v1'),
                          'MOCK_HTTP_PROTOCOL_ONLY',None if name=='ollama' else 'fake-test-key')
    from analysis.decision_schema import output_schema
    response=HTTPProvider(config).generate(GenerationRequest('MOCK HTTP transport test',{'test':True},output_schema(index)))
    assert validate_analysis(response.data,index)==expected and len(seen)==1
    # This is a protocol assertion, NOT evidence of actual inference.


@pytest.mark.parametrize('case',['truncated','refused','invalid-json','not-object','http-error','unreachable'])
def test_provider_failure_is_not_success_or_fallback(case,monkeypatch):
    def handle(request):
        if case=='http-error': return httpx.Response(401,text='fake-secret-do-not-surface')
        if case=='unreachable': raise httpx.ConnectError('fake-secret-do-not-surface',request=request)
        message={'content':'{}'};finish='stop'
        if case=='truncated': finish='length'
        if case=='refused': message['refusal']='refused'
        if case=='invalid-json': message['content']='not json'
        if case=='not-object': message['content']='[]'
        return httpx.Response(200,json={'choices':[{'finish_reason':finish,'message':message}]})
    real=httpx.Client
    monkeypatch.setattr('adapters.providers.httpx.Client',lambda **kw:real(transport=httpx.MockTransport(handle)))
    with pytest.raises((ValueError,CapabilityError)) as exc:
        HTTPProvider(ProviderConfig('ollama','http://127.0.0.1:11434/v1','test')).generate(GenerationRequest('test',{}))
    assert 'fake-secret' not in str(exc.value)


def test_provider_config_does_not_forward_other_provider_keys(monkeypatch):
    monkeypatch.setenv('OPENAI_API_KEY','fake-openai-key')
    monkeypatch.setenv('ANTHROPIC_API_KEY','fake-anthropic-key')
    monkeypatch.delenv('LLM_API_KEY',raising=False)
    monkeypatch.setenv('LLM_MODEL','test-model')
    for provider in ('ollama','custom','openai','anthropic'):
        monkeypatch.setenv('LLM_PROVIDER',provider)
        monkeypatch.setenv('LLM_BASE_URL','http://127.0.0.1:9999')
        assert ProviderConfig.from_env().api_key is None
    monkeypatch.setenv('LLM_PROVIDER','custom');monkeypatch.setenv('LLM_BASE_URL','https://custom.example/v1')
    with pytest.raises(CapabilityError,match='LLM_API_KEY'): ProviderConfig.from_env()


def test_http_mock_demo_persists_evidence_and_exports(client):
    started=client.post('/api/research/demo')
    assert started.status_code==202
    data=started.json();sid=data['session_id']
    job=wait_job(client,sid,data['job']['job_id'])
    assert job['status']=='completed',job
    assert job['result']['model_inference_executed'] is False
    report=client.get(f'/api/sessions/{sid}/report').json()
    assert report['processing_method']=='MOCK' and report['generation']['provider']=='mock'
    assert report['session']['simulated'] is True
    originals=[e for e in client.get(f'/api/sessions/{sid}/events').json() if e['source']!='AI_analysis']
    assert len(originals)==8 and {e['source'] for e in originals}=={'video','audio','manual'}
    assert all(e['session_id']==sid and e['metadata']['processing_method']=='MOCK' for e in originals)
    for url in ('report.md','report.json'):
        response=client.get(f'/api/sessions/{sid}/{url}')
        assert response.status_code==200 and 'attachment' in response.headers['content-disposition']
    schema=client.get('/api/research/schema').json()
    assert schema['title']=='DecisionAnalysis'
    brief=report['research'];brief['question']='更改研究问题后必须重新分析'
    assert client.patch(f'/api/sessions/{sid}/research',json=brief).status_code==200
    assert client.get(f'/api/sessions/{sid}/report').status_code==409
    assert all(e['source']!='AI_analysis' for e in client.get(f'/api/sessions/{sid}/events').json())


def test_failed_llm_does_not_create_a_mock_report(client,sid,monkeypatch):
    monkeypatch.setenv('LLM_PROVIDER','ollama');monkeypatch.setenv('LLM_MODEL','not-running')
    monkeypatch.setenv('LLM_BASE_URL','http://127.0.0.1:1/v1')
    def handle(request): raise httpx.ConnectError('deliberate mock offline',request=request)
    real=httpx.Client
    monkeypatch.setattr('adapters.providers.httpx.Client',lambda **kw:real(transport=httpx.MockTransport(handle)))
    client.post(f'/api/sessions/{sid}/transcripts',json={'segments':[{'start':0,'end':2,'text':'腰部紧。'}]})
    job=client.post(f'/api/sessions/{sid}/analyze',json={'provider':'llm'}).json()
    result=wait_job(client,sid,job['job_id'])
    assert result['status']=='failed' and result['error_type']=='capability_missing'
    assert client.get(f'/api/sessions/{sid}/report').status_code==409


def test_mock_http_demo_without_media_or_models(client,tmp_path,monkeypatch):
    import backend.main
    sample=tmp_path/'sample_data';sample.mkdir(exist_ok=True)
    (sample/'decision_session.example.json').write_bytes((ROOT/'sample_data/decision_session.example.json').read_bytes())
    monkeypatch.setattr(backend.main,'ROOT',tmp_path)
    started=client.post('/api/research/demo').json();sid=started['session_id']
    job=wait_job(client,sid,started['job']['job_id'])
    assert job['status']=='completed',job
    report=client.get(f'/api/sessions/{sid}/report').json()
    assert not report['generation']['model_inference_executed']
    assert client.get(f'/api/sessions/{sid}').json()['assets']==[]
    assert all(not e['media_url'] for e in report['evidence_index'].values())
    assert '没有关联媒体资产' in report['markdown']

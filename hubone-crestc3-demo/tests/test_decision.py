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
from backend.models import Event, Session, ResearchBrief
from tests.conftest import wait_job


@pytest.fixture
def scenario():
    fixture=json.loads((ROOT/'sample_data/decision_session.example.json').read_text(encoding='utf-8'))
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


def test_v11_modules_cards_and_original_contract_are_compatible(scenario,client):
    from analysis.decision_schema import output_schema
    session,events,index=scenario
    session['research'].update(target_audience='经授权招募的首次试用者',decision_owner='产品研究负责人')
    report=build_report(session,events,'mock')
    a=report['decision_analysis']
    assert report['report_schema_version']=='1.1'
    assert report['generation']['schema_version']=='evidence-to-decision/1.1'
    assert set(a['intelligence'])=={'audience','behavioral','experience','diagnostic','commercial','decision'}
    assert {c['option_id'] for c in a['decision_cards']}=={o['option_id'] for o in a['options']}
    assert all(c['target_audience']=='经授权招募的首次试用者' and c['decision_owner']=='产品研究负责人'
               and c['tracking_status']=='PLANNED' for c in a['decision_cards'])
    assert all(f['evidence_strength'] in ('NONE','LIMITED') for m in a['intelligence'].values() for f in m['findings'])
    for heading in ['Audience Intelligence','Behavioral Intelligence','Experience Intelligence',
                    'Diagnostic Intelligence','Commercial Intelligence','Decision Intelligence',
                    '产品决策卡','评分依据','效果追踪','研究方法选择','SIMULATED']:
        assert heading in report['markdown']
    old={k:v for k,v in a.items() if k not in ('intelligence','research_methods','decision_cards')}
    assert validate_analysis(old,index)==old
    with pytest.raises(ValueError): validate_analysis(old,index,require_v11=True)
    assert 'intelligence' not in client.get('/api/research/schema?version=1.0').json()['properties']
    assert client.get('/api/research/schema?version=1.1').json()==output_schema()
    assert json.loads((ROOT/'analysis/schemas/evidence_to_decision.schema.json').read_text(encoding='utf-8'))==output_schema()
    schema=output_schema(index)
    assert set(schema['$defs']['ResearchFinding']['properties']['direct_evidence_ids']['items']['enum'])==set(index)


@pytest.mark.parametrize('mutation',[
    lambda a:a['intelligence']['behavioral']['findings'][0].update(evidence_ids=['foreign-event']),
    lambda a:a['intelligence']['experience']['findings'][1].update(statement='改写为已证实的客观性能'),
    lambda a:a['intelligence']['experience']['findings'][1].update(evidence_strength='CORROBORATED'),
    lambda a:a['intelligence']['commercial']['findings'][0].update(evidence_strength='LIMITED'),
    lambda a:a.update(decision_cards=[]),
    lambda a:a['decision_cards'][0].update(priority_score=3),
    lambda a:a['decision_cards'][0].update(evidence_ids=[]),
    lambda a:a['decision_cards'][0].update(evidence_strength='CORROBORATED'),
    lambda a:a['decision_cards'][0].update(experiment_ids=['foreign-experiment']),
    lambda a:a['decision_cards'][0].update(decision_owner='模型编造的负责人'),
    lambda a:a['decision_cards'][0].update(tracking_status='SUCCESS'),
    lambda a:a['research_methods'].append(a['research_methods'][0]),
    lambda a:a['research_methods'][0].update(status='EXECUTED'),
])
def test_v11_rejects_broken_evidence_cards_and_fabricated_results(scenario,mutation):
    session,_,index=scenario
    a,_=generate_decision(session,index,'mock')
    mutation(a)
    with pytest.raises(ValueError): validate_analysis(a,index,require_v11=True,research=session['research'])


@pytest.mark.parametrize('signal',['PURCHASE_INTENT','SALES_CONVERSION','REVISIT','DISPLAY_CAUSALITY'])
def test_attention_and_appearance_are_never_commercial_proof(scenario,signal):
    session,_,index=scenario
    a,_=generate_decision(session,index,'mock')
    f=a['intelligence']['commercial']['findings'][0]
    video=next(eid for eid,e in index.items() if e['source']=='video')
    f.update(statement='依据停留、触摸或衣着推导商业结论。',classification='INFERENCE',
             evidence_strength='LIMITED',commercial_signal=signal,evidence_ids=[video],direct_evidence_ids=[video])
    with pytest.raises(ValueError,match='商业结论'): validate_analysis(a,index)
    f.update(classification='INSUFFICIENT_EVIDENCE',evidence_strength='NONE')
    assert validate_analysis(a,index)['intelligence']['commercial']['findings'][0]['classification']=='INSUFFICIENT_EVIDENCE'


@pytest.mark.parametrize('statement',['停留记录证明消费者具有购买意愿。','触摸已经产生销售转化。',
                                       '相同衣着证明同一人复访。','陈列方案导致行为变化。'])
def test_legacy_narratives_cannot_bypass_commercial_guards(scenario,statement):
    session,_,index=scenario
    a,_=generate_decision(session,index,'mock')
    claim=next(c for c in a['claims'] if c['classification']=='INFERENCE')
    claim['statement']=statement
    with pytest.raises(ValueError,match='商业叙述'): validate_analysis(a,index)


@pytest.mark.parametrize('location',['summary','option','card'])
def test_commercial_assertions_cannot_hide_in_summary_or_resource_plans(scenario,location):
    session,_,index=scenario
    a,_=generate_decision(session,index,'mock')
    statement='触摸不等于购买意向，但本例购买意向强烈。'
    if location=='summary': a['summary']=statement
    elif location=='option': a['options'][0]['change']=statement
    else: a['decision_cards'][0]['expected_impact']=statement
    with pytest.raises(ValueError,match='商业叙述'): validate_analysis(a,index)


def test_decision_follow_up_keeps_raw_measurements_without_claiming_causal_success():
    session=Session(session_id='follow-up').model_dump()
    event=Event(session_id='follow-up',timestamp=10,source='manual',event_type='decision_follow_up',
                description='方案 O1 后测记录：任务用时 42 秒；基线与条件尚待复核。').model_dump()
    report=build_report(session,[event])
    finding=next(f for f in report['decision_analysis']['intelligence']['decision']['findings']
                 if f['classification']=='FACT')
    assert finding['statement']==event['description'] and finding['evidence_ids']==[event['event_id']]
    assert report['generation']['semantic_truth_verified'] is False


def test_direct_intent_transactions_and_completed_controls_keep_source_provenance():
    session=Session(session_id='direct-sources').model_dump()
    events=[Event(session_id=session['session_id'],timestamp=i,source='manual',event_type=kind,description=text,
                  metadata={'commercial_evidence':commerce}).model_dump()
            for i,(kind,text,commerce) in enumerate([
                ('purchase_intent','我想购买这款产品。',{}),
                ('transaction','原始交易记录 t-1 已完成。',{'transaction_id':'t-1','status':'completed'}),
                ('controlled_experiment','已执行的两种陈列条件结果记录。',
                 {'experiment_id':'x-1','status':'completed','control':'陈列 A','treatment':'陈列 B','outcome':'原始测量待复核'})])]
    report=build_report(session,events)
    findings=report['decision_analysis']['intelligence']['commercial']['findings']
    for signal in ('PURCHASE_INTENT','SALES_CONVERSION','DISPLAY_CAUSALITY'):
        f=next(f for f in findings if f['commercial_signal']==signal)
        assert f['classification']=='INFERENCE' and f['evidence_strength']=='LIMITED'
        assert f['direct_evidence_ids'] and set(f['direct_evidence_ids'])<=set(report['evidence_index'])
    revisit=next(f for f in findings if f['commercial_signal']=='REVISIT')
    assert revisit['classification']=='INSUFFICIENT_EVIDENCE'
    assert report['generation']['semantic_truth_verified'] is False
    # A declared event type or a planned control cannot turn touch/dwell into direct evidence.
    events[0]['description']='只观察到商品接触，没有原话。'
    events[2]['metadata']['commercial_evidence']['status']='planned'
    report=build_report(session,events)
    findings=report['decision_analysis']['intelligence']['commercial']['findings']
    assert all(f['classification']=='INSUFFICIENT_EVIDENCE' for f in findings
               if f['commercial_signal'] in ('PURCHASE_INTENT','DISPLAY_CAUSALITY'))


def test_method_selection_depends_on_question_and_never_fabricates_completed_research():
    from analysis.intelligence import select_methods
    brief=ResearchBrief().model_dump()
    brief['question']='如何细分客群、选择目标用户与产品定位？'
    first=select_methods(brief)
    assert [m['name'] for m in first]==['STP']
    brief['question']='两种陈列方案是否造成差异，如何进行 A/B 对照？'
    second=select_methods(brief)
    assert [m['name'] for m in second]==['A/B Testing']
    assert all(m['status']=='PLANNED' and m['data_requirements'] for m in first+second)
    brief['question']='腰部束缚与负重反馈应先验证穿戴设置，还是固定带接触结构？'
    names=[m['name'] for m in select_methods(brief)]
    assert 'ISO 9241-11' in names and 'Customer Journey' not in names


def test_explicit_comparison_preserves_sessions_camera_evidence_and_identity_boundaries(client):
    sessions=[client.post('/api/sessions',json={'name':f'比较 {i}','simulated':True}).json()['session_id'] for i in range(2)]
    original_events={}
    for i,sid in enumerate(sessions):
        for camera in ('camera-A','camera-B'):
            response=client.post(f'/api/sessions/{sid}/events',json={'timestamp':1,'source':'manual',
                'event_type':'observation','description':f'{camera} 的人工原始观察，尚未核验身份。',
                'metadata':{'research_context':{'participant_id':'P01','segment_id':'首次试用',
                    'product_id':f'product-{i}','camera_id':camera,'condition_id':f'condition-{i}',
                    'task_id':'task-1','zone_id':'zone-1','association_id':'observation-1'}}})
            assert response.status_code==201
        client.post(f'/api/sessions/{sid}/transcripts',json={'segments':[{'start':1,'end':2,'text':'腰部有点紧。'}]})
        job=client.post(f'/api/sessions/{sid}/analyze',json={'provider':'rules'}).json()
        assert wait_job(client,sid,job['job_id'])['status']=='completed'
        original_events[sid]=client.get(f'/api/sessions/{sid}/events').json()
    saved_reports={sid:client.get(f'/api/sessions/{sid}/report').json() for sid in sessions}
    response=client.post('/api/research/compare',json={'session_ids':sessions,'provider':'mock'})
    assert response.status_code==200,response.text
    report=response.json();comparison=report['comparison'];dims=comparison['dimensions']
    assert {s['session_id'] for s in report['sessions']}==set(sessions)
    assert report['simulated'] and comparison['cross_session_identity_linking'] is False
    assert len(dims['participant']['groups'])==2  # Identical P01 labels remain separate.
    assert {g['session_scope'] for g in dims['participant']['groups']}==set(sessions)
    assert len(dims['product']['groups'])==len(dims['condition']['groups'])==2
    assert len(dims['camera']['groups'])==4 and len(comparison['cross_camera_links'])==2
    assert all(e['session_id'] in sessions for e in report['evidence_index'].values())
    for sid in sessions:
        assert client.get(f'/api/sessions/{sid}/events').json()==original_events[sid]
        assert client.get(f'/api/sessions/{sid}/report').json()==saved_reports[sid]
    # Ordinary reports still reject an unrelated Session; comparison is not an isolation bypass.
    source_events=[e for sid in sessions for e in original_events[sid] if e['source']!='AI_analysis']
    with pytest.raises(ValueError,match='Session'): build_report(report['session'],source_events)
    assert client.post('/api/research/compare',json={'session_ids':[sessions[0],sessions[0]]}).status_code==422
    assert client.post('/api/research/compare',json={'session_ids':[sessions[0],'missing']}).status_code==404
    real=client.post('/api/sessions',json={}).json()['session_id']
    client.post(f'/api/sessions/{real}/transcripts',json={'segments':[{'start':1,'end':2,'text':'使用记录。'}]})
    assert client.post('/api/research/compare',json={'session_ids':[sessions[0],real],'provider':'mock'}).status_code==422


def test_comparison_never_correlates_timestamps_across_sessions_or_crosses_asset_ownership():
    sessions=[Session(session_id=sid).model_dump() for sid in ('one','two')]
    audio=Event(session_id='one',timestamp=2,event_type='utterance',source='audio',description='用户原话。').model_dump()
    video=Event(session_id='two',timestamp=2,event_type='stationary',source='video',description='轨迹停留记录。',
                evidence={'asset_id':'video-two','media_time':2}).model_dump()
    sources=[{'session':sessions[0],'events':[audio],'assets':[]},
             {'session':sessions[1],'events':[video],'assets':[{'asset_id':'video-two','session_id':'two','kind':'video'}]}]
    report=build_report(sessions[0],[],comparison_sources=sources)
    assert all(not link['video_event_ids'] for link in report['correlations'])
    assert report['evidence_index'][video['event_id']]['media_url']=='/api/sessions/two/assets/video-two'
    sources[1]['assets'][0]['session_id']='one'
    with pytest.raises(ValueError,match='资产'): build_report(sessions[0],[],comparison_sources=sources)


def test_official_c3_reference_stays_distinct_from_mock_speech_and_events(client,tmp_path,monkeypatch):
    import backend.main
    from scripts.generate_samples import preserved_reference_bundle
    import hashlib
    sample=tmp_path/'sample_data';sample.mkdir()
    fixture=ROOT/'sample_data/decision_session.example.json'
    (sample/'decision_session.example.json').write_bytes(fixture.read_bytes())
    for name,data in [('video.mp4',b'official-reference-fixture'),('audio.wav',b'simulated-speech-fixture'),
                      ('transcript.json',b'{}'),('scenario.json',b'[]')]:
        (sample/name).write_bytes(data)
    manifest={'video_input_origin':'REAL_RECORDING_REFERENCE','video_product':'Crest C3',
              'reference_url':'https://weibo.com/tv/show/1034:5334827235475466',
              **{kind+'_sha256':hashlib.sha256((sample/name).read_bytes()).hexdigest()
                 for kind,name in [('video','video.mp4'),('audio','audio.wav')]}}
    (sample/'manifest.json').write_text(json.dumps(manifest),encoding='utf-8')
    assert preserved_reference_bundle(sample)==manifest
    monkeypatch.setattr(backend.main,'ROOT',tmp_path)
    started=client.post('/api/research/demo').json();sid=started['session_id']
    assert wait_job(client,sid,started['job']['job_id'])['status']=='completed'
    assets=client.get(f'/api/sessions/{sid}').json()['assets']
    video=next(a for a in assets if a['kind']=='video');audio=next(a for a in assets if a['kind']=='audio')
    assert video['input_origin']=='REAL_RECORDING_REFERENCE' and video['simulated'] is False
    assert video['reference_product']=='Crest C3' and video['reference_url']==manifest['reference_url']
    assert audio['input_origin']=='SIMULATED' and audio['simulated'] is True
    report=client.get(f'/api/sessions/{sid}/report').json()
    assert report['simulated'] is True and report['research']['recording_relationship']=='independent'
    assert report['generation']['processing_method']=='MOCK'
    assert all(e['metadata']['simulated'] for e in report['evidence'].values())
    # The same reference must retain its provenance even when uploaded to a simulated Session.
    uploaded=client.post(f'/api/sessions/{sid}/assets',data={'kind':'video'},
        files={'file':('renamed.mp4',(sample/'video.mp4').read_bytes(),'video/mp4')}).json()
    assert uploaded['input_origin']=='REAL_RECORDING_REFERENCE' and uploaded['simulated'] is False
    (sample/'video.mp4').write_bytes(b'changed')
    with pytest.raises(RuntimeError,match='校验失败'): preserved_reference_bundle(sample)

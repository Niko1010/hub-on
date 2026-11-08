"""Offline DeepSeek/provider contracts. Only dummy credentials and MockTransport.

Provider contracts use fixture settings and MockTransport; no real model calls.
"""
import importlib
import json
from pathlib import Path
import sys
import types

import dotenv
import httpx
import pytest

M=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(M))
REAL_DOTENV_VALUES=dotenv.dotenv_values
REAL_LOAD_DOTENV=dotenv.load_dotenv
REAL_HTTPX_CLIENT=httpx.Client
SCHEMA={'type':'object','properties':{'answer':{'type':'string'}},'required':['answer'],'additionalProperties':False}
DUMMY_KEY='offline-fixture-not-a-real-secret'


@pytest.fixture(autouse=True)
def isolated_model_environment(monkeypatch):
    # Drop only this process's settings; never print or read local configuration files.
    import os
    for key in list(os.environ):
        if key.startswith(('LLM_','DEEPSEEK_','OPENAI_','ANTHROPIC_','HUBONE_DEEPSEEK_','HUBONE_RTSP_')):
            monkeypatch.delenv(key,raising=False)
    monkeypatch.setattr(dotenv,'dotenv_values',lambda *args,**kwargs:{})
    monkeypatch.setattr(dotenv,'load_dotenv',lambda *args,**kwargs:False)
    # Any accidental HTTP outside an explicitly supplied MockTransport fails locally.
    monkeypatch.setattr(httpx.HTTPTransport,'handle_request',lambda *args,**kwargs:pytest.fail('Network transport is forbidden'))


@pytest.fixture
def providers():
    return importlib.import_module('adapters.providers')


def configure(monkeypatch,**values):
    for key,value in {'LLM_PROVIDER':'deepseek','DEEPSEEK_API_KEY':DUMMY_KEY,**values}.items():
        if value is None:monkeypatch.delenv(key,raising=False)
        else:monkeypatch.setenv(key,value)


def mock_api(monkeypatch,providers,response=None,status=200,exception=None):
    seen=[]
    def respond(request):
        seen.append({'url':str(request.url),'body':json.loads(request.content),'headers':dict(request.headers)})
        if exception:raise exception('offline injected failure',request=request)
        return httpx.Response(status,json=response,request=request)
    transport=httpx.MockTransport(respond)
    monkeypatch.setattr(providers.httpx,'Client',lambda **kwargs:REAL_HTTPX_CLIENT(transport=transport,**kwargs))
    return seen


def answer(content='{"answer":"supported observation"}',**extra):
    return {'id':'offline-response','model':'reported-test-model','choices':[{'finish_reason':'stop','message':{'content':content}}],**extra}


def test_deepseek_defaults_and_dataclass_positional_compatibility(monkeypatch,providers):
    configure(monkeypatch)
    config=providers.ProviderConfig.from_env()
    assert (config.name,config.base_url,config.model,config.pro_model)==('deepseek','https://api.deepseek.com','deepseek-flash','deepseek-v4-pro')
    assert config.api_key==DUMMY_KEY and DUMMY_KEY not in repr(config)
    legacy=providers.GenerationRequest('system',{'evidence':'test'},SCHEMA,'contract')
    assert legacy.task=='research' and legacy.output_mode=='json'
    old_config=providers.ProviderConfig('ollama','http://localhost:11434/v1','model',None,30,512,'x-api-key')
    assert old_config.pro_model is None


@pytest.mark.parametrize('base',['https://api.deepseek.com','https://api.deepseek.com:443','https://api.deepseek.com/v1'])
def test_only_official_https_origin_receives_deepseek_key(monkeypatch,providers,base):
    configure(monkeypatch,LLM_BASE_URL=base)
    config=providers.ProviderConfig.from_env()
    assert config.api_key==DUMMY_KEY


@pytest.mark.parametrize('name,base',[
    ('deepseek','http://api.deepseek.com'),('deepseek','https://api.deepseek.com:444'),
    ('deepseek','https://api.deepseek.com.attacker.invalid'),('deepseek','https://another.invalid/v1'),
    ('custom','https://api.deepseek.com'),('openai','https://api.deepseek.com'),
    ('anthropic','https://api.deepseek.com')])
def test_implicit_key_is_not_forwarded_to_another_origin_or_provider(monkeypatch,providers,name,base):
    configure(monkeypatch,LLM_PROVIDER=name,LLM_BASE_URL=base,LLM_MODEL='fixture-model')
    with pytest.raises(providers.CapabilityError,match='LLM_API_KEY'):
        providers.ProviderConfig.from_env()


def test_loopback_override_has_no_implicit_cloud_key(monkeypatch,providers):
    configure(monkeypatch,LLM_BASE_URL='http://127.0.0.1:9100/v1')
    config=providers.ProviderConfig.from_env()
    assert config.api_key is None
    seen=mock_api(monkeypatch,providers,answer())
    providers.HTTPProvider(config).generate(providers.GenerationRequest('system',{}))
    assert 'authorization' not in seen[0]['headers']


def test_explicit_llm_key_has_priority_and_custom_models(monkeypatch,providers):
    configure(monkeypatch,LLM_API_KEY='explicit-offline-fixture',LLM_MODEL='configured-flash',DEEPSEEK_PRO_MODEL='configured-pro')
    config=providers.ProviderConfig.from_env()
    assert config.api_key=='explicit-offline-fixture'
    assert (config.model,config.pro_model)==('configured-flash','configured-pro')


@pytest.mark.parametrize('task,expected',[('research','deepseek-flash'),('observation','deepseek-flash'),('evidence','deepseek-flash'),('unknown','deepseek-flash'),('decision','deepseek-v4-pro')])
def test_task_model_routing_is_per_request_and_json_contract_is_explicit(monkeypatch,providers,task,expected):
    configure(monkeypatch)
    config=providers.ProviderConfig.from_env();seen=mock_api(monkeypatch,providers,answer())
    request=providers.GenerationRequest('Evidence only',{'原话':'保留'},SCHEMA,'contract',task)
    result=providers.HTTPProvider(config).generate(request)
    body=seen[0]['body']
    assert seen[0]['url']=='https://api.deepseek.com/chat/completions'
    assert seen[0]['headers']['authorization']=='Bearer '+DUMMY_KEY
    assert body['model']==expected and config.model=='deepseek-flash'
    assert body['response_format']=={'type':'json_object'}
    assert 'Required JSON schema:' in body['messages'][0]['content']
    assert json.loads(body['messages'][0]['content'].split('Required JSON schema: ')[1])==SCHEMA
    assert json.loads(body['messages'][1]['content'])=={'原话':'保留'}
    assert body['thinking']=={'type':'disabled'} and body['stream'] is False
    assert body['temperature']==.2 and body['max_tokens']==6000
    assert result.data=={'answer':'supported observation'}
    assert result.provenance['model']==expected and result.provenance['task']==task
    assert result.provenance['reported_model']=='reported-test-model'
    assert len(seen)==1


def test_forced_single_function_tool_result(monkeypatch,providers):
    configure(monkeypatch)
    response=answer();response['choices'][0]={'finish_reason':'tool_calls','message':{'content':None,'tool_calls':[{'id':'test-call','type':'function','function':{'name':'contract','arguments':'{"answer":"tool result"}'}}]}}
    seen=mock_api(monkeypatch,providers,response)
    result=providers.HTTPProvider(providers.ProviderConfig.from_env()).generate(providers.GenerationRequest('system',{},SCHEMA,'contract','research','tool'))
    body=seen[0]['body']
    assert len(body['tools'])==1 and body['tools'][0]['function']['parameters']==SCHEMA
    assert body['tool_choice']=={'type':'function','function':{'name':'contract'}}
    assert 'response_format' not in body and body['thinking']=={'type':'disabled'}
    assert result.data=={'answer':'tool result'} and result.provenance['output_mode']=='tool'


@pytest.mark.parametrize('calls',[
    [],
    [{'type':'function','function':{'name':'wrong','arguments':'{}'}}],
    [{'type':'other','function':{'name':'contract','arguments':'{}'}}],
    [{'type':'function','function':{'name':'contract','arguments':'{}'}}]*2,
    [{'type':'function','function':{'name':'contract','arguments':'broken-json'}}],
    [{'type':'function','function':{'name':'contract','arguments':'[]'}}],
    [{'type':'function','function':{'name':'contract','arguments':None}}],
])
def test_malformed_tool_never_repaired_retried_or_falls_back(monkeypatch,providers,calls):
    configure(monkeypatch)
    response=answer();response['choices'][0]={'finish_reason':'tool_calls','message':{'tool_calls':calls}}
    seen=mock_api(monkeypatch,providers,response)
    with pytest.raises(ValueError):
        providers.HTTPProvider(providers.ProviderConfig.from_env()).generate(providers.GenerationRequest('system',{},SCHEMA,'contract','decision','tool'))
    assert len(seen)==1 and seen[0]['body']['model']=='deepseek-v4-pro'


@pytest.mark.parametrize('mode,schema',[('xml',SCHEMA),('tool',None)])
def test_invalid_output_contract_fails_before_http(monkeypatch,providers,mode,schema):
    configure(monkeypatch);seen=mock_api(monkeypatch,providers,answer())
    with pytest.raises(ValueError):
        providers.HTTPProvider(providers.ProviderConfig.from_env()).generate(providers.GenerationRequest('system',{},schema,'contract','research',mode))
    assert not seen


def test_token_usage_is_recorded_without_claiming_cost_or_echoing_provider_fields(monkeypatch,providers):
    configure(monkeypatch)
    usage={'prompt_tokens':120,'completion_tokens':30,'total_tokens':150,'prompt_cache_hit_tokens':80,
        'prompt_cache_miss_tokens':40,'input_tokens':True,'output_tokens':'30','private_field':DUMMY_KEY}
    seen=mock_api(monkeypatch,providers,answer(usage=usage))
    result=providers.HTTPProvider(providers.ProviderConfig.from_env()).generate(providers.GenerationRequest('system',{}))
    assert result.provenance['usage']=={k:usage[k] for k in ('prompt_tokens','completion_tokens','total_tokens','prompt_cache_hit_tokens','prompt_cache_miss_tokens')}
    assert DUMMY_KEY not in json.dumps(result.provenance)
    assert 'cost' not in result.provenance and result.provenance['elapsed_seconds']>=0
    assert len(result.provenance['response_sha256'])==64 and len(seen)==1


@pytest.mark.parametrize('status',[401,429,500])
def test_http_error_is_single_attempt_without_sensitive_body(monkeypatch,providers,status):
    configure(monkeypatch);seen=mock_api(monkeypatch,providers,{'error':DUMMY_KEY},status=status)
    with pytest.raises(providers.CapabilityError) as raised:
        providers.HTTPProvider(providers.ProviderConfig.from_env()).generate(providers.GenerationRequest('system',{}))
    assert len(seen)==1 and DUMMY_KEY not in str(raised.value)


def test_timeout_is_not_retried_or_downgraded_to_flash(monkeypatch,providers):
    configure(monkeypatch);seen=mock_api(monkeypatch,providers,exception=httpx.ReadTimeout)
    with pytest.raises(providers.CapabilityError):
        providers.HTTPProvider(providers.ProviderConfig.from_env()).generate(providers.GenerationRequest('system',{},task='decision'))
    assert len(seen)==1 and seen[0]['body']['model']=='deepseek-v4-pro'


@pytest.mark.parametrize('name,base,model',[('openai','https://api.openai.com/v1','old-openai'),('custom','https://custom.invalid/v1','old-custom'),('ollama','http://127.0.0.1:11434/v1','old-local')])
def test_existing_openai_compatible_provider_contract_unchanged(monkeypatch,providers,name,base,model):
    seen=mock_api(monkeypatch,providers,answer())
    config=providers.ProviderConfig(name,base,model,DUMMY_KEY)
    result=providers.HTTPProvider(config).generate(providers.GenerationRequest('system',{},SCHEMA,'contract','decision'))
    body=seen[0]['body']
    assert body['model']==model and 'thinking' not in body
    assert body['response_format']=={'type':'json_schema','json_schema':{'name':'contract','strict':True,'schema':SCHEMA}}
    assert result.data['answer']=='supported observation'


def test_existing_anthropic_tool_protocol_unchanged(monkeypatch,providers):
    response={'id':'anthropic-test','model':'old-anthropic','stop_reason':'tool_use',
        'content':[{'type':'tool_use','name':'contract','input':{'answer':'ok'}}],'usage':{'input_tokens':10,'output_tokens':5}}
    seen=mock_api(monkeypatch,providers,response)
    config=providers.ProviderConfig('anthropic','https://api.anthropic.com/v1','old-anthropic',DUMMY_KEY)
    result=providers.HTTPProvider(config).generate(providers.GenerationRequest('system',{},SCHEMA,'contract','decision'))
    assert seen[0]['url'].endswith('/messages') and seen[0]['headers']['x-api-key']==DUMMY_KEY
    assert seen[0]['body']['tool_choice']=={'type':'tool','name':'contract'}
    assert result.provenance['usage']=={'input_tokens':10,'output_tokens':5}


def test_env_local_model_precedence_and_rtsp_exclusion_using_only_temporary_files(monkeypatch,tmp_path):
    import os
    project=tmp_path/'fixture-project';(project/'backend').mkdir(parents=True)
    (project/'.env.local').write_text('LLM_PROVIDER=deepseek\nLLM_MODEL=local-flash\nDEEPSEEK_API_KEY=dummy-local\nHUBONE_RTSP_PASSWORD=must-not-load\n',encoding='utf-8')
    (project/'.env').write_text('LLM_PROVIDER=ollama\nLLM_MODEL=legacy\nDEEPSEEK_API_KEY=dummy-legacy\n',encoding='utf-8')
    monkeypatch.setattr(dotenv,'dotenv_values',REAL_DOTENV_VALUES)
    monkeypatch.setattr(dotenv,'load_dotenv',REAL_LOAD_DOTENV)
    monkeypatch.setattr(sys,'path',list(sys.path))
    # Exec the current config against fixture __file__; no actual .env files are opened.
    module=types.ModuleType('config_fixture');module.__file__=str(project/'backend/config.py')
    exec(compile((M/'backend/config.py').read_text(encoding='utf-8'),module.__file__,'exec'),module.__dict__)
    assert os.environ['LLM_PROVIDER']=='deepseek' and os.environ['LLM_MODEL']=='local-flash'
    assert os.environ['DEEPSEEK_API_KEY']=='dummy-local' and 'HUBONE_RTSP_PASSWORD' not in os.environ
    monkeypatch.setenv('LLM_MODEL','explicit-process-model')
    exec(compile((M/'backend/config.py').read_text(encoding='utf-8'),module.__file__,'exec'),module.__dict__)
    assert os.environ['LLM_MODEL']=='explicit-process-model'

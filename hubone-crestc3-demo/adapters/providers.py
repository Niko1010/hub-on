"""Small shared JSON-generation interface. No provider selection/comparison UI."""
from dataclasses import dataclass, field
import hashlib
import ipaddress
import json
import os
import time
from typing import Protocol
from urllib.parse import urlparse

import httpx
from backend.config import CapabilityError


@dataclass(frozen=True)
class GenerationRequest:
    system: str
    payload: dict
    schema: dict | None = None
    schema_name: str = 'evidence_to_decision'


@dataclass(frozen=True)
class GenerationResponse:
    data: dict
    provenance: dict


class LLMProvider(Protocol):
    def generate(self, request: GenerationRequest) -> GenerationResponse: ...


def is_loopback(host):
    try: return host=='localhost' or ipaddress.ip_address(host or '').is_loopback
    except ValueError: return False


@dataclass(frozen=True)
class ProviderConfig:
    name: str
    base_url: str
    model: str
    api_key: str | None = field(default=None,repr=False)
    timeout: float = 180
    max_tokens: int = 6000

    @classmethod
    def from_env(cls):
        name=os.getenv('LLM_PROVIDER','openai').strip().lower()
        name={'openai-compatible':'custom','openai_compatible':'custom'}.get(name,name)
        defaults={'ollama':('http://127.0.0.1:11434/v1',''),
                  'openai':('https://api.openai.com/v1','gpt-4o-mini'),
                  'anthropic':('https://api.anthropic.com/v1','claude-sonnet-4-20250514'),
                  'custom':('', '')}
        if name not in defaults:
            raise CapabilityError('LLM_PROVIDER 支持 ollama、openai、anthropic、custom；Mock 仅能显式用于模拟 Session。')
        default_url,default_model=defaults[name]
        base=(os.getenv('LLM_BASE_URL') or default_url).rstrip('/')
        parsed=urlparse(base)
        if parsed.scheme not in ('http','https') or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment:
            raise CapabilityError('LLM_BASE_URL 必须为无凭据、查询参数或片段的 HTTP(S) 服务地址。')
        if not parsed.path or parsed.path=='/': base+='/v1'
        model=(os.getenv('LLM_MODEL') or default_model).strip()
        if not model:
            raise CapabilityError('请设置 LLM_MODEL；Ollama 名称必须与 ollama list 中已下载的模型一致。')
        key=os.getenv('LLM_API_KEY')
        # Never forward a cloud provider key to another host/provider implicitly.
        if not key and name=='openai' and parsed.hostname=='api.openai.com': key=os.getenv('OPENAI_API_KEY')
        if not key and name=='anthropic' and parsed.hostname=='api.anthropic.com': key=os.getenv('ANTHROPIC_API_KEY')
        if not key and name!='ollama' and not is_loopback(parsed.hostname):
            raise CapabilityError('LLM_API_KEY 未配置；没有调用模型，也不会自动改用规则或 Mock。')
        timeout=float(os.getenv('LLM_TIMEOUT_SECONDS','180'))
        max_tokens=int(os.getenv('LLM_MAX_OUTPUT_TOKENS','6000'))
        if not 5<=timeout<=1800 or not 256<=max_tokens<=32000:
            raise CapabilityError('LLM_TIMEOUT_SECONDS 应为 5–1800，LLM_MAX_OUTPUT_TOKENS 应为 256–32000。')
        return cls(name,base,model,key,timeout,max_tokens)


class HTTPProvider:
    def __init__(self,config:ProviderConfig): self.config=config

    def generate(self,request):
        c=self.config
        user=json.dumps(request.payload,ensure_ascii=False)
        headers={}
        if c.name=='anthropic':
            url=c.base_url+'/messages'
            headers={'anthropic-version':'2023-06-01'}
            if c.api_key: headers['x-api-key']=c.api_key
            body={'model':c.model,'temperature':0.2,'max_tokens':c.max_tokens,
                  'system':request.system,'messages':[{'role':'user','content':user}]}
            if request.schema:
                body.update(tools=[{'name':request.schema_name,'description':'提交结构化消费者研究分析','input_schema':request.schema}],
                            tool_choice={'type':'tool','name':request.schema_name})
            else:
                body['system']+='\n只输出 JSON 对象。'
        else:
            url=c.base_url+'/chat/completions'
            if c.api_key: headers['Authorization']='Bearer '+c.api_key
            body={'model':c.model,'temperature':0.2,'max_tokens':c.max_tokens,
                  'messages':[{'role':'system','content':request.system},{'role':'user','content':user}],
                  'response_format':{'type':'json_schema','json_schema':{'name':request.schema_name,'strict':True,'schema':request.schema}}
                                    if request.schema else {'type':'json_object'}}
        began=time.monotonic()
        try:
            with httpx.Client(timeout=httpx.Timeout(c.timeout,connect=5),trust_env=not is_loopback(urlparse(c.base_url).hostname)) as client:
                response=client.post(url,headers=headers,json=body)
            response.raise_for_status()
            result=response.json()
        except httpx.HTTPStatusError as exc:
            raise CapabilityError(f'{c.name} HTTP {exc.response.status_code}；检查地址、凭据、模型及结构化输出支持。未生成替代报告。') from None
        except httpx.RequestError:
            raise CapabilityError(f'无法连接 {c.name} 或请求超时；请在运行后端的同一台电脑检查模型服务。未生成替代报告。') from None
        except ValueError:
            raise ValueError('Provider 未返回有效 JSON；未生成替代报告。') from None
        if c.name=='anthropic':
            if result.get('stop_reason') in ('max_tokens','refusal'):
                raise ValueError('Anthropic 输出被截断或拒绝，报告未保存。')
            if request.schema:
                blocks=[b for b in result.get('content',[]) if b.get('type')=='tool_use' and b.get('name')==request.schema_name]
                if len(blocks)!=1: raise ValueError('Anthropic 未返回唯一的结构化工具结果。')
                data=blocks[0].get('input')
            else:
                data=self.parse_json(''.join(b.get('text','') for b in result.get('content',[]) if b.get('type')=='text'))
        else:
            choices=result.get('choices',[])
            if not choices: raise ValueError('Provider 未返回模型回答。')
            choice=choices[0]
            if choice.get('finish_reason') in ('length','content_filter') or choice.get('message',{}).get('refusal'):
                raise ValueError('模型输出被截断、过滤或拒绝，报告未保存。')
            data=self.parse_json(choice.get('message',{}).get('content'))
        if not isinstance(data,dict): raise ValueError('Provider 结果必须为 JSON 对象。')
        return GenerationResponse(data,{'provider':c.name,'model':c.model,'reported_model':result.get('model'),
            'processing_method':'REAL_MODEL','model_inference_executed':True,'response_id':result.get('id'),
            'elapsed_seconds':round(time.monotonic()-began,3),
            'response_sha256':hashlib.sha256(json.dumps(data,sort_keys=True,ensure_ascii=False).encode()).hexdigest()})

    @staticmethod
    def parse_json(content):
        try: return json.loads(content)
        except (ValueError,TypeError): raise ValueError('模型回答不是有效 JSON；没有修补成模板或成功报告。') from None


def get_provider(name=None) -> LLMProvider:
    if name=='mock':
        from adapters.mock_provider import MockProvider
        return MockProvider()
    return HTTPProvider(ProviderConfig.from_env())

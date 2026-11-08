"""Live local-config acceptance, not a fixture response. Never logs secret values."""
import argparse
import json
import os
from pathlib import Path
import sys
import time

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from backend.config import CapabilityError
from adapters.llm import generate_insights


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--provider',choices=['ollama','openai'])
    parser.add_argument('--base-url')
    parser.add_argument('--model')
    parser.add_argument('--output',default='artifacts/v0.1/llm-live-check.json')
    args=parser.parse_args()
    for name,value in [('LLM_PROVIDER',args.provider),('LLM_BASE_URL',args.base_url),('LLM_MODEL',args.model)]:
        if value is not None:os.environ[name]=value
    result={'provider':os.getenv('LLM_PROVIDER','openai'),
        'key_present':bool(os.getenv('LLM_API_KEY') or os.getenv('OPENAI_API_KEY')),
        'test_input_origin':'SIMULATED','response_origin':'NOT_RUN'}
    began=time.monotonic()
    try:
        generated=generate_insights([{'event_id':'acceptance-e1','timestamp':1,'source':'manual',
            'event_type':'utterance','description':'穿起来还可以，但是腰部有点紧。','simulated':True}],
            'Crest C3：仅协议测试，不是真实消费者研究')
        if not generated['insights']:
            raise ValueError('模型返回零项洞察；不足以验证引用链。')
        result.update(status='passed',response_origin='REAL_MODEL',output=generated)
        code=0
    except Exception as e:
        result.update(status='not_verified',error_type=type(e).__name__,
            reason=str(e) if isinstance(e,CapabilityError) else '服务不可用、请求失败或模型输出未通过 Schema/证据校验；未产生替代结果。')
        code=2
    result['elapsed_seconds']=round(time.monotonic()-began,3)
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False,indent=2))
    return code


if __name__=='__main__':
    sys.exit(main())

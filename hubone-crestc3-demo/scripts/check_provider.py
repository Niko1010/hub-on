"""Explicit software Mock check OR user-run live provider check. Never auto-fallback."""
import argparse
import json
import os
from pathlib import Path
import sys
import time

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from analysis.decision import evidence_snapshot,generate_decision
from analysis.demo import fixture_events
from backend.config import CapabilityError
from backend.models import Session,ResearchBrief


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--provider',choices=['mock','ollama','openai','anthropic','custom'])
    parser.add_argument('--base-url')
    parser.add_argument('--model')
    parser.add_argument('--output',type=Path,default=ROOT/'artifacts/decision/provider-check.json')
    args=parser.parse_args()
    for name,value in [('LLM_PROVIDER',args.provider if args.provider!='mock' else None),
                       ('LLM_BASE_URL',args.base_url),('LLM_MODEL',args.model)]:
        if value is not None: os.environ[name]=value
    provider=args.provider or os.getenv('LLM_PROVIDER','openai')
    result={'provider':provider,'test_input_origin':'SIMULATED','model_inference_executed':False,
            'model_quality_verified':False,'gpu_performance_verified':False,'camera_microphone_verified':False}
    fixture=json.loads((ROOT/'sample_data/decision_session.example.json').read_text(encoding='utf-8'))
    session=Session(simulated=True,research=ResearchBrief(**fixture['research'])).model_dump()
    index=evidence_snapshot(session,[e.model_dump() for e in fixture_events(session['session_id'],fixture,{})])
    began=time.monotonic()
    try:
        output,generation=generate_decision(session,index,'mock' if provider=='mock' else None)
        result.update(status='passed_software_mock' if provider=='mock' else 'passed_live_provider_request',
                      model_inference_executed=generation['model_inference_executed'],
                      generation=generation,output=output)
        code=0
    except Exception as exc:
        result.update(status='not_verified',error_type=type(exc).__name__,
            reason=str(exc) if isinstance(exc,CapabilityError) else '输出未通过 Schema/证据校验；未产生替代结果。')
        code=2
    result['elapsed_seconds']=round(time.monotonic()-began,3)
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in result.items() if k not in ('output',)},ensure_ascii=False,indent=2))
    return code


if __name__=='__main__': sys.exit(main())

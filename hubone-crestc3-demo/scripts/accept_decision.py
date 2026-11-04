"""HTTP end-to-end SOFTWARE acceptance using SIMULATED events + Mock Provider."""
import argparse
import hashlib
import json
from pathlib import Path
import time

import httpx

ROOT=Path(__file__).resolve().parents[1]


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url',default='http://127.0.0.1:8000')
    parser.add_argument('--output',type=Path,default=ROOT/'artifacts/decision')
    args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
    checks=[]
    def check(name,condition):
        if not condition: raise AssertionError(name)
        checks.append(name)
    with httpx.Client(base_url=args.base_url,timeout=30,trust_env=False) as client:
        def get(path):
            r=client.get(path);r.raise_for_status();return r.json()
        r=client.post('/api/research/demo');r.raise_for_status();started=r.json();sid=started['session_id']
        check('explicit_mock_not_model_inference',started['simulated'] and not started['model_inference_executed'])
        deadline=time.monotonic()+60
        while time.monotonic()<deadline:
            job=get(f'/api/sessions/{sid}/jobs/{started["job"]["job_id"]}')
            if job['status']=='failed': raise AssertionError(job.get('error'))
            if job['status']=='completed': break
            time.sleep(.1)
        else: raise AssertionError('software demo job timeout')
        report=get(f'/api/sessions/{sid}/report');events=get(f'/api/sessions/{sid}/events')
        session=get(f'/api/sessions/{sid}')
        check('generation_is_mock',report['generation']['provider']=='mock' and report['processing_method']=='MOCK')
        check('no_model_or_hardware_claim',not report['generation']['model_inference_executed'] and not report['generation']['local_hardware_verified'])
        check('research_brief_preserved',report['research']==session['research'])
        check('three_epistemic_labels',set(c['classification'] for c in report['decision_analysis']['claims'])=={'FACT','INFERENCE','INSUFFICIENT_EVIDENCE'})
        originals=[e for e in events if e['source']!='AI_analysis']
        check('same_session_all_events',all(e['session_id']==sid for e in events))
        check('simulated_fixture_sources',all(e['metadata']['simulated'] and e['metadata']['processing_method']=='MOCK' for e in originals))
        check('video_audio_manual_inputs',{'video','audio','manual'}=={e['source'] for e in originals})
        index=report['evidence_index'];audit=[]
        a=report['decision_analysis']
        for item in [*a['claims'],*a['diagnoses'],*a['options'],*a['experiments'],a['decision']]:
            for eid in item['evidence_ids']:
                e=index[eid]
                check('reference_'+str(len(audit)),e['session_id']==sid and eid in report['evidence'] and eid in report['markdown'])
                audit.append({'event_id':eid,'timestamp':e['timestamp'],'source':e['source'],
                              'asset_id':e['asset_id'],'input_origin':e['input_origin'],'processing_method':e['processing_method']})
        check('diagnoses_have_alternatives',all(d['alternative_explanations'] and d['missing_evidence'] for d in a['diagnoses']))
        check('every_option_has_experiment',{o['option_id'] for o in a['options']}=={oid for x in a['experiments'] for oid in x['option_ids']})
        for e in index.values():
            if e['media_time'] is not None:
                check('time_'+e['event_id'],abs(e['timestamp']-(e['media_time']+e['offset_seconds']))<.001)
        for asset in session['assets']:
            r=client.get(f'/api/sessions/{sid}/assets/{asset["asset_id"]}');r.raise_for_status()
            check('media_hash_'+asset['kind'],hashlib.sha256(r.content).hexdigest()==asset['sha256'])
        for ext in ('md','json'):
            r=client.get(f'/api/sessions/{sid}/report.{ext}')
            check('export_'+ext,r.status_code==200 and 'attachment' in r.headers.get('content-disposition',''))
        check('public_schema_endpoint',get('/api/research/schema')['title']=='DecisionAnalysis')
        for name,data in [('report.json',report),('session.json',session),('events.json',events),('evidence-audit.json',audit)]:
            (args.output/name).write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
        (args.output/'report.md').write_text(report['markdown'],encoding='utf-8')
    result={'status':'passed_software_mock','session_id':sid,'checks_passed':len(checks),'checks':checks,
            'simulated':True,'analysis_provider':'mock','model_inference_executed':False,
            'ollama_live_verified':False,'model_quality_verified':False,'gpu_performance_verified':False,
            'camera_microphone_verified':False,'input_notice':'脚本事件；不是视觉识别/ASR/LLM 推理结果。'}
    (args.output/'acceptance-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in result.items() if k!='checks'},ensure_ascii=False,indent=2))


if __name__=='__main__': main()

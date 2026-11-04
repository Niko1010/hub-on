"""Run an entire demonstration against the running HTTP service and export evidence."""
import argparse
import json
from pathlib import Path
import time

import httpx


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--base-url',default='http://127.0.0.1:8000')
    parser.add_argument('--fixture',action='store_true',help='Explicit SIMULATED ASR fixture, not model output')
    parser.add_argument('--output',default='artifacts/latest')
    args=parser.parse_args()
    out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
    # Local HTTP validation intentionally bypasses remote credential proxies.
    with httpx.Client(base_url=args.base_url,timeout=30,trust_env=False) as client:
        response=client.post('/api/demo',params={'asr_mode':'fixture' if args.fixture else 'local'})
        response.raise_for_status()
        data=response.json();sid=data['session_id'];jid=data['job']['job_id']
        print('SIMULATED session:',sid,flush=True)
        began=time.monotonic();previous=None
        while time.monotonic()-began<300:
            response=client.get(f'/api/sessions/{sid}/jobs/{jid}');response.raise_for_status()
            job=response.json()
            message=(job['status'],job.get('message'))
            if previous!=message:
                print(job['status'],job.get('message'),flush=True);previous=message
            if job['status']=='failed':
                raise SystemExit(job['error'])
            if job['status']=='completed':
                break
            time.sleep(.5)
        else:
            raise SystemExit('Demo timeout')
        response=client.get(f'/api/sessions/{sid}/report');response.raise_for_status()
        report=response.json()
        events=client.get(f'/api/sessions/{sid}/events').json()
        assert report['simulated'] and 'SIMULATED' in report['markdown']
        assert any(e['source']=='video' for e in events)
        assert any(e['source']=='audio' for e in events)
        assert report['utterance_count']>=3
        assert len(report['insights'])>=2
        assert report['correlations']
        for i in report['insights']:
            assert i['evidence_ids'] and set(i['evidence_ids'])<=report['evidence'].keys()
        (out/'report.md').write_text(report['markdown'],encoding='utf-8')
        (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
        (out/'events.json').write_text(json.dumps(events,ensure_ascii=False,indent=2),encoding='utf-8')
        (out/'job.json').write_text(json.dumps(job,ensure_ascii=False,indent=2),encoding='utf-8')
        print(json.dumps({'status':'passed','session_id':sid,'events':len(events),
            'utterances':report['utterance_count'],'insights':len(report['insights']),
            'elapsed_seconds':round(time.monotonic()-began,2),'engine':report['engine'],
            'video':job['result']['video'],'audio':job['result']['audio'],'output':str(out)},ensure_ascii=False,indent=2))


if __name__=='__main__':
    main()

"""V0.1 HTTP acceptance of REAL recorded files, timing and evidence lineage."""
import argparse
import collections
import json
from pathlib import Path
import time

import httpx

ROOT=Path(__file__).resolve().parents[1]


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--base-url',default='http://127.0.0.1:8000')
    parser.add_argument('--video',type=Path,default=ROOT/'sample_data/acceptance/real-video.mp4')
    parser.add_argument('--audio',type=Path,default=ROOT/'sample_data/acceptance/real-speech.wav')
    parser.add_argument('--output',type=Path,default=ROOT/'artifacts/v0.1')
    args=parser.parse_args();out=args.output;out.mkdir(parents=True,exist_ok=True)
    started=time.monotonic()
    with httpx.Client(base_url=args.base_url,timeout=30,trust_env=False) as client:
        def get(path):
            response=client.get('/api'+path);response.raise_for_status();return response.json()
        def post(path,data):
            response=client.post('/api'+path,json=data);response.raise_for_status();return response.json()
        def wait(sid,job):
            deadline=time.monotonic()+180
            while time.monotonic()<deadline:
                job=get(f'/sessions/{sid}/jobs/{job["job_id"]}')
                if job['status']=='failed':raise AssertionError(job.get('error'))
                if job['status']=='completed':return job
                time.sleep(.3)
            raise AssertionError('job timeout')
        def upload(sid,path,kind):
            with path.open('rb') as f:
                response=client.post(f'/api/sessions/{sid}/assets',data={'kind':kind},files={'file':(path.name,f)})
            response.raise_for_status();return response.json()
        def audit(report):
            entries=[]
            for i in report['insights']:
                assert i['evidence_ids']
                for eid in i['evidence_ids']:
                    e=report['evidence'][eid]
                    assert e['session_id']==report['session']['session_id'] and e['source']!='AI_analysis'
                    assert eid in report['markdown']
                    if e['event_type']=='utterance':
                        assert e['evidence']['quote']==e['metadata']['raw_text']
                        assert e['description']
                    entries.append({'insight':i['title'],'event_id':eid,'timestamp':e['timestamp'],
                        'source':e['source'],'raw_text':e['metadata'].get('raw_text',e['description']),
                        'asset_id':e['evidence'].get('asset_id'),'processing_method':i['processing_method'],
                        'input_origin':e['metadata']['input_origin'],'status':'linked'})
            return entries

        session=post('/sessions',{'name':'V0.1 真实独立媒体验收（非同步采集）',
            'product':'通用媒体管线验收；非 Crest C3 消费者证据','simulated':False})
        sid=session['session_id']
        video=upload(sid,args.video,'video');audio=upload(sid,args.audio,'audio')
        video_job=wait(sid,post(f'/sessions/{sid}/video',{'asset_id':video['asset_id'],'offset_seconds':2.5}))
        audio_job=wait(sid,post(f'/sessions/{sid}/audio',{'asset_id':audio['asset_id'],'offset_seconds':1.25}))
        events=get(f'/sessions/{sid}/events')
        videos=[e for e in events if e['source']=='video']
        utterances=[e for e in events if e['source']=='audio']
        assert videos and utterances
        assert video_job['result']['person_observations']>0 and video_job['result']['poses_found']>0
        assert all(e['session_id']==sid and not e['metadata']['simulated'] for e in events)
        for e in videos:
            assert abs(e['timestamp']-(e['evidence']['media_time']+2.5))<.00011
            assert e['metadata']['processing_method'] in ('REAL_MODEL','RULE_BASED')
            assert e['evidence']['media_time']<=video_job['result']['duration_seconds']
            r=client.get(f'/api/sessions/{sid}/assets/{video["asset_id"]}/frames/{e["evidence"]["snapshot"]}')
            assert r.status_code==200 and r.headers['content-type']=='image/jpeg'
        for e in utterances:
            assert e['timestamp']==e['evidence']['start']+1.25
            assert e['metadata']['end_timestamp']==e['evidence']['end']+1.25
            assert e['evidence']['end']<=audio_job['result']['duration_seconds']+.5
            assert e['metadata']['processing_method']=='REAL_MODEL'
        wait(sid,post(f'/sessions/{sid}/analyze',{'provider':'rules'}))
        report=get(f'/sessions/{sid}/report')
        assert report['processing_method']=='RULE_BASED' and report['simulated'] is False
        by_id={e['event_id']:e for e in events}
        for link in report['correlations']:
            assert link['speaker_identity_verified'] is False
            for eid in link['video_event_ids']:
                assert link['start']-3<=by_id[eid]['timestamp']<=link['end']+3
        assert any(c['video_event_ids'] for c in report['correlations'])
        real_audit=audit(report)
        # A clearly SIMULATED product-text case exercises every product insight,
        # without attributing the unrelated human WAV to Crest C3 feedback.
        sim=post('/sessions',{'name':'V0.1 产品洞察证据验收 / SIMULATED','simulated':True})
        simid=sim['session_id']
        data=json.loads((ROOT/'sample_data/manual_transcript.example.json').read_text(encoding='utf-8'))
        post(f'/sessions/{simid}/transcripts',data)
        wait(simid,post(f'/sessions/{simid}/analyze',{'provider':'rules'}))
        sim_report=get(f'/sessions/{simid}/report');sim_audit=audit(sim_report)
        assert sim_report['simulated'] and sim_audit
        assert all(i['processing_method']=='RULE_BASED' for i in sim_report['insights'])
        for filename,value in [('real-events.json',events),('real-report.json',report),
            ('simulated-product-report.json',sim_report),('evidence-audit.json',real_audit+sim_audit)]:
            (out/filename).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
        (out/'real-report.md').write_text(report['markdown'],encoding='utf-8')
        (out/'simulated-product-report.md').write_text(sim_report['markdown'],encoding='utf-8')
        result={'status':'passed','real_session_id':sid,'simulated_session_id':simid,
            'originally_synchronous':False,'input_notice':'独立真实录像/真人语音；不验证人物身份或真实消费体验',
            'video_job':video_job['result'],'audio_job':audio_job['result'],
            'transcript':[e['description'] for e in utterances],
            'video_offset_seconds':2.5,'audio_offset_seconds':1.25,
            'event_count':len(events),'method_counts':dict(collections.Counter(e['metadata']['processing_method'] for e in events)),
            'timestamp_checks':'all events passed file-time + offset equations',
            'temporal_correlations':len(report['correlations']),
            'evidence_references_checked':len(real_audit+sim_audit),'product_insights_checked':len(sim_report['insights']),
            'elapsed_seconds':round(time.monotonic()-started,3)}
        (out/'acceptance-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
        print(json.dumps(result,ensure_ascii=False,indent=2))


if __name__=='__main__':
    main()

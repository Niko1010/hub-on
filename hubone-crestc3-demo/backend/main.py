"""One-process FastAPI application. Run from the project root with uvicorn."""
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager
from collections import defaultdict
import asyncio
import hashlib
import importlib.util
import json
import logging
import os
from pathlib import Path
import re
import shutil
import threading
from typing import Literal

from fastapi import FastAPI, File, Form, HTTPException, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from starlette.concurrency import run_in_threadpool

from backend.config import ROOT, data_dir, configured_path, CapabilityError
from backend.models import (Session,SessionCreate,Event,EventInput,TranscriptInput,
                            ProcessInput,AnalyzeInput,ResearchBrief,uid,Segment)
from backend.provenance import labels
from database.store import Store
from audio.pipeline import analyze_audio,transcript_events
from vision.pipeline import analyze_video
from analysis.report import build_report
from analysis.feedback import analyze_feedback
from space_intelligence.api import create_space_router

log=logging.getLogger('hubone')


def create_app(root: Path | None = None):
    store=Store(root or data_dir())
    locks=defaultdict(threading.Lock)
    executor=ThreadPoolExecutor(max_workers=2,thread_name_prefix='hubone')

    @asynccontextmanager
    async def lifespan(app):
        store.recover_jobs()
        yield
        executor.shutdown(wait=True)

    app=FastAPI(title='HUB ONE × CREST C3',version='0.3.0',lifespan=lifespan)
    app.state.store=store
    app.include_router(create_space_router(store))

    @app.exception_handler(KeyError)
    async def missing(request,exc):
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=404,content={'detail':str(exc.args[0])})

    @app.exception_handler(ValueError)
    async def invalid(request,exc):
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=422,content={'detail':str(exc)})

    def enqueue(sid,kind,fn):
        store.session(sid)
        job={'job_id':uid(),'session_id':sid,'kind':kind,'status':'queued','progress':0,'message':'排队中'}
        store.save_job(job)

        def progress(value,message):
            job.update(progress=round(value,3),message=message)
            store.save_job(job)

        def work():
            with locks[sid]:
                try:
                    job.update(status='running',message='处理中')
                    store.save_job(job)
                    result=fn(progress)
                    job.update(status='completed',progress=1,message='已完成',result=result)
                except CapabilityError as e:
                    job.update(status='failed',error=str(e),error_type='capability_missing')
                except (ValueError,FileNotFoundError) as e:
                    job.update(status='failed',error=str(e),error_type='invalid_input')
                except Exception as e:
                    # Provider errors may include keys or raw responses. Do not
                    # surface exception repr/tracebacks containing request details.
                    log.warning('Job %s failed: %s',job['job_id'],type(e).__name__)
                    job.update(status='failed',error=f'处理失败（{type(e).__name__}）。请检查模型、服务地址、凭据和网络；未生成替代结果。',
                               error_type=type(e).__name__)
                store.save_job(job)
        executor.submit(work)
        return dict(job)

    def asset_path(asset):
        path=store.root/'uploads'/asset['session_id']/asset['filename']
        if not path.is_file():
            raise KeyError('Asset file no longer exists')
        return path

    def register_asset(sid,path,kind,name=None):
        aid=uid()
        target=store.root/'uploads'/sid/(aid+path.suffix.lower())
        target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copyfile(path,target)
        return store.save_asset({'asset_id':aid,'session_id':sid,'kind':kind,'filename':target.name,
            'original_name':name or path.name,'size':target.stat().st_size,
            'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),
            **labels(store.session(sid)['simulated'],'UNPROCESSED')})

    def known_simulated(digest):
        manifest=ROOT/'sample_data/manifest.json'
        if manifest.is_file():
            data=json.loads(manifest.read_text(encoding='utf-8'))
            return digest in (data.get('audio_sha256'),data.get('video_sha256'))
        return False

    def known_origin(digest):
        if known_simulated(digest):
            return 'SIMULATED'
        manifest=ROOT/'sample_data/acceptance/manifest.json'
        if manifest.is_file():
            data=json.loads(manifest.read_text(encoding='utf-8'))
            if any(digest==p['sha256'] for p in data.get('files',[])):
                return 'REAL_RECORDING_REFERENCE'
        return 'USER_PROVIDED'

    def process_video(sid,p,progress):
        session=store.session(sid)
        asset=store.asset(sid,p.asset_id)
        if asset['kind']!='video':
            raise ValueError('asset is not video')
        output=store.root/'frames'/sid/p.asset_id
        # Compute first; an unsuccessful rerun leaves previous evidence intact.
        staging=store.root/'frames'/sid/(p.asset_id+'-staging')
        if staging.exists():
            shutil.rmtree(staging)
        events,stats=analyze_video(asset_path(asset),sid,p.asset_id,staging,
            offset=p.offset_seconds,zone=p.zone,simulated=session['simulated'] or asset.get('simulated',False),progress=progress)
        for event in events:
            if not event.metadata['simulated']:
                event.metadata['input_origin']=asset.get('input_origin','USER_PROVIDED')
        if output.exists():
            shutil.rmtree(output)
        staging.rename(output)
        store.write_events(sid,events,'video:'+p.asset_id,replace=True)
        return {'events':len(events),**stats}

    def process_audio(sid,p,progress,provider=None):
        session=store.session(sid)
        asset=store.asset(sid,p.asset_id)
        if asset['kind']!='audio':
            raise ValueError('asset is not audio')
        progress(0.1,'音频解码 / 转录中')
        events,stats=analyze_audio(asset_path(asset),sid,p.asset_id,
            store.root/'audio'/sid/p.asset_id,offset=p.offset_seconds,
            simulated=session['simulated'] or asset.get('simulated',False),provider=provider)
        for event in events:
            if not event.metadata['simulated']:
                event.metadata['input_origin']=asset.get('input_origin','USER_PROVIDED')
        store.write_events(sid,events,'audio:'+p.asset_id,replace=True)
        return {'events':len(events),**stats}

    def process_analysis(sid,provider,progress):
        progress(0.2,'关联研究问题与原始证据，生成决策型报告')
        events=[e for e in store.events(sid) if e['source']!='AI_analysis']
        if not events:
            raise ValueError('Session 尚无事件，请先处理视频 / 音频或录入文本。')
        report=build_report(store.session(sid),events,provider,assets=store.assets(sid))
        derived=[]
        for insight in report['insights']:
            ts=min(report['evidence'][i]['timestamp'] for i in insight['evidence_ids'])
            event=Event(session_id=sid,timestamp=ts,source='AI_analysis',event_type='research_hypothesis',
                description=insight['title'],evidence={'event_ids':insight['evidence_ids']},
                metadata={'engine':report['engine'],'status':'hypothesis',
                          **labels(report['simulated'],report['processing_method'],'EVIDENCE_DERIVED'),
                          'input_origins':report['input_origins'],
                          'model_inference_executed':report['generation']['model_inference_executed'],
                          'recommendation':insight['recommendation']})
            insight['analysis_event_id']=event.event_id
            derived.append(event)
        store.write_events(sid,derived,'analysis',replace=True)
        store.save_report(sid,report)
        directory=store.root/'reports'/sid
        directory.mkdir(parents=True,exist_ok=True)
        (directory/'report.md').write_text(report['markdown'],encoding='utf-8')
        (directory/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
        return {'insights':len(report['insights']),'engine':report['engine'],
                'correlations':len(report['correlations']),'simulated':report['simulated'],
                'processing_method':report['processing_method'],
                'model_inference_executed':report['generation']['model_inference_executed']}

    @app.get('/api/health')
    def health():
        return {'status':'ok','database':'sqlite','version':app.version}

    @app.get('/api/capabilities')
    def capabilities():
        provider=os.getenv('ASR_PROVIDER','sherpa')
        local=configured_path('ASR_MODEL_PATH','models/faster-whisper-tiny')
        return {'vision_weights':configured_path('VISION_WEIGHTS','models/yolo11n-pose.pt').is_file(),
            'vision_device':os.getenv('VISION_DEVICE','cpu'),'asr_provider':provider,
            'local_asr_ready':(local/'model.bin').is_file() and importlib.util.find_spec('faster_whisper') is not None,
            'sensevoice_ready':(configured_path('SENSEVOICE_MODEL_DIR','models/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17')/'model.int8.onnx').is_file(),
            'asr_key_present':bool(os.getenv('ASR_API_KEY') or os.getenv('OPENAI_API_KEY')),
            'llm_key_present':bool(os.getenv('LLM_API_KEY') or os.getenv('OPENAI_API_KEY')),
            'llm_provider':os.getenv('LLM_PROVIDER','openai'),
            'llm_providers_supported':['ollama','openai','anthropic','custom'],
            'llm_model':os.getenv('LLM_MODEL'),
            'llm_live_verified':False,
            'mock_policy':'explicit_simulated_session_only; no model inference',
            'analysis_provider':os.getenv('ANALYSIS_PROVIDER','rules'),
            'vad_model':configured_path('VAD_MODEL_PATH','models/silero_vad.onnx').is_file(),
            'speaker_diarization':'unavailable locally; only explicit provider/user labels',
            'sample_ready':(ROOT/'sample_data/manifest.json').is_file()}

    @app.get('/api/sessions')
    def sessions():
        return store.sessions()

    @app.post('/api/sessions',status_code=201)
    def create_session(p:SessionCreate):
        return store.create_session(Session(**p.model_dump()))

    @app.get('/api/sessions/{sid}')
    def get_session(sid:str):
        return {**store.session(sid),'assets':store.assets(sid)}

    @app.patch('/api/sessions/{sid}/research')
    def research_brief(sid:str,p:ResearchBrief):
        with locks[sid]:
            return store.update_research(sid,p.model_dump())

    @app.get('/api/research/schema')
    def research_schema():
        from analysis.decision_schema import output_schema
        return output_schema()

    @app.get('/api/sessions/{sid}/events')
    def get_events(sid:str):
        store.session(sid)
        return store.events(sid)

    @app.post('/api/sessions/{sid}/events',status_code=201)
    def manual_event(sid:str,p:EventInput):
        if p.source!='manual':
            raise ValueError('公开事件录入接口仅接受 manual；模型事件由处理流水线创建。')
        with locks[sid]:
            session=store.session(sid)
            data=p.model_dump()
            data['metadata']={**data['metadata'],
                **labels(session['simulated'] or bool(data['metadata'].get('simulated')),'MANUAL','MANUAL')}
            event=Event(session_id=sid,**data)
            store.write_events(sid,[event],'manual')
        return event

    @app.post('/api/sessions/{sid}/transcripts',status_code=201)
    def input_transcript(sid:str,p:TranscriptInput):
        with locks[sid]:
            session=store.session(sid)
            asset=None
            if p.asset_id:
                asset=store.asset(sid,p.asset_id)
                if asset['kind']!='audio':
                    raise ValueError('转录必须关联音频资产。')
            events=transcript_events(sid,p.segments,p.offset_seconds,p.asset_id,
                session['simulated'] or bool(asset and asset.get('simulated')))
            for event in events:
                if not event.metadata['simulated']:
                    event.metadata['input_origin']=asset.get('input_origin','USER_PROVIDED') if asset else 'MANUAL'
            store.write_events(sid,events,'text:'+uid())
        return {'events':[e.model_dump() for e in events]}

    @app.post('/api/sessions/{sid}/assets',status_code=201)
    async def upload(sid:str,kind:str=Form(...),file:UploadFile=File(...)):
        store.session(sid)
        allowed={'video':{'.mp4','.mov','.avi','.webm'},'audio':{'.wav','.mp3','.m4a','.ogg','.webm'}}
        ext=Path(file.filename or '').suffix.lower()
        if kind not in allowed or ext not in allowed[kind]:
            raise HTTPException(415,'文件类型不支持。视频 MP4/WebM，音频 WAV/MP3/M4A/OGG/WebM。')
        aid=uid()
        path=store.root/'uploads'/sid/(aid+ext)
        path.parent.mkdir(parents=True,exist_ok=True)
        size=0
        digest=hashlib.sha256()
        try:
            with path.open('wb') as f:
                while chunk:=await file.read(1024*1024):
                    size+=len(chunk)
                    if size>200*1024*1024:
                        raise HTTPException(413,'单文件上限 200 MB。')
                    digest.update(chunk)
                    f.write(chunk)
            if not size:
                raise HTTPException(422,'文件为空。')
            origin=known_origin(digest.hexdigest())
            return store.save_asset({'asset_id':aid,'session_id':sid,'kind':kind,'filename':path.name,
                'original_name':Path(file.filename).name,'size':size,'sha256':digest.hexdigest(),
                **labels(store.session(sid)['simulated'] or origin=='SIMULATED','UNPROCESSED',origin)})
        except BaseException:
            path.unlink(missing_ok=True)
            raise
        finally:
            await file.close()

    @app.get('/api/sessions/{sid}/assets/{aid}')
    def media(sid:str,aid:str):
        asset=store.asset(sid,aid)
        return FileResponse(asset_path(asset))

    @app.get('/api/sessions/{sid}/assets/{aid}/frames/{name}')
    def frame(sid:str,aid:str,name:str):
        store.asset(sid,aid)
        if not re.fullmatch(r'\d{7}\.jpg',name):
            raise KeyError('Frame not found')
        path=store.root/'frames'/sid/aid/name
        if not path.is_file():
            raise KeyError('Frame not found')
        return FileResponse(path)

    @app.post('/api/sessions/{sid}/video',status_code=202)
    def video(sid:str,p:ProcessInput):
        store.asset(sid,p.asset_id)
        return enqueue(sid,'video',lambda progress:process_video(sid,p,progress))

    @app.post('/api/sessions/{sid}/audio',status_code=202)
    def audio(sid:str,p:ProcessInput):
        store.asset(sid,p.asset_id)
        return enqueue(sid,'audio',lambda progress:process_audio(sid,p,progress))

    @app.post('/api/sessions/{sid}/analyze',status_code=202)
    def analyze(sid:str,p:AnalyzeInput):
        if p.provider=='mock' and not store.session(sid)['simulated']:
            raise ValueError('Mock Provider 仅允许显式 SIMULATED Session。')
        return enqueue(sid,'analysis',lambda progress:process_analysis(sid,p.provider,progress))

    @app.get('/api/sessions/{sid}/jobs/{jid}')
    def get_job(sid:str,jid:str):
        return store.job(sid,jid)

    @app.get('/api/sessions/{sid}/feedback')
    def feedback(sid:str):
        store.session(sid)
        return analyze_feedback(store.events(sid))

    @app.get('/api/sessions/{sid}/stats')
    def stats(sid:str):
        store.session(sid)
        events=store.events(sid)
        return {'events':len(events),'video':sum(e['source']=='video' for e in events),
                'utterances':sum(e['event_type']=='utterance' for e in events),
                'duration_seconds':max((e['metadata'].get('end_timestamp',e['timestamp']) for e in events),default=0),
                'report_ready':store.report(sid) is not None}

    @app.get('/api/sessions/{sid}/report')
    def report(sid:str):
        store.session(sid)
        result=store.report(sid)
        if not result:
            raise HTTPException(409,'尚无有效报告，资料更新后需重新运行分析。')
        return result

    @app.get('/api/sessions/{sid}/report.md')
    def markdown_report(sid:str):
        result=report(sid)
        return Response(result['markdown'],media_type='text/markdown; charset=utf-8',
            headers={'Content-Disposition':f'attachment; filename="crestc3-{sid[:8]}.md"'})

    @app.get('/api/sessions/{sid}/report.json')
    def json_report(sid:str):
        return Response(json.dumps(report(sid),ensure_ascii=False,indent=2),media_type='application/json',
                        headers={'Content-Disposition':f'attachment; filename="decision-{sid[:8]}.json"'})

    @app.post('/api/research/demo',status_code=202)
    def research_demo():
        from analysis.demo import fixture_events
        fixture=json.loads((ROOT/'sample_data/decision_session.example.json').read_text(encoding='utf-8'))
        session=Session(name=fixture['name'],simulated=True,research=ResearchBrief(**fixture['research']))
        store.create_session(session);sid=session.session_id
        assets={}
        for kind,name in [('video','video.mp4'),('audio','audio.wav')]:
            path=ROOT/'sample_data'/name
            if path.is_file(): assets[kind]=register_asset(sid,path,kind)['asset_id']
        def run(progress):
            progress(.1,'载入 SIMULATED + MOCK 事件；不调用识别模型')
            store.write_events(sid,fixture_events(sid,fixture,assets),'mock-fixture',replace=True)
            return process_analysis(sid,'mock',progress)
        return {'session_id':sid,'simulated':True,'processing_method':'MOCK','model_inference_executed':False,
                'job':enqueue(sid,'MOCK decision demo',run)}

    @app.get('/api/sessions/{sid}/events.json')
    def json_export(sid:str):
        return Response(json.dumps(get_events(sid),ensure_ascii=False,indent=2),media_type='application/json',
                        headers={'Content-Disposition':f'attachment; filename="events-{sid[:8]}.json"'})

    @app.post('/api/demo',status_code=202)
    def demo(asr_mode:Literal['local','fixture']='local'):
        sample=ROOT/'sample_data'
        required=['video.mp4','audio.wav','manifest.json','transcript.json','scenario.json']
        if not all((sample/f).is_file() for f in required):
            raise HTTPException(409,'缺少样例；先运行 python scripts/generate_samples.py。')
        session=Session(name='Crest C3 · 完整演示 / SIMULATED',simulated=True)
        store.create_session(session)
        sid=session.session_id
        v=register_asset(sid,sample/'video.mp4','video')
        a=register_asset(sid,sample/'audio.wav','audio')

        def run(progress):
            vstats=process_video(sid,ProcessInput(asset_id=v['asset_id']),
                                 lambda p,m:progress(p*0.65,m))
            astats=process_audio(sid,ProcessInput(asset_id=a['asset_id']),
                                 lambda p,m:progress(0.65+p*0.15,m),provider='simulated' if asr_mode=='fixture' else 'sherpa')
            scenario=json.loads((sample/'scenario.json').read_text(encoding='utf-8'))
            scripted=[Event(session_id=sid,source='manual',confidence=None,
                timestamp=e['timestamp'],event_type=e['event_type'],description=e['description'],
                evidence={'script':'sample_data/scenario.json'},
                metadata={**labels(True,'SIMULATED'),'origin':'scripted_annotation_not_cv'}) for e in scenario]
            store.write_events(sid,scripted,'scenario',replace=True)
            rstats=process_analysis(sid,'rules',lambda p,m:progress(0.8+p*0.2,m))
            return {'video':vstats,'audio':astats,'report':rstats}
        return {'session_id':sid, 'job':enqueue(sid,'SIMULATED demo',run)}

    @app.websocket('/api/sessions/{sid}/stream')
    async def stream(websocket:WebSocket,sid:str):
        try:
            store.session(sid)
        except KeyError:
            await websocket.close(code=1008)
            return
        await websocket.accept()
        previous=None
        try:
            while True:
                events=await run_in_threadpool(store.events,sid)
                signature=tuple(e['event_id'] for e in events)
                if signature!=previous:
                    await websocket.send_json({'type':'events_snapshot','session_id':sid,'events':events})
                    previous=signature
                else:
                    await websocket.send_json({'type':'heartbeat'})
                await asyncio.sleep(1)
        except (WebSocketDisconnect,RuntimeError):
            pass

    app.mount('/static',StaticFiles(directory=ROOT/'frontend'),name='static')

    @app.get('/')
    def index():
        return FileResponse(ROOT/'frontend/index.html')

    return app


app=create_app()

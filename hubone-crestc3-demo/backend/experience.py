"""Experience 1.2 routes over the existing Store, job runner and source evidence."""
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, Query
from pydantic import Field
from backend.models import StrictModel
from experience.core import (ExperienceStore, SourceRef, ResearchContext, StudyInput,
    AnnotationInput, ReviewedRangeInput, BusinessInput, framework, sources,
    load_source, validate_interval, evidence_index, digest, utc)

from experience.acl import StageInput,FeedbackInput,FeedbackLinkInput,ACLResearchInput
from experience.acl_timeline import TimelineImportInput,TimelineReviewInput,TimelineFeedbackLinkInput

class BehaviorInput(StrictModel):
    source_ref: SourceRef

class AudioInput(StrictModel):
    asset_id: str
    offset_seconds: float = Field(default=0,ge=0)
    authorization: dict = Field(default_factory=dict)

class SplitSource(StrictModel):
    session_id: str
    source_ref: SourceRef

class EvaluationInput(StrictModel):
    behavior_run_id: str
    train: list[SplitSource] = Field(default_factory=list,max_length=100)

class ResearchInput(StrictModel):
    provider: Literal['rules','llm'] = 'rules'

class ReviewInput(StrictModel):
    report_id: str
    report_sha256: str = Field(min_length=64,max_length=64)
    human_confirmed: bool = False
    decision: Literal['APPROVED','CHANGES_REQUESTED']
    notes: str = Field(min_length=1,max_length=3000)

def create_experience_router(store,enqueue):
    router=APIRouter(prefix='/api',tags=['Consumer Experience Intelligence 1.2'])
    records=ExperienceStore(store)

    def require_processing(sid):
        store.session(sid)
        context=records.context(sid)
        if context['authorization_status']=='DENIED' or context['deletion_status']=='REQUESTED':
            raise ValueError('Research processing paused: authorization denied or deletion requested')
        return context

    @router.get('/experience/framework')
    def dictionary(): return framework()

    @router.get('/experience/studies')
    def studies(): return records.list(None,'study')

    @router.post('/experience/studies',status_code=201)
    def study(body:StudyInput): return records.append(None,'study',body.model_dump())

    @router.get('/sessions/{sid}/experience')
    def overview(sid:str):
        session=store.session(sid)
        return {'session_id':sid,'product_positioning':'Consumer Experience Intelligence Platform',
            'context':records.context(sid),'sources':sources(store,sid),'studies':records.list(None,'study'),
            'business_inputs':records.list(sid,'business_input'),'audio_runs':records.list(sid,'audio_run'),
            'annotations':records.list(sid,'annotation'),'reviewed_ranges':records.list(sid,'reviewed_range'),
            'behavior_runs':[{k:v for k,v in r.items() if k!='predictions'} for r in records.list(sid,'behavior_run')],
            'latest_research':records.latest(sid,'research_report'),'reviews':records.list(sid,'report_review'),
            'simulated':session['simulated'],'cad_status':'NOT_CONNECTED',
            'identity_association':'NOT_CONNECTED','authorization_enforcement':'LOCAL_RESEARCH_WORKFLOW_ONLY',
            'limitations':['No enterprise authentication; authorization fields record project declarations.',
                'Timestamp proximity never establishes speaker/Track identity.',
                'Deletion requests pause new experience processing; physical source deletion requires separate review.']}

    @router.post('/sessions/{sid}/experience/context',status_code=201)
    def context(sid:str,body:ResearchContext):
        if body.study_id: records.record(None,body.study_id,'study')
        refs={'event:'+eid for eid in evidence_index(store,sid)}
        if not set(body.product_evidence_refs)<=refs: raise ValueError('Product evidence not owned by Session')
        return records.append(sid,'context',body.model_dump())

    @router.get('/sessions/{sid}/experience/observations')
    def observations(sid:str,kind:Literal['live','recording'],asset_id:str|None=None,
                     offset:int=Query(0,ge=0),limit:int=Query(500,ge=1,le=1000)):
        doc=load_source(store,sid,SourceRef(kind=kind,asset_id=asset_id))
        frames=doc.pop('frames')
        return {**doc,'frames':frames[offset:offset+limit],'total':len(frames),'offset':offset,'limit':limit}

    @router.post('/sessions/{sid}/experience/behaviors',status_code=202)
    def behaviors(sid:str,body:BehaviorInput):
        require_processing(sid)
        def work(progress):
            require_processing(sid)
            from experience.behavior import analyze_behaviors
            doc=load_source(store,sid,body.source_ref)
            if doc['status'] not in ('STOPPED','AVAILABLE','FAILED'): raise ValueError('Stop capture before freezing a behavior review dataset')
            progress(.2,'读取已有关键点；不重新执行视觉模型')
            predictions=analyze_behaviors(doc['frames'],session_id=sid,source_ref=doc['source_ref'])
            require_processing(sid)
            result=records.append(sid,'behavior_run',{'source_ref':doc['source_ref'],'source_fingerprint':doc['fingerprint'],
                'source_mode':doc['source_mode'],'video_sha256':doc['video_sha256'],'method':'RULE_BASED',
                'verification_status':'NOT_VERIFIED','predictions':predictions,
                'model_inference_executed':False,'sampled_frames':len(doc['frames']),
                'candidate_count':sum(p.get('status')=='CANDIDATE' for p in predictions),
                'unknown_count':sum(p.get('status')=='UNKNOWN' for p in predictions)})
            return {k:v for k,v in result.items() if k!='predictions'}
        return enqueue(sid,'experience_behaviors',work)

    @router.get('/sessions/{sid}/experience/behaviors/{rid}')
    def behavior_run(sid:str,rid:str,offset:int=Query(0,ge=0),limit:int=Query(1000,ge=1,le=2000)):
        run=records.record(sid,rid,'behavior_run'); predictions=run.pop('predictions')
        return {**run,'predictions':predictions[offset:offset+limit],'total':len(predictions)}

    def annotation_record(sid,body,kind):
        require_processing(sid)
        doc=load_source(store,sid,body.source_ref)
        if doc['status'] not in ('STOPPED','AVAILABLE','FAILED'): raise ValueError('Stop capture before annotating')
        refs=validate_interval(doc,body)
        value=body.model_dump(); value.pop('human_confirmed')
        return records.append(sid,kind,{**value,'source_ref':doc['source_ref'],'source_mode':doc['source_mode'],
            'evidence_refs':refs,'video_sha256':doc['video_sha256'],'annotator_kind':'HUMAN',
            'verification_status':'HUMAN_VERIFIED' if body.human_confirmed else 'NOT_VERIFIED',
            'original_observation_modified':False})

    @router.post('/sessions/{sid}/experience/annotations',status_code=201)
    def annotate(sid:str,body:AnnotationInput): return annotation_record(sid,body,'annotation')

    @router.post('/sessions/{sid}/experience/reviewed-ranges',status_code=201)
    def reviewed_range(sid:str,body:ReviewedRangeInput): return annotation_record(sid,body,'reviewed_range')

    @router.post('/sessions/{sid}/experience/evaluate')
    def evaluate(sid:str,body:EvaluationInput):
        from experience.evaluation import evaluate_behaviors
        require_processing(sid)
        run=records.record(sid,body.behavior_run_id,'behavior_run')
        source_ref={k:run['source_ref'][k] for k in ('kind','asset_id') if k in run['source_ref']}
        current=load_source(store,sid,source_ref)
        if current['fingerprint']!=run['source_fingerprint']: raise ValueError('Behavior source changed; regenerate before evaluation')
        annotations=[{**r,'annotation_id':r['record_id']} for r in records.list(sid,'annotation') if r['source_fingerprint']==run['source_fingerprint']]
        reviewed=[r for r in records.list(sid,'reviewed_range') if r['source_fingerprint']==run['source_fingerprint']]
        train=[]
        for item in body.train:
            doc=load_source(store,item.session_id,item.source_ref)
            train.append({'session_id':item.session_id,'video_sha256':doc['video_sha256']})
        manifest={'train':train,'test':[{'session_id':sid,'video_sha256':run['video_sha256']}],'reviewed_ranges':reviewed}
        result=evaluate_behaviors(run['predictions'],annotations,manifest)
        return records.append(sid,'evaluation',{'behavior_run_id':run['record_id'],'source_fingerprint':run['source_fingerprint'],
            'split_manifest':manifest,'annotation_ids':[r['record_id'] for r in annotations],**result})

    @router.post('/sessions/{sid}/experience/business-inputs',status_code=201)
    def business_input(sid:str,body:BusinessInput):
        context=require_processing(sid)
        metrics={m['id'] for d in framework()['dimensions'] for m in d['metrics']}
        if body.metric_id not in metrics: raise ValueError('Unknown business metric')
        if body.source_type.endswith('_IMPORT') and (context['authorization_status']!='AUTHORIZED' or not context['authorization_reference']):
            raise ValueError('Business imports require explicit project authorization')
        valid={'event:'+eid for eid in evidence_index(store,sid)}
        if not set(body.evidence_refs)<=valid: raise ValueError('Evidence references not in this Session')
        if body.source_type.endswith('_IMPORT') and not body.external_record_reference:
            raise ValueError('Imported business data requires source record reference')
        if isinstance(body.value,str) and len(body.value)>4000: raise ValueError('Business value too long')
        value=body.model_dump(); value.pop('human_confirmed')
        return records.append(sid,'business_input',{**value,'source_mode':'SIMULATED' if store.session(sid)['simulated'] else 'USER_PROVIDED',
            'method':'MANUAL_IMPORT' if body.source_type.endswith('_IMPORT') else 'HUMAN_INPUT',
            'verification_status':'HUMAN_VERIFIED' if body.human_confirmed else 'NOT_VERIFIED',
            'external_system_connected':False})

    @router.post('/sessions/{sid}/experience/audio',status_code=202)
    def audio(sid:str,body:AudioInput):
        require_processing(sid)
        asset=store.asset(sid,body.asset_id)
        if asset['kind']!='audio': raise ValueError('Audio analysis requires an audio Asset')
        def work(progress):
            require_processing(sid)
            from audio.experience import analyze_experience_audio
            path=store.root/'uploads'/sid/asset['filename']
            if not path.resolve().is_relative_to((store.root/'uploads'/sid).resolve()): raise ValueError('Invalid asset path')
            import uuid
            run_id=uuid.uuid4().hex
            result=analyze_experience_audio(path,sid,body.asset_id,store.root/'experience_audio'/sid/run_id,
                offset=body.offset_seconds,simulated=store.session(sid)['simulated'] or asset.get('simulated',False),
                authorization=body.authorization,progress=progress)
            require_processing(sid)
            store.write_events(sid,result['events'],'experience_audio:'+run_id,replace=False)
            return records.append(sid,'audio_run',{'asset_id':body.asset_id,'run_id':run_id,
                'stats':result['stats'],'transcripts':result['transcripts'],'provenance':result['provenance'],
                'event_ids':[e.event_id for e in result['events']],'time_alignment_status':'USER_PROVIDED',
                'speaker_track_association':'UNASSOCIATED'})
        return enqueue(sid,'experience_audio',work)

    @router.get('/sessions/{sid}/experience/evidence')
    def evidence(sid:str): return {'session_id':sid,'items':list(evidence_index(store,sid).values())}

    @router.post('/sessions/{sid}/experience/research',status_code=202)
    def research(sid:str,body:ResearchInput):
        context=require_processing(sid)
        def work(progress):
            require_processing(sid)
            from experience.research import run_research
            progress(.1,'整理原始证据并运行研究校验')
            report=run_research(store,records,sid,provider=body.provider)
            require_processing(sid)
            return records.append(sid,'research_report',report)
        return enqueue(sid,'experience_research',work)

    @router.get('/experience/acl/protocol')
    def acl_protocol():
        from experience.acl import protocol
        return protocol()

    @router.get('/sessions/{sid}/experience/acl')
    def acl_overview(sid:str):
        from experience.acl import overview
        return overview(store,records,sid)

    @router.get('/sessions/{sid}/experience/acl/timeline')
    def acl_timeline(sid:str):
        from experience.acl_timeline import timeline_context
        return timeline_context(store,records,sid)

    @router.get('/sessions/{sid}/experience/acl/timeline/frames')
    def acl_timeline_frames(sid:str,offset:int=Query(default=0,ge=0),limit:int=Query(default=500,ge=1,le=2000)):
        from experience.acl_timeline import frame_manifest
        return frame_manifest(store,records,sid,offset,limit)

    @router.post('/sessions/{sid}/experience/acl/timeline/import',status_code=201)
    def acl_timeline_import(sid:str,body:TimelineImportInput):
        from experience.acl_timeline import import_timeline
        return import_timeline(store,records,sid,body)

    @router.post('/sessions/{sid}/experience/acl/timeline/reviews',status_code=201)
    def acl_timeline_review(sid:str,body:TimelineReviewInput):
        from experience.acl_timeline import save_review
        return save_review(store,records,sid,body)

    @router.post('/sessions/{sid}/experience/acl/timeline/feedback-links',status_code=201)
    def acl_timeline_feedback_link(sid:str,body:TimelineFeedbackLinkInput):
        from experience.acl_timeline import save_timeline_feedback_link
        return save_timeline_feedback_link(store,records,sid,body)

    @router.post('/sessions/{sid}/experience/acl/stages',status_code=201)
    def acl_stage(sid:str,body:StageInput):
        from experience.acl import save_stage
        return save_stage(store,records,sid,body)

    @router.post('/sessions/{sid}/experience/acl/feedback',status_code=201)
    def acl_feedback(sid:str,body:FeedbackInput):
        from experience.acl import save_feedback
        return save_feedback(store,records,sid,body)

    @router.post('/sessions/{sid}/experience/acl/feedback-links',status_code=201)
    def acl_feedback_link(sid:str,body:FeedbackLinkInput):
        from experience.acl import save_feedback_link
        return save_feedback_link(store,records,sid,body)

    @router.post('/sessions/{sid}/experience/acl/behaviors',status_code=202)
    def acl_behaviors(sid:str,body:BehaviorInput):
        from experience.acl import require_acl
        require_acl(store,records,sid)
        def work(progress):
            require_acl(store,records,sid)
            from experience.acl_behavior import analyze_acl_behaviors
            doc=load_source(store,sid,body.source_ref)
            if doc['status'] not in ('STOPPED','AVAILABLE','FAILED','ERROR'):
                raise ValueError('Stop capture before saving frozen ACL behavior candidates')
            progress(.2,'读取真实Observation；不重复执行YOLO/Pose')
            result=analyze_acl_behaviors(doc['frames'],session_id=sid,source_ref=doc['source_ref'])
            require_acl(store,records,sid)
            if load_source(store,sid,body.source_ref)['fingerprint']!=doc['fingerprint']:
                raise ValueError('ACL source changed during behavior analysis')
            value=records.append(sid,'acl_behavior_run',{**result,'source_ref':doc['source_ref'],
                'source_fingerprint':doc['fingerprint'],'source_mode':doc['source_mode'],
                'sampled_frames':len(doc['frames']),'video_sha256':doc['video_sha256']})
            return {k:v for k,v in value.items() if k!='predictions'}
        return enqueue(sid,'acl_behaviors',work)

    @router.post('/sessions/{sid}/experience/acl/research',status_code=202)
    def acl_research(sid:str,body:ACLResearchInput):
        from experience.acl import require_acl,preliminary
        require_acl(store,records,sid)
        def work(progress):
            require_acl(store,records,sid)
            progress(.1,'读取本次真实证据；一次模型请求，不自动重试')
            if body.stage=='preliminary':
                result=preliminary(store,records,sid);kind='acl_preliminary'
            else:
                from experience.research import run_research
                result=run_research(store,records,sid,provider='llm');kind='acl_research'
            require_acl(store,records,sid)
            return records.append(sid,kind,result)
        return enqueue(sid,'acl_'+body.stage,work)

    @router.post('/sessions/{sid}/experience/reviews',status_code=201)
    def review(sid:str,body:ReviewInput):
        require_processing(sid)
        report=records.record(sid,body.report_id,'research_report')
        if report['report_sha256']!=body.report_sha256: raise ValueError('Report changed; reload before reviewing')
        if not body.human_confirmed: raise ValueError('Explicit human review confirmation required')
        from experience.research import current_research_fingerprint
        if current_research_fingerprint(store,records,sid)!=report['source_snapshot_sha256']:
            raise ValueError('Source evidence changed; regenerate report before review')
        return records.append(sid,'report_review',{**body.model_dump(),'verification_status':'HUMAN_VERIFIED',
            'publication_status':'LOCAL_REVIEW_ONLY','automatic_publication':False})

    return router

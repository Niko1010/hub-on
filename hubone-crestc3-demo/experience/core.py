"""Additive experience records and read-only adapters to existing evidence."""
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
from typing import Literal
from uuid import uuid4

from pydantic import Field, model_validator
from backend.models import StrictModel

BEHAVIORS = ('ENTERING','EXITING','STATIONARY','WALKING','BENDING','RAISING_HAND',
             'SITTING','STANDING_UP','SQUATTING','UNKNOWN')

def utc(): return datetime.now(timezone.utc).isoformat()
def digest(value): return hashlib.sha256(json.dumps(value,sort_keys=True,ensure_ascii=False,allow_nan=False).encode()).hexdigest()
def framework(): return json.loads((Path(__file__).with_name('dictionary.json')).read_text(encoding='utf-8'))

class SourceRef(StrictModel):
    kind: Literal['live','recording']
    asset_id: str | None = Field(default=None, max_length=100)
    @model_validator(mode='after')
    def compatible(self):
        if (self.kind=='recording') != bool(self.asset_id): raise ValueError('recording requires asset_id; live has no asset_id')
        return self

class ResearchContext(StrictModel):
    study_id: str | None = Field(default=None,max_length=100)
    research_purpose: str = Field(default='',max_length=2000)
    environment: Literal['HOME_TEST','FIELD_STUDY','REFERENCE_TEST','UNKNOWN'] = 'UNKNOWN'
    authorization_status: Literal['UNKNOWN','AUTHORIZED','DENIED'] = 'UNKNOWN'
    authorization_reference: str | None = Field(default=None,max_length=300)
    notice_provided: bool = False
    access_scope: Literal['LOCAL_ONLY','PROJECT_MEMBERS'] = 'LOCAL_ONLY'
    retention_days: int | None = Field(default=None,ge=1,le=3650)
    deletion_status: Literal['ACTIVE','REQUESTED'] = 'ACTIVE'
    deidentification_status: Literal['UNKNOWN','RAW','REDACTED'] = 'UNKNOWN'
    product_present_verified: bool = False
    product_evidence_refs: list[str] = Field(default_factory=list,max_length=20)
    consumer_characteristics: dict[str,str] = Field(default_factory=dict)
    membership_reference: str | None = Field(default=None,max_length=200)
    time_alignment_status: Literal['UNKNOWN','USER_PROVIDED','HUMAN_VERIFIED'] = 'UNKNOWN'
    time_alignment_notes: str = Field(default='',max_length=1000)
    @model_validator(mode='after')
    def authorized_fields(self):
        if len(self.consumer_characteristics)>30 or any(len(k)>100 or len(v)>500 for k,v in self.consumer_characteristics.items()):
            raise ValueError('consumer characteristics exceed bounded project scope')
        if self.consumer_characteristics or self.membership_reference:
            if self.authorization_status!='AUTHORIZED' or not self.authorization_reference or not self.research_purpose.strip():
                raise ValueError('Consumer/member data requires project purpose and explicit authorization reference')
        if self.product_present_verified and not self.product_evidence_refs:
            raise ValueError('Verified product presence requires evidence')
        return self

class StudyInput(StrictModel):
    title: str = Field(min_length=1,max_length=200)
    question: str = Field(min_length=1,max_length=2000)
    product: str = Field(default='',max_length=200)
    target_dimensions: list[Literal['WHO','ATTENTION','UNDERSTANDING','EXPERIENCE','DECISION','LATENT_NEEDS']] = Field(default_factory=list)

class AnnotationInput(StrictModel):
    source_ref: SourceRef
    source_fingerprint: str = Field(min_length=64,max_length=64)
    track_id: str = Field(min_length=1,max_length=100)
    label: Literal['ENTERING','EXITING','STATIONARY','WALKING','BENDING','RAISING_HAND','SITTING','STANDING_UP','SQUATTING','UNKNOWN']
    start: float = Field(ge=0)
    end: float = Field(ge=0)
    occluded: bool = False
    uncertain: bool = False
    human_confirmed: bool = False
    notes: str = Field(default='',max_length=2000)
    @model_validator(mode='after')
    def interval(self):
        if self.end<self.start: raise ValueError('Annotation end precedes start')
        return self

class ReviewedRangeInput(StrictModel):
    source_ref: SourceRef
    source_fingerprint: str = Field(min_length=64,max_length=64)
    track_id: str = Field(min_length=1,max_length=100)
    start: float = Field(ge=0)
    end: float = Field(ge=0)
    complete: bool = False
    human_confirmed: bool = False
    @model_validator(mode='after')
    def interval(self):
        if self.end<self.start: raise ValueError('Reviewed end precedes start')
        return self

class BusinessInput(StrictModel):
    metric_id: str = Field(min_length=1,max_length=150)
    timestamp: float = Field(ge=0)
    value: str | float | bool
    unit: str = Field(default='',max_length=100)
    source_type: Literal['HUMAN_FEEDBACK','RESEARCH_OBSERVATION','CRM_IMPORT','POS_IMPORT','MEMBER_IMPORT','PRODUCT_SENSOR_IMPORT']
    evidence_refs: list[str] = Field(default_factory=list,max_length=50)
    external_record_reference: str | None = Field(default=None,max_length=300)
    human_confirmed: bool = False
    notes: str = Field(default='',max_length=2000)

class ExperienceStore:
    """Side table in the same SQLite; source Session/Event/Observation remain immutable."""
    def __init__(self,store):
        self.store=store
        with store.connect() as db:
            db.executescript('''CREATE TABLE IF NOT EXISTS experience_records (
                record_id TEXT PRIMARY KEY, session_id TEXT REFERENCES sessions(session_id),
                kind TEXT NOT NULL, created_at TEXT NOT NULL, payload TEXT NOT NULL);
                CREATE INDEX IF NOT EXISTS experience_record_scope ON experience_records(session_id,kind);''')
    def append(self,sid,kind,data):
        if sid: self.store.session(sid)
        value={**data,'record_id':uuid4().hex,'session_id':sid,'record_kind':kind,'created_at':utc()}
        with self.store.connect() as db:
            db.execute('INSERT INTO experience_records VALUES (?,?,?,?,?)',
                       (value['record_id'],sid,kind,value['created_at'],json.dumps(value,ensure_ascii=False,allow_nan=False)))
        return value
    def list(self,sid,kind):
        with self.store.connect() as db:
            rows=db.execute('SELECT payload FROM experience_records WHERE session_id IS ? AND kind=? ORDER BY rowid',(sid,kind)).fetchall()
        return [json.loads(row[0]) for row in rows]
    def latest(self,sid,kind):
        values=self.list(sid,kind)
        return values[-1] if values else None
    def context(self,sid): return self.latest(sid,'context') or ResearchContext().model_dump()
    def record(self,sid,rid,kind=None):
        with self.store.connect() as db:
            row=db.execute('SELECT payload FROM experience_records WHERE session_id IS ? AND record_id=?',(sid,rid)).fetchone()
        if not row: raise KeyError('Experience record not found in this Session')
        value=json.loads(row[0])
        if kind and value['record_kind']!=kind: raise ValueError('Wrong record kind')
        return value

def source_mode(session,metadata=None,asset=None):
    metadata=metadata or {}; asset=asset or {}
    if session.get('simulated') or metadata.get('simulated') or asset.get('simulated'): return 'SIMULATED'
    if metadata.get('source_type')=='RTSP' or metadata.get('source_mode')=='LIVE': return 'REAL_LIVE'
    if asset.get('recording_mode')=='REAL_RECORDING' or metadata.get('recording_mode')=='REAL_RECORDING': return 'REAL_RECORDING'
    if metadata.get('source_mode')=='REAL_RECORDING': return 'REAL_RECORDING'
    return 'UNKNOWN'

def sources(store,sid):
    session=store.session(sid); results=[]
    with store.connect() as db:
        table=db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='live_sessions'").fetchone()
        row=db.execute('SELECT payload FROM live_sessions WHERE session_id=?',(sid,)).fetchone() if table else None
    if row:
        live=json.loads(row[0]); results.append({'kind':'live','asset_id':None,'name':'RTSP sampled evidence',
            'source_mode':'SIMULATED' if session['simulated'] else 'REAL_LIVE','status':live['status'],
            'media_kind':'SAMPLED_FRAMES','model_provenance':live.get('vision_provenance')})
    for asset in store.assets(sid):
        if asset['kind']=='video':
            available=(store.root/'frames'/sid/asset['asset_id']/'observations.json').is_file()
            results.append({'kind':'recording','asset_id':asset['asset_id'],'name':asset['original_name'],
                'source_mode':source_mode(session,{},asset),'status':'AVAILABLE' if available else 'NOT_CONNECTED',
                'media_kind':'VIDEO','video_sha256':asset.get('sha256')})
    return results

def load_source(store,sid,ref):
    """Normalize saved observations only; never load YOLO or fabricate missing joints."""
    ref=ref.model_dump() if isinstance(ref,SourceRef) else ref
    session=store.session(sid)
    if ref['kind']=='live':
        with store.connect() as db:
            row=db.execute('SELECT payload FROM live_sessions WHERE session_id=?',(sid,)).fetchone()
            if not row: raise KeyError('No LIVE source for this Session')
            live=json.loads(row[0])
            rows=db.execute('SELECT observation_id,payload FROM live_observations WHERE session_id=? ORDER BY timestamp,observation_id LIMIT 10001',(sid,)).fetchall()
        if len(rows)>10000: raise ValueError('Review exceeds 10000 sampled frames; split the research interval before analysis')
        frames=[]
        for row in rows:
            frame=json.loads(row[1]); frame['observation_id']=row[0]
            frame['evidence_ref']=f'observation:{row[0]}'
            frame['frame_url']=f"/api/live/sessions/{sid}/frames/{frame['snapshot']}"
            frames.append(frame)
        metadata={'source_mode':'SIMULATED' if session['simulated'] else 'REAL_LIVE',
            'width':live.get('metrics',{}).get('width'),'height':live.get('metrics',{}).get('height'),
            'video_fps':live.get('metrics',{}).get('source_fps'),'media_kind':'SAMPLED_FRAMES',
            'model_provenance':live.get('vision_provenance'),'video_sha256':None,
            'run_id':sid,'offset_seconds':0,'media_url':None,'status':live['status']}
    else:
        asset=store.asset(sid,ref['asset_id'])
        if asset['kind']!='video': raise ValueError('Source must be a video Asset')
        path=store.root/'frames'/sid/asset['asset_id']/'observations.json'
        if not path.is_file(): raise KeyError('NOT CONNECTED: saved observations are unavailable')
        doc=json.loads(path.read_text(encoding='utf-8'))
        if doc['session_id']!=sid or doc['asset_id']!=asset['asset_id']: raise ValueError('Observation ownership mismatch')
        frames=doc['frames']
        if len(frames)>10000: raise ValueError('Review exceeds 10000 sampled frames')
        for frame in frames:
            frame['observation_id']=f"{doc['run_id']}:{frame['frame_index']}"
            frame['evidence_ref']=f"recording:{asset['asset_id']}:{doc['run_id']}:{frame['frame_index']}"
            frame['frame_url']=f"/api/sessions/{sid}/assets/{asset['asset_id']}/frames/{frame['snapshot']}"
        metadata={'source_mode':source_mode(session,doc,asset),'width':doc['width'],'height':doc['height'],
            'video_fps':doc.get('video_fps'),'media_kind':'VIDEO','model_provenance':doc.get('vision_provenance'),
            'pose_provenance':doc.get('pose_provenance'),'video_sha256':asset.get('sha256'),
            'run_id':doc['run_id'],'offset_seconds':doc.get('offset_seconds',0),'status':'AVAILABLE',
            'media_url':f"/api/sessions/{sid}/assets/{asset['asset_id']}/playback" if doc.get('playback_status')=='READY' else f"/api/sessions/{sid}/assets/{asset['asset_id']}"}
    normalized_ref={**ref,'session_id':sid,'run_id':metadata['run_id']}
    for frame in frames:
        frame.update(source_mode=metadata['source_mode'],source_ref=normalized_ref)
        for track in frame['tracks']:
            track['keypoints']=track.get('keypoints',[])
            track['inside_zone']=bool(track.get('image_zone_id')) if 'image_zone_id' in track else None
    fingerprint=digest({'source_ref':normalized_ref,'frames':frames,'video_sha256':metadata['video_sha256']})
    return {**metadata,'session_id':sid,'source_ref':normalized_ref,'fingerprint':fingerprint,
            'coordinate_system':'IMAGE_PIXELS','cad_status':'NOT_CONNECTED','frames':frames,
            'start':min((f['timestamp'] for f in frames),default=0),'end':max((f['timestamp'] for f in frames),default=0)}

def validate_interval(source,body):
    if source['fingerprint']!=body.source_fingerprint: raise ValueError('Source changed; reload before annotating')
    if body.start<source['start'] or body.end>source['end']: raise ValueError('Interval outside saved evidence')
    matching=[f for f in source['frames'] if body.start<=f['timestamp']<=body.end and any(t['track_id']==body.track_id for t in f['tracks'])]
    if not matching: raise ValueError('No observed Track in this source interval')
    return [f['evidence_ref'] for f in matching]

def evidence_index(store,sid):
    """Reuse existing decision evidence checks; bridge only trusted LIVE frame naming."""
    from analysis.decision import evidence_snapshot
    session=store.session(sid); assets=store.assets(sid)
    events=[e for e in store.events(sid) if e['source']!='AI_analysis']
    prepared=[]; live_frames={}
    for event in events:
        copy=json.loads(json.dumps(event)); proof=copy.get('evidence',{}); meta=copy.get('metadata',{})
        if meta.get('source_type')=='RTSP' and event['source']=='video':
            snapshot=proof.get('snapshot')
            if not snapshot or not re.fullmatch(r'\d{12}\.jpg',snapshot): raise ValueError('Invalid LIVE evidence name')
            path=store.root/'live_frames'/sid/snapshot
            with store.connect() as db:
                row=db.execute('SELECT payload FROM live_observations WHERE session_id=? AND frame_index=?',(sid,int(snapshot[:-4]))).fetchone()
            if not row or not path.is_file(): raise ValueError('LIVE evidence missing or not owned by Session')
            observation=json.loads(row[0])
            if event['event_id'] not in observation.get('event_ids',[]): raise ValueError('LIVE event/Observation reference mismatch')
            live_frames[event['event_id']]=f'/api/live/sessions/{sid}/frames/{snapshot}'
            proof.pop('snapshot',None)
        prepared.append(copy)
    index=evidence_snapshot(session,prepared,assets)
    byid={e['event_id']:e for e in events}
    for eid,entry in index.items():
        if eid in live_frames: entry['frame_url']=live_frames[eid]
        entry['source_mode']=source_mode(session,byid[eid].get('metadata'),next((a for a in assets if a['asset_id']==entry.get('asset_id')),{}))
        entry['ref']='event:'+eid
    return index

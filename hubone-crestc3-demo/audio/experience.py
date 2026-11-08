"""Authorized, local audio evidence over the existing VAD/ASR pipeline.

No microphone is opened here. Existing media is processed only for the declared
scope; public reference speech is never treated as a consumer product interview.
"""
from datetime import datetime, timezone
from importlib.metadata import version
from pathlib import Path
import hashlib
import json
import math
import os
from uuid import uuid4

from audio.pipeline import analyze_audio
from backend.config import CapabilityError, configured_path


REFERENCE_ZH_SHA256 = 'b77f1794fe374a0ba1ee1dc458bfaf9349496cbbfc32780c50ba3c5a7ad8e373'
REFERENCE_SOURCE = 'https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17.tar.bz2'


def file_sha256(path):
    digest = hashlib.sha256()
    with Path(path).open('rb') as source:
        for block in iter(lambda: source.read(1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest()


def _authorization(value, simulated):
    data = dict(value or {})
    if simulated:
        return {'status': 'SIMULATED', 'scope': 'SOFTWARE_TEST',
                'notice_provided': None, 'basis': 'Explicit simulated input',
                'research_purpose': 'Software demonstration only', 'retention_days': None,
                'access_scope': 'LOCAL_ONLY', 'consent_record_id': None,
                'verification': 'NOT_CONSUMER_RESEARCH'}
    status, scope = data.get('status'), data.get('scope')
    if status not in ('AUTHORIZED', 'REFERENCE_TEST'):
        raise PermissionError('Audio authorization is UNKNOWN or denied; processing was not started')
    expected = 'CONSUMER_RESEARCH' if status == 'AUTHORIZED' else 'REFERENCE_TECHNICAL_TEST'
    if scope != expected:
        raise PermissionError('Audio authorization scope does not match its declared status')
    if status == 'AUTHORIZED' and data.get('notice_provided') is not True:
        raise PermissionError('Consumer audio requires declared notice and authorization')
    for field in ('basis', 'research_purpose'):
        if not isinstance(data.get(field), str) or not data[field].strip():
            raise PermissionError('Audio requires an authorization basis and research purpose')
    if data.get('access_scope', 'LOCAL_ONLY') != 'LOCAL_ONLY':
        raise PermissionError('This adapter supports local processing only')
    days = data.get('retention_days')
    if days is not None and (type(days) is not int or not 1 <= days <= 3650):
        raise ValueError('retention_days must be 1–3650 or UNKNOWN/null')
    return {key: data.get(key) for key in ('status', 'scope', 'notice_provided', 'basis',
        'research_purpose', 'retention_days', 'consent_record_id')} | {
        'access_scope': 'LOCAL_ONLY', 'verification': 'USER_DECLARED_NOT_INDEPENDENTLY_VERIFIED'}


def analyze_experience_audio(path, sid, aid, output, *, offset=0, simulated=False,
                             authorization=None, progress=None):
    """Return Events, transcript records, VAD stats and actual model provenance.

    The caller owns Session/Asset authorization, job execution and SQLite writes.
    ``start/end`` are media seconds; ``timestamp/end_timestamp`` are Session
    seconds. No speaker-to-track association or word alignment is inferred.
    """
    auth = _authorization(authorization, simulated)  # Before I/O or inference.
    if not isinstance(sid, str) or not sid.strip() or not isinstance(aid, str) or not aid.strip():
        raise ValueError('Existing Session and Asset IDs are required')
    if isinstance(offset, bool) or not isinstance(offset, (int, float)) or not math.isfinite(offset) or offset < 0:
        raise ValueError('offset must be a finite nonnegative Session offset')
    path, output = Path(path).resolve(), Path(output).resolve()
    if not path.is_file():
        raise FileNotFoundError('Audio asset is missing')
    if path == output or path.is_relative_to(output):
        raise ValueError('Output must be separate from the original asset')
    if output.exists() and any(output.iterdir()):
        raise FileExistsError('Audio output already contains data; refusing to overwrite')
    source_sha = file_sha256(path)
    if auth['status'] == 'REFERENCE_TEST' and source_sha != REFERENCE_ZH_SHA256:
        raise PermissionError('REFERENCE_TEST is restricted to the existing official zh.wav sample')
    notify = progress or (lambda fraction, message: None)
    provider = 'simulated' if simulated else 'sherpa'
    model_dir = configured_path('SENSEVOICE_MODEL_DIR', 'models/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17')
    vad_path = configured_path('VAD_MODEL_PATH', 'models/silero_vad.onnx')
    paths = {'vad': vad_path}
    if not simulated:
        paths.update(asr=model_dir/'model.int8.onnx', tokens=model_dir/'tokens.txt')
    if any(not p.is_file() for p in paths.values()):
        raise CapabilityError('Existing SenseVoice/Silero files are required; no model download or substitution performed')
    hashes = {name: file_sha256(p) for name, p in paths.items()}
    notify(.1, '本地 Silero VAD / SenseVoice 转录')
    events, stats = analyze_audio(path, sid, aid, output, offset=offset,
                                  simulated=simulated, provider=provider)
    if file_sha256(path) != source_sha:
        raise ValueError('Original audio changed during processing')
    if any(file_sha256(p) != hashes[name] for name, p in paths.items()):
        raise ValueError('Audio model artifacts changed during processing')
    pid = uuid4().hex
    source_mode = 'SIMULATED' if simulated else 'REAL_RECORDING'
    origin = 'SIMULATED' if simulated else ('REAL_RECORDING_REFERENCE' if auth['status']=='REFERENCE_TEST' else 'USER_AUTHORIZED_RECORDING')
    method = 'SIMULATED' if simulated else 'MODEL_BASED'
    provenance = {'provenance_id': pid, 'recorded_at': datetime.now(timezone.utc).isoformat(),
        'source_mode': source_mode, 'input_origin': origin, 'processing_classification': method,
        'model_inference_executed': not simulated, 'asr_model_inference_executed': not simulated,
        'vad_model_inference_executed': True, 'provider': stats['provider'],
        'language': os.getenv('ASR_LANGUAGE','zh'), 'cpu_threads': max(1,int(os.getenv('CPU_THREADS','2'))),
        'device': 'cpu', 'model_artifacts': {name: {'name': p.name, 'sha256': hashes[name]} for name,p in paths.items()},
        'runtime_versions': {name: version(name) for name in ('sherpa-onnx','onnxruntime','numpy')},
        'source_sha256': source_sha, 'normalized_sha256': file_sha256(output/'normalized.wav'),
        'authorization': auth, 'research_scope': auth['scope'],
        'authorization_type': 'HUMAN_DECLARED' if auth['status']=='AUTHORIZED' else auth['status'],
        'retention_policy_enforced': False,
        'speaker_identity_verified': False, 'speaker_diarization': 'NOT_CONNECTED',
        'source_synchronization': 'INDEPENDENT_REFERENCE' if auth['status']=='REFERENCE_TEST' else 'NOT_VERIFIED',
        'word_alignment': 'NOT_CONNECTED', 'timestamp_basis': stats['timing'],
        'session_time_conversion': 'media_time + declared_offset_seconds',
        'model_license_source': 'https://github.com/modelscope/FunASR#license',
        'sample_specific_consumer_consent': 'NOT_PRESENT' if auth['status']=='REFERENCE_TEST' else 'USER_DECLARED',
        'reference_source': REFERENCE_SOURCE if auth['status']=='REFERENCE_TEST' else None,
        'reference_member': 'test_wavs/zh.wav' if auth['status']=='REFERENCE_TEST' else None}
    transcripts = []
    for event in events:
        tid = uuid4().hex
        event.metadata.update(transcript_id=tid, audio_provenance_id=pid, source_mode=source_mode,
            input_origin=origin, processing_classification=method, authorization_status=auth['status'],
            authorization_scope=auth['scope'], research_scope=auth['scope'],
            authorization_type='HUMAN_DECLARED' if auth['status']=='AUTHORIZED' else auth['status'],
            authorization_verification=auth['verification'], verification_status='NOT_VERIFIED',
            speaker_identity_verified=False, track_id=None)
        transcripts.append({'transcript_id':tid, 'event_id':event.event_id, 'session_id':sid, 'asset_id':aid,
            'raw_text':event.metadata['raw_text'], 'cleaned_text':event.description,
            'start':event.evidence['start'], 'end':event.evidence['end'],
            'timestamp':event.timestamp, 'end_timestamp':event.metadata['end_timestamp'],
            'offset_seconds':offset, 'confidence':event.confidence, 'speaker':None, 'track_id':None,
            'speaker_identity_verified':False, 'verification_status':'NOT_VERIFIED',
            'source_mode':source_mode, 'input_origin':origin, 'processing_classification':method,
            'research_scope':auth['scope'],
            'time_basis':'MEDIA_SECONDS_PLUS_DECLARED_SESSION_OFFSET', 'provenance_id':pid,
            'evidence_reference':{'asset_id':aid,'start':event.evidence['start'],'end':event.evidence['end']}})
    stats = {**stats, 'source_mode':source_mode, 'input_origin':origin, 'transcript_count':len(transcripts),
        'processing_classification':method, 'authorization_scope':auth['scope'], 'research_scope':auth['scope'],
        'vad_passes_in_reused_pipeline':1 if simulated else 2,
        'consumer_research_evidence':auth['status']=='AUTHORIZED', 'human_transcription_accuracy':'NOT_VERIFIED'}
    result = {'events':events, 'stats':stats, 'transcripts':transcripts, 'provenance':provenance}
    for name, data in [('transcripts.json',transcripts), ('vad.json',{'regions':stats['regions'],'method':stats['vad_method']}),
                       ('provenance.json',provenance), ('events.json',[e.model_dump() for e in events]), ('stats.json',stats)]:
        (output/name).write_text(json.dumps(data,ensure_ascii=False,indent=2,allow_nan=False),encoding='utf-8')
    notify(1, '原始转录与证据已保存；尚待人工复核')
    return result

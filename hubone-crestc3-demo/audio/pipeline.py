from pathlib import Path

from adapters.asr import get_asr
from audio.processing import normalize_audio,voice_regions
from backend.models import Event
from backend.provenance import labels


def transcript_events(sid, segments, offset=0.0, aid=None, simulated=False, origin='manual_text', timing='provided'):
    events=[]
    for segment in segments:
        raw=segment.text
        cleaned=' '.join(raw.split())
        events.append(Event(session_id=sid,timestamp=offset+segment.start,
            event_type='utterance',source='manual' if origin=='manual_text' else 'audio',
            description=cleaned,confidence=segment.confidence,
            evidence={'asset_id':aid,'quote':raw,'start':segment.start,'end':segment.end},
            metadata={'end_timestamp':offset+segment.end,'speaker':segment.speaker,
                'speaker_status':'user_provided' if origin=='manual_text' and segment.speaker else 'unknown',
                'raw_text':raw,'cleaned_text':cleaned,'origin':origin,'timing':timing,
                **labels(simulated,'MANUAL' if origin=='manual_text' else (
                    'SIMULATED' if origin.startswith('SIMULATED/') else 'REAL_MODEL')),
                'offset_seconds':offset}))
    return events


def analyze_audio(path: Path,sid,aid,work: Path,offset=0.0,simulated=False,provider=None):
    work.mkdir(parents=True,exist_ok=True)
    normalized=work/'normalized.wav'
    samples,duration=normalize_audio(path,normalized)
    regions,vad_method=voice_regions(samples)
    # The fixture hash is checked on the original input, not on a re-encoded copy.
    adapter=get_asr(provider)
    segments,meta=adapter.transcribe(path if provider=='simulated' else normalized,duration)
    if not segments:
        raise ValueError('未识别到语音；未产生转录事件。')
    if any(s.end>duration+0.5 for s in segments):
        raise ValueError('转录时间戳超出音频长度。')
    events=transcript_events(sid,segments,offset,aid,simulated or meta.get('simulated',False),
                             origin=meta['provider'],timing=meta['timing'])
    for event in events:
        event.metadata['speaker_status']=meta['speaker_diarization']
    return events,{'duration_seconds':duration,'regions':regions,'vad_method':vad_method,
                   'segments':len(segments),**meta}

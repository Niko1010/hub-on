from pathlib import Path
from typing import Protocol
import os
import json
import hashlib

import httpx

from backend.config import ROOT, configured_path, CapabilityError
from backend.models import Segment


class ASRAdapter(Protocol):
    def transcribe(self, path: Path, duration: float) -> tuple[list[Segment], dict]: ...


class SenseVoiceASR:
    def transcribe(self,path,duration):
        import re
        import wave
        import numpy as np
        from audio.processing import voice_regions
        model_dir=configured_path('SENSEVOICE_MODEL_DIR','models/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17')
        if not (model_dir/'model.int8.onnx').is_file():
            raise CapabilityError('SenseVoice 模型缺失。运行 python scripts/download_models.py，或使用手动文本。')
        import sherpa_onnx
        with wave.open(str(path),'rb') as f:
            samples=np.frombuffer(f.readframes(f.getnframes()),np.int16).astype(np.float32)/32768
        regions,method=voice_regions(samples)
        recognizer=sherpa_onnx.OfflineRecognizer.from_sense_voice(
            model=str(model_dir/'model.int8.onnx'),tokens=str(model_dir/'tokens.txt'),
            num_threads=max(1,int(os.getenv('CPU_THREADS','2'))),language=os.getenv('ASR_LANGUAGE','zh'),use_itn=True)
        segments=[]
        # Bound segments to protect CPU memory on long continuous speech.
        bounded=[]
        for region in regions:
            a=region['start']
            while a<region['end']:
                b=min(region['end'],a+20)
                # VAD onset can lag soft initial syllables; retain pre-roll.
                bounded.append((max(0,a-.65),min(duration,b+.25)))
                a=b
        for start,end in bounded:
            stream=recognizer.create_stream()
            stream.accept_waveform(16000,samples[int(start*16000):int(end*16000)])
            recognizer.decode_stream(stream)
            text=re.sub(r'<\|[^|]+\|>','',stream.result.text).strip()
            if text:
                segments.append(Segment(start=round(start,3),end=round(end,3),text=text))
        return segments,{'provider':'sherpa-onnx/SenseVoice-int8-cpu','speaker_diarization':'unavailable',
                         'timing':'vad_regions' if method=='silero_onnx_seeed' else 'approximate_energy_regions',
                         'segmentation':method,'warning':'段级时间戳来自分段边界，不是逐字对齐。'}


class FasterWhisperASR:
    def transcribe(self, path, duration):
        model_path = configured_path('ASR_MODEL_PATH','models/faster-whisper-tiny')
        if not (model_path/'model.bin').is_file():
            raise CapabilityError('本地 ASR 模型缺失；按 README 下载 faster-whisper 模型，或使用文本输入。')
        try:
            from faster_whisper import WhisperModel
        except ImportError as e:
            raise CapabilityError('安装 requirements-asr.txt 后重试。') from e
        model = WhisperModel(str(model_path),device='cpu',compute_type='int8',
                             cpu_threads=max(1,int(os.getenv('CPU_THREADS','2'))),local_files_only=True)
        parts, info = model.transcribe(str(path),language=os.getenv('ASR_LANGUAGE','zh'),
                                       beam_size=3, vad_filter=False)
        segments = [Segment(start=p.start,end=p.end,text=p.text.strip()) for p in parts if p.text.strip()]
        return segments, {'provider':'faster-whisper/cpu-int8','language':info.language,
                          'speaker_diarization':'unavailable','timing':'model_segments'}


class RemoteASR:
    def __init__(self, qwen=False):
        self.qwen=qwen

    def transcribe(self,path,duration):
        if self.qwen:
            url=os.getenv('QWEN_ASR_URL','http://127.0.0.1:8001').rstrip('/')+'/asr'
            data={}
            params={'language':os.getenv('ASR_LANGUAGE','zh')}
            headers={}
        else:
            key=os.getenv('ASR_API_KEY') or os.getenv('OPENAI_API_KEY')
            if not key:
                raise CapabilityError('缺少 ASR_API_KEY；可使用本地 ASR 或手动转录文本。')
            url=os.getenv('ASR_BASE_URL','https://api.openai.com/v1').rstrip('/')+'/audio/transcriptions'
            headers={'Authorization':f'Bearer {key}'}
            data={'model':os.getenv('ASR_MODEL','whisper-1'), 'response_format':'verbose_json',
                  'language':os.getenv('ASR_LANGUAGE','zh')}
            params={}
        # Use normal injected proxies and CA trust; do not log keys or response bodies.
        with path.open('rb') as f, httpx.Client(timeout=120) as client:
            response=client.post(url,headers=headers,data=data,params=params,
                                 files={'file':(path.name,f,'audio/wav')})
        response.raise_for_status()
        result=response.json()
        segments=result.get('segments')
        if segments:
            out=[Segment(start=float(p['start']),end=float(p['end']),text=p['text'],
                         speaker=str(p['speaker']) if p.get('speaker') is not None else None) for p in segments if p.get('text','').strip()]
            timing='model_segments'
        else:
            text=result.get('text','').strip()
            out=[Segment(start=0,end=duration,text=text)] if text else []
            timing='whole_clip_only'
        return out,{'provider':'qwen3-asr/http' if self.qwen else 'openai-compatible/asr',
                    'speaker_diarization':'provider_labels_only' if any(s.speaker for s in out) else 'unavailable',
                    'timing':timing}


class SimulatedASR:
    """Fixture transcript, ONLY for the SHA-256 matched bundled audio."""
    def transcribe(self,path,duration):
        manifest=json.loads((ROOT/'sample_data/manifest.json').read_text(encoding='utf-8'))
        if hashlib.sha256(path.read_bytes()).hexdigest() != manifest['audio_sha256']:
            raise ValueError('SIMULATED 转录仅支持内置样例音频，禁止用于用户上传音频。')
        data=json.loads((ROOT/'sample_data/transcript.json').read_text(encoding='utf-8'))
        return [Segment(**p) for p in data['segments']], {
            'provider':'SIMULATED/fixture-sidecar','simulated':True,
            'speaker_diarization':'scripted_labels_not_diarization', 'timing':'scripted',
            'warning':'这些原话来自预设脚本，不是 ASR 模型识别结果。'}


def get_asr(provider: str | None = None) -> ASRAdapter:
    name=provider or os.getenv('ASR_PROVIDER','sherpa')
    if name=='sherpa':
        return SenseVoiceASR()
    if name=='faster-whisper':
        return FasterWhisperASR()
    if name in ('openai','qwen'):
        return RemoteASR(qwen=name=='qwen')
    if name=='simulated':
        return SimulatedASR()
    raise CapabilityError('未配置语音识别。请选择本地/远端 ASR，或使用带时间戳文本输入。')

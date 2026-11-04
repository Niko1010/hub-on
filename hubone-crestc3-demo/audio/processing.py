from pathlib import Path
import shutil
import subprocess
import json
import wave
import numpy as np

from backend.config import configured_path, CapabilityError


def normalize_audio(source: Path, target: Path):
    if not shutil.which('ffmpeg'):
        raise CapabilityError('需要 ffmpeg 才能读取 WAV/MP3/WebM 并统一到 16kHz。')
    if shutil.which('ffprobe'):
        probe=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration',
                              '-of','json',str(source)],capture_output=True,timeout=20)
        if probe.returncode==0:
            value=json.loads(probe.stdout).get('format',{}).get('duration')
            if value and float(value)>600:
                raise ValueError('Demo 音频限 10 分钟，请先裁剪；不会静默截断。')
    result = subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',
        '-i',str(source),'-vn','-ac','1','-ar','16000','-t','600','-c:a','pcm_s16le',str(target)],
        capture_output=True, timeout=90)
    if result.returncode:
        # Do not expose full file paths or ffmpeg diagnostics in API responses.
        raise ValueError('音频无法解码，请上传有效 WAV、MP3、M4A 或 WebM。')
    with wave.open(str(target),'rb') as wav:
        duration = wav.getnframes()/wav.getframerate()
        samples = np.frombuffer(wav.readframes(wav.getnframes()),np.int16).astype(np.float32)/32768
    if duration <= 0:
        raise ValueError('音频为空。')
    if duration >= 600:
        raise ValueError('音频达到 10 分钟上限，请先裁剪；不会将截断结果作为完整输入。')
    return samples, duration


def voice_regions(samples: np.ndarray):
    model = configured_path('VAD_MODEL_PATH','models/silero_vad.onnx')
    if model.is_file():
        from audio.seeed_vad import StreamingVad
        vad = StreamingVad(str(model))
        regions = []
        total = (len(samples)+511)//512
        for i in range(total):
            chunk = samples[i*512:(i+1)*512]
            chunk = np.pad(chunk,(0,512-len(chunk)))
            regions.extend(vad.process_window(i,vad.prob(chunk)))
        regions.extend(vad.flush(total))
        return [{'start':max(0,a),'end':min(len(samples)/16000,b)} for a,b in regions], 'silero_onnx_seeed'
    # Energy activity is not a speech detector. Keep that distinction in output.
    regions = []
    active = None
    for i in range(0,len(samples),1600):
        rms = float(np.sqrt(np.mean(samples[i:i+1600]**2)))
        t = i/16000
        if rms > 0.012 and active is None:
            active = t
        if rms <= 0.012 and active is not None:
            if t-active >= 0.2:
                regions.append({'start':round(active,2),'end':round(t,2)})
            active = None
    if active is not None:
        regions.append({'start':round(active,2),'end':len(samples)/16000})
    return regions,'energy_activity_not_speech_vad'

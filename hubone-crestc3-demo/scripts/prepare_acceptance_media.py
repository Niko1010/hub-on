"""Prepare real recorded reference media. No TTS, animation or fixture transcript."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import urllib.request

ROOT=Path(__file__).resolve().parents[1]
SEEED_COMMIT='d636e7dda68da31800252db906e8f703f6fb2cf2'
VIDEO_SHA='e8e7c64cc9888a1c74569aee02d94e7922c76aece392f948b22855363ce3800a'
MODEL_DIR='sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--upstream-root',type=Path,default=Path('/workspace/upstream'))
    args=parser.parse_args()
    out=ROOT/'sample_data/acceptance';out.mkdir(parents=True,exist_ok=True)
    original=args.upstream_root/'Lab-Prooject-RK/demos/multi-camera-shelf/input/demo.mp4'
    url=f'https://raw.githubusercontent.com/Seeed-Projects/Lab-Prooject-RK/{SEEED_COMMIT}/demos/multi-camera-shelf/input/demo.mp4'
    if not original.is_file():
        original=ROOT/'models/acceptance-original.mp4'
        if not original.is_file():
            with urllib.request.urlopen(url,timeout=120) as r,original.open('wb') as f:
                shutil.copyfileobj(r,f)
    if sha(original)!=VIDEO_SHA:
        raise RuntimeError('Real video source checksum mismatch')
    audio=ROOT/'models'/MODEL_DIR/'test_wavs/zh.wav'
    if not audio.is_file():
        raise SystemExit('Run scripts/download_models.py to obtain the verified official model archive and test WAV first.')
    # Real camera footage: trim and normalize only; do not synthesize motion.
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(original),
                    '-t','8','-an','-vf','scale=360:640','-r','15','-c:v','libx264',
                    '-pix_fmt','yuv420p','-movflags','+faststart',str(out/'real-video.mp4')],check=True)
    shutil.copyfile(audio,out/'real-speech.wav')
    manifest={'input_origin':'REAL_RECORDING_REFERENCE','simulated':False,
        'originally_synchronous':False,
        'notice':'真实参考录像和真人语音来自独立公开样例；非同一人、非同一次采集、非 Crest C3 体验。',
        'video_source':url,'video_source_sha256':VIDEO_SHA,
        'audio_source':f'https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/{MODEL_DIR}.tar.bz2',
        'audio_member':'test_wavs/zh.wav','audio_source_type':'official recorded Mandarin speech sample, not generated TTS',
        'files':[{'kind':kind,'name':name,'sha256':sha(out/name)} for kind,name in
                 [('video','real-video.mp4'),('audio','real-speech.wav')]]}
    (out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(manifest,ensure_ascii=False,indent=2))


if __name__=='__main__':
    main()

"""Create SYNTHETIC Chinese speech and a reference-photo video, clearly labeled."""
from pathlib import Path
import sys
import hashlib
import json
import shutil
import subprocess
import wave

import cv2
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))


def preserved_reference_bundle(sample):
    manifest=sample/'manifest.json'
    if not manifest.is_file(): return None
    data=json.loads(manifest.read_text(encoding='utf-8'))
    if data.get('video_input_origin')!='REAL_RECORDING_REFERENCE': return None
    for kind,name in [('video','video.mp4'),('audio','audio.wav')]:
        path=sample/name
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest()!=data.get(kind+'_sha256'):
            raise RuntimeError('参考演示素材缺失或校验失败；停止生成，避免覆盖已有资料。')
    if not all((sample/name).is_file() for name in ('transcript.json','scenario.json')):
        raise RuntimeError('演示脚本缺失；请恢复完整素材包，不自动改用参考照片。')
    return data


def main():
    sample=ROOT/'sample_data'
    if preserved_reference_bundle(sample):
        print('Verified bundled Crest C3 reference video and SIMULATED speech; existing media preserved.')
        return
    import sherpa_onnx
    model=ROOT/'models/melo/vits-melo-tts-zh_en'
    if not (model/'model.onnx').is_file() or not (sample/'reference.jpg').is_file():
        raise SystemExit('Run python scripts/download_models.py first.')
    config=sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
        vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=str(model/'model.onnx'),
            lexicon=str(model/'lexicon.txt'),tokens=str(model/'tokens.txt'),dict_dir=str(model/'dict'),
            noise_scale=0.0,noise_scale_w=0.0),
        num_threads=2),rule_fsts=str(model/'phone.fst')+','+str(model/'number.fst')+','+str(model/'date.fst'))
    tts=sherpa_onnx.OfflineTts(config)
    texts=['穿起来还可以，但是腰部有点紧。','上坡的时候感觉助力还不错。',
           '走久了之后感觉有一点重。','腰部固定带有点勒，希望能够再松一点。']
    sr=tts.sample_rate
    chunks=[]
    segments=[]
    cursor=0
    for i,text in enumerate(texts):
        pause=5 if i==0 else 2.5
        chunks.append(np.zeros(round(pause*sr),np.float32));cursor+=pause
        result=tts.generate(text,sid=0,speed=1.0)
        if result.sample_rate!=sr:
            raise RuntimeError('Unexpected sample rate')
        speech=np.array(result.samples,np.float32)
        start=cursor;cursor+=len(speech)/sr
        segments.append({'start':round(start,3),'end':round(cursor,3),'text':text,'speaker':'SCRIPTED_P01'})
        chunks.append(speech)
    chunks.append(np.zeros(sr,np.float32));cursor+=1
    pcm=(np.clip(np.concatenate(chunks),-1,1)*32767).astype(np.int16)
    with wave.open(str(sample/'audio.wav'),'wb') as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes(pcm.tobytes())
    (sample/'transcript.json').write_text(json.dumps({'label':'SIMULATED',
        'notice':'TTS 脚本；fixture 模式时使用，不是模型转录。','segments':segments},ensure_ascii=False,indent=2),encoding='utf-8')
    # A public detector reference photo, gently panned to exercise tracking.
    # It is NOT footage of a Crest C3 user; no proprietary actions are inferred.
    image=cv2.imread(str(sample/'reference.jpg'))
    width,height=640,480
    base=cv2.resize(image,(width,height))
    temporary=sample/'video-tmp.mp4'
    writer=cv2.VideoWriter(str(temporary),cv2.VideoWriter_fourcc(*'mp4v'),15,(width,height))
    if not writer.isOpened():
        raise RuntimeError('OpenCV could not create sample MP4')
    for index in range(round(cursor*15)):
        dx=int(12*np.sin(index/90))
        frame=cv2.warpAffine(base,np.float32([[1,0,dx],[0,1,0]]),(width,height),borderMode=cv2.BORDER_REFLECT)
        cv2.rectangle(frame,(0,0),(width,49),(15,43,29),-1)
        cv2.putText(frame,'SIMULATED | REFERENCE PHOTO PAN - NOT CREST C3 FOOTAGE',
                    (12,20),cv2.FONT_HERSHEY_SIMPLEX,.44,(210,240,190),1)
        cv2.putText(frame,f'CPU MODEL TEST INPUT | t={index/15:.1f}s',
                    (12,40),cv2.FONT_HERSHEY_SIMPLEX,.4,(180,208,167),1)
        writer.write(frame)
    writer.release()
    if not shutil.which('ffmpeg'):
        raise RuntimeError('ffmpeg is required for browser-compatible H.264 sample video')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(temporary),
                    '-c:v','libx264','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart',
                    str(sample/'video.mp4')],check=True)
    temporary.unlink()
    # These are scripted researcher annotations, never vision predictions.
    scenario=[(1,'zone_enter','进入体验区（预设人工情境）'),
              (2,'wearing_started','开始穿戴（预设人工情境）'),
              (4,'wearing_complete','穿戴完成（预设人工情境）'),
              (5,'walking_started','开始行走（预设人工情境）'),
              (segments[0]['end'],'strap_adjustment','调整腰部固定带（预设人工情境）'),
              (segments[1]['start'],'uphill_trial','体验上坡（预设人工情境）'),
              (segments[2]['end'],'walking_stopped','停止行走（预设人工情境）'),
              (cursor-0.5,'experience_complete','完成体验（预设人工情境）')]
    (sample/'scenario.json').write_text(json.dumps([{'timestamp':round(t,3),'event_type':kind,
        'description':text} for t,kind,text in scenario],ensure_ascii=False,indent=2),encoding='utf-8')
    manifest={'label':'SIMULATED','duration_seconds':cursor,
        'audio':'CPU VITS 合成中文语音，非真实消费者录音。',
        'video':'Ultralytics bus.jpg 参考图平移生成的视频；非真实 Crest C3 体验录像。',
        'scenario':'所有专属体验行为仅来自明确标记的预设人工标注。',
        'audio_sha256':hashlib.sha256((sample/'audio.wav').read_bytes()).hexdigest(),
        'video_sha256':hashlib.sha256((sample/'video.mp4').read_bytes()).hexdigest(),
        'reference_url':'https://github.com/ultralytics/assets/blob/main/im/bus.jpg'}
    (sample/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'label':'SIMULATED','duration':round(cursor,2),'segments':len(segments)},ensure_ascii=False))


if __name__=='__main__':
    main()

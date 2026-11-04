import json
from pathlib import Path
import wave

import httpx
import numpy as np
import pytest

from backend.config import ROOT,CapabilityError
from adapters.asr import SimulatedASR,RemoteASR,get_asr
from audio.seeed_vad import StreamingVad


def test_fixture_hash_guard(tmp_path):
    bad=tmp_path/'arbitrary.wav';bad.write_bytes(b'not the fixture')
    with pytest.raises(ValueError,match='SIMULATED'):
        SimulatedASR().transcribe(bad,10)


def test_no_asr_is_explicit_error():
    with pytest.raises(CapabilityError):
        get_asr('none')


def test_seeed_vad_flushes_final_speech_and_discards_short_noise():
    # Exercise the reused state machine without requiring the ONNX model.
    vad=StreamingVad.__new__(StreamingVad)
    vad.win_s=.032;vad.threshold=.5;vad.min_silence_w=2;vad.min_speech_w=3
    vad.max_speech_w=100;vad.in_speech=False;vad.cur_start_w=0;vad.speech_w=0;vad.silence_w=0
    for i in range(4):assert vad.process_window(i,.9)==[]
    assert vad.flush(4)==[(0,.128)]
    vad.in_speech=False
    assert vad.process_window(5,.9)==[]
    assert vad.process_window(6,.1)==[]
    assert vad.process_window(7,.1)==[]


def test_remote_asr_contract_and_unknown_timing(monkeypatch,tmp_path):
    monkeypatch.setenv('ASR_API_KEY','test-not-a-real-key')
    path=tmp_path/'a.wav';path.write_bytes(b'test')
    seen=[]
    def handle(request):
        seen.append(request)
        assert request.url.path.endswith('/audio/transcriptions')
        assert b'name="file"' in request.read()
        return httpx.Response(200,json={'text':'腰部有点紧。'})
    real_client=httpx.Client
    monkeypatch.setattr('adapters.asr.httpx.Client',lambda **kw:real_client(transport=httpx.MockTransport(handle)))
    segments,meta=RemoteASR().transcribe(path,12)
    assert segments[0].start==0 and segments[0].end==12
    assert meta['timing']=='whole_clip_only' and meta['speaker_diarization']=='unavailable'
    assert len(seen)==1


def test_llm_http_adapter_uses_evidence_and_validates_response(monkeypatch):
    from adapters.llm import generate_insights
    event={'event_id':'e1','timestamp':1,'source':'manual','event_type':'utterance','description':'腰部有点紧。'}
    monkeypatch.setenv('LLM_API_KEY','test-not-a-real-key')
    def handle(request):
        data=json.loads(request.read())
        assert request.url.path.endswith('/chat/completions')
        assert 'e1' in data['messages'][1]['content']
        assert data['response_format']=={'type':'json_object'}
        return httpx.Response(200,json={'choices':[{'message':{'content':json.dumps({
            'summary':'待验证研究假设','insights':[{'title':'腰部舒适度','finding':'一条腰部紧的主观反馈。',
                'priority':'P2','evidence_ids':['e1'],'recommendation':'比较腰带设置',
                'next_experiment':'同人交叉测试松紧档位'}]})}}]})
    real=httpx.Client
    monkeypatch.setattr('adapters.providers.httpx.Client',lambda **kw:real(transport=httpx.MockTransport(handle)))
    result=generate_insights([event],'Crest C3')
    assert result['insights'][0]['evidence_ids']==['e1']


@pytest.mark.integration
def test_real_cpu_models_on_generated_inputs(tmp_path):
    from audio.pipeline import analyze_audio
    from vision.pipeline import analyze_video
    import cv2
    # 2 seconds of the bundled reference-photo video keeps regression fast.
    cap=cv2.VideoCapture(str(ROOT/'sample_data/video.mp4'))
    writer=cv2.VideoWriter(str(tmp_path/'short.mp4'),cv2.VideoWriter_fourcc(*'mp4v'),15,(640,480))
    for _ in range(30):
        ok,frame=cap.read()
        assert ok
        writer.write(frame)
    cap.release();writer.release()
    events,stats=analyze_video(tmp_path/'short.mp4','test','v',tmp_path/'frames',offset=10,simulated=True)
    assert stats['sampled_frames']>=3 and stats['person_observations']>0 and stats['poses_found']>0
    assert all(e.timestamp>=10 for e in events)
    assert not any(e.event_type in ('strap_adjustment','wearing_complete','uphill_trial') for e in events)
    audio_events,stats=analyze_audio(ROOT/'sample_data/audio.wav','test','a',tmp_path/'audio',
                                  offset=4,simulated=True,provider='sherpa')
    assert len(audio_events)>=3 and stats['provider']=='sherpa-onnx/SenseVoice-int8-cpu'
    assert all(e.source=='audio' and e.timestamp>=4 and e.metadata['speaker'] is None for e in audio_events)
    text=''.join(e.description for e in audio_events)
    assert '腰' in text and '重' in text

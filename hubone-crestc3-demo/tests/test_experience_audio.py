import json
from pathlib import Path

import pytest

from audio import experience
from audio.pipeline import transcript_events
from backend.models import Segment


def authorized():
    return {'status':'AUTHORIZED','scope':'CONSUMER_RESEARCH','notice_provided':True,
            'basis':'Participant consent declared for this test',
            'research_purpose':'Local transcription review','retention_days':7,'access_scope':'LOCAL_ONLY'}


@pytest.fixture
def local_pipeline(tmp_path,monkeypatch):
    models=tmp_path/'models';models.mkdir()
    for name in ('model.int8.onnx','tokens.txt','silero_vad.onnx'):
        (models/name).write_bytes(('mock test '+name).encode())
    monkeypatch.setattr(experience,'configured_path',lambda key,default: models/'silero_vad.onnx' if key=='VAD_MODEL_PATH' else models)
    monkeypatch.setattr(experience,'version',lambda name:'test-version')
    source=tmp_path/'input.wav';source.write_bytes(b'unit-test source, not real audio')
    calls=[]
    def analyze(path,sid,aid,work,offset,simulated,provider):
        calls.append({'provider':provider,'simulated':simulated,'source':path})
        Path(work).mkdir()
        (Path(work)/'normalized.wav').write_bytes(b'unit-test normalized audio')
        events=transcript_events(sid,[Segment(start=.2,end=1.5,text='  原始原话  ')],offset,aid,
            simulated,origin='SIMULATED/fixture-sidecar' if simulated else 'sherpa-onnx/SenseVoice-int8-cpu',timing='scripted' if simulated else 'vad_regions')
        return events,{'provider':'SIMULATED/fixture-sidecar' if simulated else 'sherpa-onnx/SenseVoice-int8-cpu',
                      'regions':[{'start':.2,'end':1.5}],'vad_method':'silero_onnx_seeed',
                      'timing':'scripted' if simulated else 'vad_regions','segments':1,'duration_seconds':2.0}
    monkeypatch.setattr(experience,'analyze_audio',analyze)
    return source,calls


@pytest.mark.parametrize('auth',[None,{}, {'status':'UNKNOWN'}, {'status':'DENIED'},
    {**authorized(),'notice_provided':False}, {**authorized(),'research_purpose':''},
    {**authorized(),'access_scope':'PUBLIC'}])
def test_missing_or_invalid_authorization_never_starts_processing(local_pipeline,tmp_path,auth):
    source,calls=local_pipeline
    output=tmp_path/'result'
    with pytest.raises(PermissionError):
        experience.analyze_experience_audio(source,'sid','aid',output,authorization=auth)
    assert calls==[] and not output.exists()


def test_reference_label_cannot_bypass_consumer_audio_authorization(local_pipeline,tmp_path):
    source,calls=local_pipeline
    auth={**authorized(),'status':'REFERENCE_TEST','scope':'REFERENCE_TECHNICAL_TEST','notice_provided':None}
    with pytest.raises(PermissionError,match='official zh.wav'):
        experience.analyze_experience_audio(source,'sid','aid',tmp_path/'result',authorization=auth)
    assert not calls


def test_local_asr_reuses_pipeline_and_preserves_quote_and_time_basis(local_pipeline,tmp_path,monkeypatch):
    source,calls=local_pipeline
    monkeypatch.setenv('ASR_PROVIDER','openai')
    result=experience.analyze_experience_audio(source,'sid','aid',tmp_path/'result',offset=3,authorization=authorized())
    assert calls==[{'provider':'sherpa','simulated':False,'source':source}]
    transcript=result['transcripts'][0];event=result['events'][0]
    assert transcript['raw_text']=='  原始原话  ' and transcript['cleaned_text']=='原始原话'
    assert transcript['timestamp']==3.2 and transcript['end_timestamp']==4.5
    assert transcript['start']==.2 and transcript['end']==1.5
    assert transcript['confidence'] is None and transcript['speaker'] is None and transcript['track_id'] is None
    assert transcript['verification_status']=='NOT_VERIFIED'
    assert transcript['source_mode']=='REAL_RECORDING' and transcript['processing_classification']=='MODEL_BASED'
    assert event.metadata['processing_method']=='REAL_MODEL'  # Legacy compatibility.
    assert event.metadata['authorization_type']=='HUMAN_DECLARED'
    assert event.metadata['authorization_verification']=='USER_DECLARED_NOT_INDEPENDENTLY_VERIFIED'
    assert event.metadata['research_scope']=='CONSUMER_RESEARCH'
    assert result['provenance']['asr_model_inference_executed'] is True
    assert len(result['provenance']['model_artifacts'])==3
    assert json.loads((tmp_path/'result/transcripts.json').read_text(encoding='utf-8'))[0]==transcript
    assert result['stats']['consumer_research_evidence'] is True


def test_reference_is_independent_and_never_consumer_product_evidence(local_pipeline,tmp_path,monkeypatch):
    source,_=local_pipeline
    monkeypatch.setattr(experience,'REFERENCE_ZH_SHA256',experience.file_sha256(source))
    auth={**authorized(),'status':'REFERENCE_TEST','scope':'REFERENCE_TECHNICAL_TEST','notice_provided':None}
    result=experience.analyze_experience_audio(source,'sid','aid',tmp_path/'result',authorization=auth)
    assert result['stats']['consumer_research_evidence'] is False
    assert result['provenance']['source_synchronization']=='INDEPENDENT_REFERENCE'
    assert result['transcripts'][0]['input_origin']=='REAL_RECORDING_REFERENCE'
    assert result['provenance']['sample_specific_consumer_consent']=='NOT_PRESENT'
    assert result['events'][0].metadata['research_scope']=='REFERENCE_TECHNICAL_TEST'
    assert result['events'][0].metadata['source_mode']=='REAL_RECORDING'
    assert result['transcripts'][0]['research_scope']=='REFERENCE_TECHNICAL_TEST'


def test_simulated_fixture_is_never_claimed_as_real_asr(local_pipeline,tmp_path):
    source,calls=local_pipeline
    result=experience.analyze_experience_audio(source,'sid','aid',tmp_path/'result',simulated=True)
    assert calls[0]['provider']=='simulated'
    assert result['provenance']['asr_model_inference_executed'] is False
    assert result['provenance']['vad_model_inference_executed'] is True
    assert result['transcripts'][0]['source_mode']=='SIMULATED'
    assert result['transcripts'][0]['processing_classification']=='SIMULATED'
    assert result['provenance']['timestamp_basis']=='scripted'


def test_existing_output_is_not_overwritten(local_pipeline,tmp_path):
    source,calls=local_pipeline
    output=tmp_path/'result';output.mkdir();(output/'keep.txt').write_text('keep')
    with pytest.raises(FileExistsError):
        experience.analyze_experience_audio(source,'sid','aid',output,authorization=authorized())
    assert not calls and (output/'keep.txt').read_text()=='keep'


def test_no_recognized_speech_does_not_create_a_fabricated_transcript(local_pipeline,tmp_path,monkeypatch):
    source,_=local_pipeline
    def fail(*args,**kwargs):raise ValueError('未识别到语音；未产生转录事件。')
    monkeypatch.setattr(experience,'analyze_audio',fail)
    with pytest.raises(ValueError,match='未识别到语音'):
        experience.analyze_experience_audio(source,'sid','aid',tmp_path/'result',authorization=authorized())
    assert not (tmp_path/'result/transcripts.json').exists()

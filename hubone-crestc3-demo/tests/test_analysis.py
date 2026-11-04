import pytest

from analysis.feedback import polarity,analyze_feedback,correlate
from analysis.report import build_report
from audio.pipeline import transcript_events
from backend.models import Segment,Session,Event
from adapters.llm import validate_result


@pytest.mark.parametrize('text,expected',[
    ('穿起来还可以，但是腰部有点紧。','mixed'), ('上坡的时候感觉助力还不错。','positive'),
    ('走久了之后感觉有一点重。','negative'), ('腰带不紧，不觉得重。','positive'),
    ('穿脱不方便。','negative'), ('今天试穿。','neutral'),
])
def test_sentiment_and_negation(text,expected):
    assert polarity(text)==expected


def observations():
    segments=[Segment(start=5,end=8,text='穿起来还可以，但是腰部有点紧。'),
              Segment(start=10,end=13,text='上坡的时候感觉助力还不错。'),
              Segment(start=15,end=18,text='走久了之后感觉有一点重。'),
              Segment(start=20,end=23,text='腰部固定带有点勒。')]
    return [e.model_dump() for e in transcript_events('s',segments,simulated=True)]


def test_mixed_clause_keeps_verbatim_and_clusters_by_aspect():
    events=observations()
    f=analyze_feedback(events)
    assert f['utterance_count']==4
    assert f['sentiments']['negative']==3 and f['sentiments']['positive']==2
    waist=next(c for c in f['clusters'] if c['topic']=='腰部舒适与固定')
    assert waist['utterance_count']==2 and waist['negative_count']==2
    assert f['feedback'][0]['quote']==events[0]['evidence']['quote']
    assert next(k for k in f['keywords'] if k['word']=='腰部')['count']==2


def test_multimodal_offset_links_only_neighboring_events():
    events=observations()
    video=Event(session_id='s',timestamp=7,source='video',event_type='stationary',description='静止').model_dump()
    distant=Event(session_id='s',timestamp=40,source='video',event_type='stationary',description='静止').model_dump()
    links=correlate(events+[video,distant])
    assert links[0]['video_event_ids']==[video['event_id']]
    assert links[0]['speaker_identity_verified'] is False
    assert all(distant['event_id'] not in l['video_event_ids'] for l in links)
    events[0]['metadata']['timing']='whole_clip_only'
    assert len(correlate(events+[video]))==3


def test_report_evidence_and_simulated_watermark():
    events=observations()
    report=build_report(Session(session_id='s').model_dump(),events)
    assert report['simulated'] and 'SIMULATED' in report['markdown']
    assert '未调用大模型' in report['engine']
    assert any(i['priority']=='P1' for i in report['insights'])
    for insight in report['insights']:
        assert set(insight['evidence_ids'])<=report['evidence'].keys()
        assert insight['status']=='hypothesis'


def test_llm_rejects_invented_evidence_and_confirmed_claim_status():
    events=observations()
    insight={'title':'舒适度','finding':'受访者反馈腰部紧。','priority':'P2',
             'evidence_ids':[events[0]['event_id']],'recommendation':'调整腰带','next_experiment':'对比测试'}
    assert validate_result({'summary':'待验证','insights':[insight]},events)['insights'][0]['status']=='hypothesis'
    insight['evidence_ids']=['invented']
    with pytest.raises(ValueError):
        validate_result({'summary':'待验证','insights':[insight]},events)
    insight['evidence_ids']=[events[0]['event_id']]
    insight['status']='confirmed'
    with pytest.raises(ValueError):
        validate_result({'summary':'待验证','insights':[insight]},events)


def test_missing_llm_key_is_not_report_success(client,sid,monkeypatch):
    from tests.conftest import wait_job
    monkeypatch.delenv('LLM_API_KEY',raising=False)
    monkeypatch.delenv('OPENAI_API_KEY',raising=False)
    client.post(f'/api/sessions/{sid}/transcripts',json={'segments':[{'start':0,'end':2,'text':'有点重'}]})
    job=client.post(f'/api/sessions/{sid}/analyze',json={'provider':'llm'}).json()
    assert wait_job(client,sid,job['job_id'])['error_type']=='capability_missing'
    assert client.get(f'/api/sessions/{sid}/report').status_code==409

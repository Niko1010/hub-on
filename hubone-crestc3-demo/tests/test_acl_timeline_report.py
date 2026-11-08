"""Synthetic report snapshot tests; no consumer data or model calls."""
from experience.acl import preliminary, overview
from experience.core import load_source, SourceRef
from experience.research import current_research_fingerprint, run_research
from tests.test_experience_api import api, url
from tests.test_acl_backend import acl_session, source, authorize, fake_deepseek, no_network


def seeded(api):
    sid=acl_session(api); source(api,sid); authorize(api,sid)
    doc=load_source(api.store,sid,SourceRef(kind='live'))
    fingerprint=current_research_fingerprint(api.store,api.records,sid)
    response=api.client.post(url(sid,'acl/timeline/import'),json={
        'import_key':'test-visual-review','source_fingerprint':doc['fingerprint'],
        'review_reference':'TEST ONLY; no real visual review',
        'groups':[{'group_id':'wear','stage_id':'wear','label':'Synthetic wear candidate',
            'candidate_start':.4,'candidate_end':1.2,
            'segments':[{'segment_id':'wear-1','label':'Fixture fragment','candidate_start':.4,
                'candidate_end':1.2,'observation_ids':[doc['frames'][1]['observation_id'],doc['frames'][3]['observation_id']]}]}]})
    assert response.status_code==201,response.text
    assert current_research_fingerprint(api.store,api.records,sid)!=fingerprint
    return sid,doc


def test_report_keeps_candidates_separate_and_review_invalidates_snapshot(api):
    sid,doc=seeded(api)
    report=run_research(api.store,api.records,sid,provider='rules')
    timeline=report['acl_visual_timeline']; segment=timeline['groups'][0]['segments'][0]
    assert timeline==report['stage_context']['visual_timeline']
    assert segment['status']=='AI_ASSISTED' and segment['actual_duration_seconds'] is None
    assert report['acl_stage_records']==[] and api.store.events(sid)==[]
    assert timeline['media']['kind']=='OBSERVATION_SEQUENCE'
    assert timeline['media']['original_video_status']=='NOT_RECORDED'
    api.records.append(sid,'acl_research',report)
    assert overview(api.store,api.records,sid)['latest_research_source_changed'] is False
    reviewed=api.client.post(url(sid,'acl/timeline/reviews'),json={
        'request_id':'test-review','group_id':'wear','segment_id':'wear-1',
        'source_fingerprint':doc['fingerprint'],'status':'HUMAN_VERIFIED','human_confirmed':True,
        'start_observation_id':doc['frames'][1]['observation_id'],
        'end_observation_id':doc['frames'][3]['observation_id']})
    assert reviewed.status_code==201,reviewed.text
    assert overview(api.store,api.records,sid)['latest_research_source_changed'] is True
    # A new report sees explicit review; old saved report remains immutable.
    latest=run_research(api.store,api.records,sid,provider='rules')
    assert latest['acl_visual_timeline']['groups'][0]['segments'][0]['status']=='HUMAN_VERIFIED'
    assert api.records.latest(sid,'acl_research')['acl_visual_timeline']['groups'][0]['segments'][0]['status']=='AI_ASSISTED'


def test_model_context_marks_visual_candidates_derived_and_unconfirmed(api,monkeypatch):
    sid,_=seeded(api)
    calls=fake_deepseek(monkeypatch,{'summary':'Fixture only',
        'findings':[{'topic':'Missing confirmation','statement':'No confirmed boundary',
            'classification':'INSUFFICIENT_EVIDENCE','evidence_ids':[]}],
        'data_gaps':['Human review needed']})
    result=preliminary(api.store,api.records,sid)
    assert len(calls)==1
    segment=calls[0].payload['stage_context']['visual_timeline']['groups'][0]['segments'][0]
    assert segment['status']=='AI_ASSISTED' and segment['actual_duration_seconds'] is None
    assert 'AI_ASSISTED' in calls[0].system and 'REJECTED' in calls[0].system
    assert result['stage_context']['visual_timeline']['groups'][0]['status']=='AI_ASSISTED'

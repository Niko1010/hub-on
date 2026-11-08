"""Synthetic API fixtures only: no real ACL data, camera, model or cloud calls."""
from concurrent.futures import ThreadPoolExecutor
from copy import deepcopy
import json

import httpx
import pytest

from experience.acl import FeedbackInput, save_feedback
from experience.acl_timeline import IMPORT, REVIEW, LINK, TimelineImportInput, import_timeline, timeline_context
from tests.test_experience_api import api, url
from tests.test_acl_backend import acl_session, source


@pytest.fixture(autouse=True)
def no_network(monkeypatch):
    def forbidden(*args, **kwargs):
        raise AssertionError('Timeline tests must not invoke an external service')
    monkeypatch.setattr(httpx.HTTPTransport, 'handle_request', forbidden)


def setup(api):
    sid = acl_session(api)
    source(api, sid)
    manifest = api.client.get(url(sid, 'acl/timeline/frames')).json()
    frames = manifest['items']
    payload = {'import_key': 'fixture-review-1', 'source_fingerprint': manifest['source_fingerprint'],
        'review_reference': 'Synthetic review fixture, never real action evidence', 'groups': [{
            'group_id': 'wear', 'stage_id': 'wear', 'label': 'Synthetic wear window',
            'candidate_start': .5, 'candidate_end': 2.5,
            'segments': [
                {'segment_id': 'first', 'label': 'Fixture candidate 1', 'candidate_start': .5,
                 'candidate_end': 1, 'observation_ids': [frames[1]['observation_id'], frames[3]['observation_id']]},
                {'segment_id': 'second', 'label': 'Fixture candidate 2', 'candidate_start': 2,
                 'candidate_end': 2.5, 'observation_ids': [frames[5]['observation_id'], frames[6]['observation_id']]}
            ]}]}
    return sid, manifest, payload


def imported(api):
    sid, manifest, payload = setup(api)
    response = api.client.post(url(sid, 'acl/timeline/import'), json=payload)
    assert response.status_code == 201, response.text
    return sid, manifest, payload


def review(manifest, **changes):
    return {'request_id': 'review-1', 'group_id': 'wear', 'segment_id': 'first',
            'expected_review_id': None, 'source_fingerprint': manifest['source_fingerprint'],
            'status': 'HUMAN_VERIFIED', 'human_confirmed': True,
            'start_observation_id': manifest['items'][1]['observation_id'],
            'end_observation_id': manifest['items'][3]['observation_id'], **changes}


def raw_sources(api, sid):
    with api.store.connect() as db:
        return {
            table: [tuple(r) for r in db.execute(f'SELECT * FROM {table} WHERE session_id=?', (sid,))]
            for table in ('sessions', 'events', 'live_sessions', 'live_observations')
        }


def test_compact_manifest_has_original_ids_and_truthful_media(api):
    sid, manifest, _ = setup(api)
    assert manifest['total'] == 12 and manifest['kind'] == 'OBSERVATION_SEQUENCE'
    assert manifest['original_video_status'] == 'NOT_RECORDED' and manifest['original_video_url'] is None
    assert all('tracks' not in f and f['evidence_ref'] == 'observation:' + str(f['observation_id']) for f in manifest['items'])
    page = api.client.get(url(sid, 'acl/timeline/frames'), params={'offset': 3, 'limit': 2}).json()
    assert page['items'] == manifest['items'][3:5] and page['source_fingerprint'] == manifest['source_fingerprint']
    assert api.client.get(url(sid, 'acl/timeline/frames'), params={'limit': 2001}).status_code == 422


def test_import_preserves_original_data_and_candidate_vs_anchor_boundaries(api):
    sid, manifest, payload = setup(api)
    before = raw_sources(api, sid)
    first = api.client.post(url(sid, 'acl/timeline/import'), json=payload)
    second = api.client.post(url(sid, 'acl/timeline/import'), json=payload)
    assert first.status_code == second.status_code == 201
    assert first.json() == second.json() and len(api.records.list(sid, IMPORT)) == 1
    assert raw_sources(api, sid) == before
    timeline = api.client.get(url(sid, 'acl/timeline')).json()
    group = timeline['groups'][0]
    segment = group['segments'][0]
    assert group['status'] == segment['status'] == 'AI_ASSISTED'
    assert group['actual_duration_seconds'] is segment['actual_duration_seconds'] is None
    assert segment['candidate_start'] == .5 and segment['start_anchor']['timestamp'] == .4
    assert segment['evidence'][-1]['timestamp'] > segment['candidate_end']
    assert group['method'] == 'AI_ASSISTED_VISUAL_REVIEW' and group['source_unchanged'] is True
    assert api.records.list(sid, 'acl_stage') == []


def test_import_idempotency_under_concurrent_calls_and_conflicts(api):
    sid, _, payload = setup(api)
    body = TimelineImportInput(**payload)
    def call(_): return import_timeline(api.store, api.records, sid, body)['record_id']
    with ThreadPoolExecutor(max_workers=2) as executor:
        ids = list(executor.map(call, range(2)))
    assert ids[0] == ids[1] and len(api.records.list(sid, IMPORT)) == 1
    changed = deepcopy(payload); changed['review_reference'] = 'Different input'
    assert api.client.post(url(sid, 'acl/timeline/import'), json=changed).status_code == 422
    changed['import_key'] = 'another-key'
    assert api.client.post(url(sid, 'acl/timeline/import'), json=changed).status_code == 422
    assert len(api.records.list(sid, IMPORT)) == 1


@pytest.mark.parametrize('change', ['foreign_frame', 'missing_image', 'active', 'fingerprint', 'window'])
def test_import_rejects_wrong_source_or_unavailable_evidence(api, change):
    sid, manifest, payload = setup(api)
    if change == 'foreign_frame':
        other = acl_session(api); source(api, other)
        frames = api.client.get(url(other, 'acl/timeline/frames')).json()['items']
        payload['groups'][0]['segments'][0]['observation_ids'] = [frames[0]['observation_id']]
    elif change == 'missing_image':
        name = manifest['items'][1]['frame_url'].rsplit('/', 1)[1]
        (api.store.root/'live_frames'/sid/name).unlink()
    elif change == 'active':
        api.live.save({'session_id': sid, 'status': 'LIVE', 'source_type': 'RTSP'})
    elif change == 'fingerprint':
        payload['source_fingerprint'] = '0'*64
    else:
        payload['groups'][0]['candidate_end'] = 100
    assert api.client.post(url(sid, 'acl/timeline/import'), json=payload).status_code == 422
    assert api.records.list(sid, IMPORT) == []


def test_review_uses_current_saved_frames_and_is_append_only(api):
    sid, manifest, _ = imported(api)
    before = raw_sources(api, sid)
    body = review(manifest)
    response = api.client.post(url(sid, 'acl/timeline/reviews'), json=body)
    assert response.status_code == 201, response.text
    saved = response.json()
    assert saved['actual_duration_seconds'] == pytest.approx(.8)
    assert saved['start_anchor']['frame_index'] == 10 and saved['end_anchor']['frame_index'] == 30
    assert api.client.post(url(sid, 'acl/timeline/reviews'), json=body).json() == saved
    doc = api.client.get(url(sid, 'acl/timeline')).json()
    group = doc['groups'][0]
    assert group['status'] == 'AI_ASSISTED' and group['actual_duration_seconds'] is None
    assert group['segments'][0]['status'] == 'HUMAN_VERIFIED'
    assert group['segments'][0]['review_id'] == saved['record_id']
    assert raw_sources(api, sid) == before
    assert len(api.records.list(sid, REVIEW)) == 1
    assert api.records.list(sid, IMPORT)[0]['groups'][0]['segments'][0]['status'] == 'AI_ASSISTED'


@pytest.mark.parametrize('changes', [
    {'human_confirmed': False}, {'start_observation_id': None}, {'end_observation_id': None},
    {'start_observation_id': 999999}, {'source_fingerprint': '0'*64},
    {'expected_review_id': 'not-current'}, {'segment_id': 'not-in-group'},
    {'start': 0, 'end': 1}, {'status': 'FACT'},
    {'status': 'REJECTED'}, # unconfirmed status cannot retain submitted confirmed boundaries
])
def test_invalid_review_never_promotes_candidate(api, changes):
    sid, manifest, _ = imported(api)
    assert api.client.post(url(sid, 'acl/timeline/reviews'), json=review(manifest, **changes)).status_code == 422
    assert api.records.list(sid, REVIEW) == []


def test_review_stale_rejected_restore_and_reversed_boundaries(api):
    sid, manifest, _ = imported(api)
    first = api.client.post(url(sid, 'acl/timeline/reviews'), json=review(manifest)).json()
    stale = review(manifest, request_id='review-stale')
    assert api.client.post(url(sid, 'acl/timeline/reviews'), json=stale).status_code == 422
    reversed_body = review(manifest, request_id='reverse', expected_review_id=first['record_id'],
        start_observation_id=manifest['items'][5]['observation_id'], end_observation_id=manifest['items'][1]['observation_id'])
    assert api.client.post(url(sid, 'acl/timeline/reviews'), json=reversed_body).status_code == 422
    reject = review(manifest, request_id='reject', expected_review_id=first['record_id'], status='REJECTED',
                    start_observation_id=None, end_observation_id=None)
    response = api.client.post(url(sid, 'acl/timeline/reviews'), json=reject)
    assert response.status_code == 201
    rejected = response.json()
    assert rejected['actual_duration_seconds'] is None
    restore = {**reject, 'request_id': 'restore', 'expected_review_id': rejected['record_id'], 'status': 'AI_ASSISTED'}
    assert api.client.post(url(sid, 'acl/timeline/reviews'), json=restore).status_code == 201
    latest = timeline_context(api.store, api.records, sid)['groups'][0]['segments'][0]
    assert latest['status'] == 'AI_ASSISTED' and latest['actual_duration_seconds'] is None and latest['review_count'] == 3


def test_review_rejects_source_mutation_and_cross_session_anchor(api):
    sid, manifest, _ = imported(api)
    other = acl_session(api); source(api, other)
    oid = api.client.get(url(other, 'acl/timeline/frames')).json()['items'][0]['observation_id']
    assert api.client.post(url(sid, 'acl/timeline/reviews'), json=review(manifest, start_observation_id=oid)).status_code == 422
    api.live.append({'session_id': sid, 'timestamp': 5, 'frame_index': 150,
        'snapshot': '000000000150.jpg', 'tracks': [], 'event_ids': []})
    assert api.client.post(url(sid, 'acl/timeline/reviews'), json=review(manifest)).status_code == 422
    assert timeline_context(api.store, api.records, sid)['groups'][0]['source_unchanged'] is False


def test_feedback_associations_keep_seven_quotes_and_do_not_prove_stages(api):
    sid, _, _ = imported(api)
    fields = ['wearing_difficulty', 'adjustment_difficulty', 'operation_convenience', 'fit',
              'comfort', 'removal_difficulty', 'other_issues']
    original = save_feedback(api.store, api.records, sid, FeedbackInput(timestamp=4,
        values={field: 'Synthetic feedback '+field for field in fields}, human_confirmed=True))
    before = raw_sources(api, sid)
    body = {'request_id': 'link-1', 'feedback_record_id': original['record_id'], 'feedback_field': fields[0],
            'target': 'candidate', 'group_id': 'wear', 'segment_id': 'first', 'human_confirmed': True}
    saved = api.client.post(url(sid, 'acl/timeline/feedback-links'), json=body)
    assert saved.status_code == 201, saved.text
    assert api.client.post(url(sid, 'acl/timeline/feedback-links'), json=body).json() == saved.json()
    assert api.client.post(url(sid, 'acl/timeline/feedback-links'), json={**body, 'request_id': 'dupe'}).status_code == 422
    future = {**body, 'request_id': 'future', 'feedback_field': 'other_issues', 'target': 'future_dynamic_validation',
              'group_id': None, 'segment_id': None}
    future_result = api.client.post(url(sid, 'acl/timeline/feedback-links'), json=future).json()
    assert future_result['target_status'] == 'NOT_TESTED' and future_result['proves_causality'] is False
    doc = timeline_context(api.store, api.records, sid)
    assert len(doc['feedback']) == 7 and len(doc['feedback_links']) == 2
    assert doc['groups'][0]['status'] == 'AI_ASSISTED'
    assert saved.json()['original_quote'] == original['values'][fields[0]]
    assert all(not item['proves_stage_completion'] for item in doc['feedback_links'])
    assert api.records.record(sid, original['record_id'], 'acl_feedback') == original
    assert raw_sources(api, sid) == before


def test_feedback_requires_confirmation_ownership_and_existing_quote_event(api):
    sid, _, _ = imported(api)
    feedback = save_feedback(api.store, api.records, sid, FeedbackInput(timestamp=4, values={'comfort': 'Fixture'}))
    body = {'request_id': 'link-1', 'feedback_record_id': feedback['record_id'], 'feedback_field': 'comfort',
            'target': 'candidate', 'group_id': 'wear', 'human_confirmed': False}
    assert api.client.post(url(sid, 'acl/timeline/feedback-links'), json=body).status_code == 422
    body['human_confirmed'] = True
    assert api.client.post(url(sid, 'acl/timeline/feedback-links'), json={**body, 'feedback_field': 'fit'}).status_code == 422
    other = acl_session(api)
    assert api.client.post(url(other, 'acl/timeline/feedback-links'), json=body).status_code == 404
    forged = api.records.append(sid, 'acl_feedback', {**feedback, 'values': {'comfort': 'Changed quote'}})
    assert api.client.post(url(sid, 'acl/timeline/feedback-links'), json={**body, 'feedback_record_id': forged['record_id']}).status_code == 422
    assert api.records.list(sid, LINK) == []


def test_empty_session_does_not_invent_candidates_or_video(api):
    sid = acl_session(api)
    result = api.client.get(url(sid, 'acl/timeline'))
    assert result.status_code == 200
    doc = result.json()
    assert doc['groups'] == [] and doc['source_status'] == 'NOT_CONNECTED' and doc['media']['frame_count'] == 0
    assert doc['source_fingerprint'] is None and doc['model_inference_executed'] is False
    assert api.queue.pending == {}

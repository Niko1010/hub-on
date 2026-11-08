"""Synthetic software fixtures; not a real ACL action-accuracy benchmark."""
from copy import deepcopy
import json

import pytest

from experience.acl_behavior import ACLBehaviorConfig,ACLBehaviorEngine,analyze_acl_behaviors
from tests.test_experience_behavior import frame,points


def pose(*,near=False,hidden=(),posture='standing'):
    rows=points(hidden=hidden,posture=posture)
    for p in rows:
        if p['name'].endswith('_wrist'):
            p['y']=148 if near else 70
    return rows


def run(frames):
    return analyze_acl_behaviors(frames,session_id='acl-real-source-test',source_ref={
        'kind':'live','session_id':'acl-real-source-test','run_id':'acl-real-source-test'})


def at(result,label,t):
    return next(r for r in result['predictions'] if r['label']==label and r['timestamp']==t)


def test_standing_and_seated_posture_are_only_rules_without_wearing_or_seat_verification():
    standing=run([frame(t,pose=pose()) for t in (0,.3,.7,1.0)])
    assert at(standing,'STANDING_POSTURE',0)['status']=='UNKNOWN'
    assert at(standing,'STANDING_POSTURE',.7)['status']=='CANDIDATE'
    seated=run([frame(t,pose=pose(posture='sitting')) for t in (0,.3,.7)])
    assert at(seated,'SEATED_POSTURE',.7)['status']=='CANDIDATE'
    assert at(seated,'SITTING',.7)['status']=='UNKNOWN' # Existing verified-seat rule remains unchanged.
    assert all(r['method']=='RULE_BASED' and r['verification_status']=='NOT_VERIFIED' for r in seated['predictions'])
    assert seated['wearing_success']=='NOT_VERIFIED' and not seated['model_inference_executed']


def test_hand_knee_proximity_requires_sustained_visible_same_pair():
    result=run([frame(t,pose=pose(near=True)) for t in (0,.3,.7)])
    assert at(result,'HAND_KNEE_PROXIMITY',0)['status']=='UNKNOWN'
    row=at(result,'HAND_KNEE_PROXIMITY',.7)
    assert row['status']=='CANDIDATE'
    assert row['measured']['physical_contact_verified'] is False
    assert row['measured']['brace_interaction_verified'] is False
    assert at(result,'REPEATED_HAND_KNEE_INTERACTION',.7)['status']=='UNKNOWN'


def test_continuous_contact_is_one_episode_and_repeat_needs_observed_release():
    continuous=run([frame(t,pose=pose(near=True)) for t in (0,.3,.7,1,1.3,1.7,2,2.3,2.7)])
    assert at(continuous,'REPEATED_HAND_KNEE_INTERACTION',2.7)['measured']['distinct_episode_count']==1
    sequence=[frame(t,pose=pose(near=True)) for t in (0,.3,.7)]
    sequence += [frame(t,pose=pose()) for t in (1,1.3,1.5)]
    sequence += [frame(t,pose=pose(near=True)) for t in (1.8,2.1,2.5)]
    repeated=run(sequence)
    row=at(repeated,'REPEATED_HAND_KNEE_INTERACTION',2.5)
    assert row['status']=='CANDIDATE' and row['measured']['distinct_episode_count']==2
    assert row['measured']['reason']=='REPEATED_PROXIMITY_NOT_VERIFIED_ADJUSTMENT'


@pytest.mark.parametrize('hidden',['left_wrist','right_wrist','left_knee','right_knee'])
def test_missing_or_low_confidence_joints_are_unknown_and_reset_contact_history(hidden):
    sequence=[frame(t,pose=pose(near=True)) for t in (0,.3,.7)]
    sequence += [frame(1,pose=pose(near=True,hidden=(hidden,)))]
    sequence += [frame(t,pose=pose(near=True)) for t in (1.3,1.6,2.0)]
    result=run(sequence)
    assert at(result,'HAND_KNEE_PROXIMITY',1)['status']=='UNKNOWN'
    assert at(result,'REPEATED_HAND_KNEE_INTERACTION',2)['measured']['distinct_episode_count']==1
    low=pose(near=True)
    next(p for p in low if p['name']==hidden)['confidence']=.1
    assert at(run([frame(0,pose=low)]),'HAND_KNEE_PROXIMITY',0)['status']=='UNKNOWN'


@pytest.mark.parametrize('interruption',['gap','missing_track','changed_track','changed_mode','nonmonotonic'])
def test_history_does_not_cross_disconnect_or_ambiguous_track_boundaries(interruption):
    samples=[frame(t,pose=pose(near=True)) for t in (0,.3,.7)]
    after=2.7 if interruption=='gap' else .2 if interruption=='nonmonotonic' else 1.3
    if interruption=='missing_track':samples += [{**frame(1),'tracks':[]}]
    next_frame=frame(after,pose=pose(near=True),track='new-7' if interruption=='changed_track' else '7')
    if interruption=='changed_mode':next_frame['source_mode']='LIVE'
    samples.append(next_frame)
    result=run(samples)
    row=at(result,'HAND_KNEE_PROXIMITY',after)
    assert row['status']=='UNKNOWN'
    assert row['segment_id']!=at(result,'HAND_KNEE_PROXIMITY',.7)['segment_id']


def test_invalid_and_duplicate_tracks_do_not_emit_positive_candidates():
    invalid=frame(0,pose=pose(near=True));invalid['tracks'][0]['bbox']=None
    duplicate=frame(.3,pose=pose(near=True));duplicate['tracks']*=2
    result=run([invalid,duplicate])
    assert not result['candidate_sample_counts']
    assert all(row['status']=='UNKNOWN' for row in result['predictions'])


def test_intervals_only_cover_supporting_samples_and_preserve_source_references():
    samples=[frame(t,pose=pose(near=True)) for t in (0,.3,.7,1.0)]
    samples += [frame(1.3,pose=pose(near=True,hidden=('left_wrist',)))]
    samples += [frame(t,pose=pose(near=True)) for t in (1.6,1.9,2.3,2.6)]
    for f in samples:
        f['frame_url']=f"/api/live/sessions/acl-real-source-test/frames/{f['frame_index']:07}.jpg"
        f['evidence_ref']='observation:'+str(f['observation_id'])
    before=deepcopy(samples)
    result=run(samples)
    intervals=[i for i in result['intervals'] if i['label']=='HAND_KNEE_PROXIMITY']
    assert [(i['start'],i['end'],i['duration_seconds']) for i in intervals]==[(.7,1.0,.3),(2.3,2.6,.3)]
    assert all(i['sample_count']==2 and len(i['evidence_refs'])==2 for i in intervals)
    assert intervals[0]['evidence_refs'][0]['frame_url']==samples[2]['frame_url']
    assert intervals[0]['evidence_refs'][0]['observation_id']==samples[2]['observation_id']
    assert samples==before
    json.dumps(result,allow_nan=False)


def test_incremental_window_matches_batch_and_rejects_cross_session():
    samples=[frame(t,pose=pose(near=True)) for t in (0,.3,.7)]
    engine=ACLBehaviorEngine(session_id='acl-real-source-test')
    rows=[r for f in samples for r in engine.consume(f)]
    assert [(r['label'],r['status']) for r in rows]==[(r['label'],r['status']) for r in run(samples)['predictions']]
    with pytest.raises(ValueError):analyze_acl_behaviors(samples,session_id='a',source_ref={'kind':'live','session_id':'b'})
    with pytest.raises(ValueError):ACLBehaviorConfig(repeat_min_episodes=1)


def test_empty_and_occluded_capture_never_fills_study_stages():
    assert run([])['intervals']==[]
    result=run([frame(t,pose=[]) for t in (0,.3,.7)])
    assert result['intervals']==[]
    assert not any(r['label'] in ('PUT_ON_PRODUCT','ADJUST_WEARABLE','REMOVE_WEARABLE') for r in result['predictions'])

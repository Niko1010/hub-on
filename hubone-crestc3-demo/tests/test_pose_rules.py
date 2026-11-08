"""Synthetic geometry unit tests; not real-footage behavior validation."""
import json

import pytest

from vision.pose_rules import PoseExperiments


def synthetic_pose(dx=0, bent=False, raised=None, hidden=()):
    # Deliberately synthetic COCO-style coordinates in image pixels.
    names = ('nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
             'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
             'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
             'left_knee', 'right_knee', 'left_ankle', 'right_ankle')
    positions = {}
    for side, x in [('left', 40), ('right', 60)]:
        positions.update({f'{side}_shoulder': (x + (35 if bent else 0), 100 if bent else 60),
                          f'{side}_hip': (x, 110), f'{side}_knee': (x, 150),
                          f'{side}_ankle': (x, 190), f'{side}_wrist': (x, 30 if raised == side else 100)})
    return [{'name': name, 'x': positions.get(name, (50, 30))[0] + dx,
             'y': positions.get(name, (50, 30))[1], 'confidence': .95,
             'visible': name not in hidden} for name in names]


def observe(rules, t, pose=None, roi=True, track=1):
    return rules.observe(track, t, [0, 0, 120, 200], synthetic_pose() if pose is None else pose, roi)


def test_first_seen_inside_is_not_entry_but_observed_crossing_is():
    rules = PoseExperiments()
    assert observe(rules, 0)['statuses']['entry'] == 'UNKNOWN'
    assert observe(rules, .5, roi=False)['statuses']['entry'] == 'NOT_OBSERVED'
    result = observe(rules, 1, roi=True)
    assert result['statuses']['entry'] == 'OBSERVED'
    assert result['method'] == 'RULE_BASED' and result['experimental']
    assert result['trained_behavior_model'] is False and result['coordinate_system'] == 'IMAGE_PIXELS'
    assert 'event_id' not in result and 'events' not in result


def test_dwell_requires_continuous_five_seconds_and_unknown_roi_resets():
    rules = PoseExperiments()
    for index in range(10):
        assert observe(rules, index / 2)['statuses']['dwell'] == 'PENDING'
    assert observe(rules, 5)['statuses']['dwell'] == 'CANDIDATE'
    assert observe(rules, 5.5, roi=None)['statuses']['dwell'] == 'UNKNOWN'
    result = observe(rules, 6)
    assert result['statuses']['dwell'] == 'PENDING'
    assert result['statuses']['entry'] == 'UNKNOWN'


def test_walking_candidate_requires_temporal_image_motion_and_visible_ankles():
    rules = PoseExperiments()
    assert observe(rules, 0)['statuses']['walking'] == 'UNKNOWN'
    observe(rules, .4, synthetic_pose(dx=10))
    result = observe(rules, .8, synthetic_pose(dx=20))
    assert result['statuses']['walking'] == 'CANDIDATE'
    assert result['measured_criteria']['walking']['normalized_speed'] == pytest.approx(.125)
    assert observe(rules, 1, synthetic_pose(hidden=('left_ankle',)))['statuses']['walking'] == 'UNKNOWN'
    assert observe(rules, 1.2)['statuses']['walking'] == 'UNKNOWN'


def test_stationary_ankles_do_not_claim_walking():
    rules = PoseExperiments()
    for t in (0, .4, .8):
        result = observe(rules, t)
    assert result['statuses']['walking'] == 'NOT_OBSERVED'


def test_bend_requires_sustained_joint_geometry_and_occlusion_clears_hold():
    rules = PoseExperiments()
    assert observe(rules, 0, synthetic_pose(bent=True))['statuses']['bending'] == 'PENDING'
    observe(rules, .3, synthetic_pose(bent=True))
    assert observe(rules, .7, synthetic_pose(bent=True))['statuses']['bending'] == 'CANDIDATE'
    assert observe(rules, 1, synthetic_pose(bent=True, hidden=('left_hip',)))['statuses']['bending'] == 'UNKNOWN'
    assert observe(rules, 1.2, synthetic_pose(bent=True))['statuses']['bending'] == 'PENDING'
    assert observe(rules, 1.4)['statuses']['bending'] == 'NOT_OBSERVED'


def test_hand_raise_requires_same_side_continuity_and_not_invisible_negative():
    rules = PoseExperiments()
    observe(rules, 0, synthetic_pose(raised='left'))
    observe(rules, .3, synthetic_pose(raised='left'))
    assert observe(rules, .7, synthetic_pose(raised='left'))['statuses']['hand_raise'] == 'CANDIDATE'
    assert observe(rules, .9, synthetic_pose(raised='right'))['statuses']['hand_raise'] == 'PENDING'
    assert observe(rules, 1.1, synthetic_pose(hidden=('right_wrist',)))['statuses']['hand_raise'] == 'UNKNOWN'


@pytest.mark.parametrize('next_time,reason', [(3, 'OBSERVATION_GAP'), (0, 'NON_MONOTONIC_TIMESTAMP')])
def test_gaps_and_out_of_order_time_cannot_preserve_entry_or_action_evidence(next_time, reason):
    rules = PoseExperiments()
    observe(rules, .5, roi=False)
    result = observe(rules, next_time)
    assert result['history_reset'] == reason
    assert result['statuses']['entry'] == 'UNKNOWN'
    assert result['statuses']['walking'] == 'UNKNOWN'
    assert result['statuses']['dwell'] == 'PENDING'


def test_prune_and_reset_do_not_transfer_track_history():
    rules = PoseExperiments()
    observe(rules, 0, roi=False, track=1)
    observe(rules, 0, roi=False, track=2)
    rules.prune([2])
    assert observe(rules, .5, track=1)['statuses']['entry'] == 'UNKNOWN'
    assert observe(rules, .5, track=2)['statuses']['entry'] == 'OBSERVED'
    rules.reset()
    assert observe(rules, 1, track=2)['statuses']['entry'] == 'UNKNOWN'


def test_missing_or_low_confidence_keypoints_are_unknown_and_json_finite():
    rules = PoseExperiments()
    pose = synthetic_pose()
    for p in pose:
        p['confidence'] = .1
    result = observe(rules, 0, pose)
    assert all(result['statuses'][name] == 'UNKNOWN' for name in ('walking', 'bending', 'hand_raise'))
    bad = rules.observe(1, float('nan'), [0, 0, 0, 0], [], None)
    assert set(bad['statuses'].values()) == {'UNKNOWN'}
    json.dumps(result, allow_nan=False)
    json.dumps(bad, allow_nan=False)

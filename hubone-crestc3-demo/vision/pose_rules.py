"""Experimental image-space rules, not trained behavior recognition or Events.

Thresholds are uncalibrated hypotheses for manual footage evaluation. Camera
motion, perspective, occlusion and ID changes can invalidate these candidates.
No rule establishes intent, unique consumers, gait or real-world speed.
"""
from collections import deque
from dataclasses import dataclass
import math


@dataclass(frozen=True)
class PoseRuleConfig:
    keypoint_confidence: float = .5
    max_gap_seconds: float = 1.5
    dwell_seconds: float = 5.0
    walking_window_seconds: float = 1.2
    walking_min_seconds: float = .8
    walking_height_per_second: float = .08
    min_samples: int = 3
    hold_seconds: float = .6
    bend_torso_degrees: float = 35.0
    bend_hip_degrees: float = 140.0
    wrist_above_shoulder_height: float = .1


def _finite(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def _midpoint(a, b):
    return ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)


def _angle(a, origin, b):
    u = (a[0] - origin[0], a[1] - origin[1])
    v = (b[0] - origin[0], b[1] - origin[1])
    scale = math.hypot(*u) * math.hypot(*v)
    if scale < 1e-8:
        return None
    return math.degrees(math.acos(max(-1, min(1, (u[0] * v[0] + u[1] * v[1]) / scale))))


class PoseExperiments:
    """Per-track evidence only; call prune each frame and reset after disconnect."""
    def __init__(self, config=None):
        self.config = config or PoseRuleConfig()
        self._tracks = {}

    def reset(self):
        self._tracks.clear()

    def prune(self, active_ids):
        active = {str(value) for value in active_ids}
        self._tracks = {key: state for key, state in self._tracks.items() if key in active}

    def _point(self, points, name):
        p = points.get(name, {})
        if (p.get('visible') is not True or not _finite(p.get('confidence'))
                or p['confidence'] < self.config.keypoint_confidence
                or not _finite(p.get('x')) or not _finite(p.get('y'))):
            return None
        return p['x'], p['y']

    def _hold(self, state, key, predicate, timestamp):
        if predicate is not True:
            state['holds'].pop(key, None)
            return ('UNKNOWN' if predicate is None else 'NOT_OBSERVED'), 0.0, 0
        since, count = state['holds'].get(key, (timestamp, 0))
        count += 1
        state['holds'][key] = (since, count)
        duration = timestamp - since
        status = 'CANDIDATE' if duration >= self.config.hold_seconds and count >= self.config.min_samples else 'PENDING'
        return status, duration, count

    def observe(self, track_id, timestamp, bbox, keypoints, inside_roi):
        cfg, track_id = self.config, str(track_id)
        result = {'method': 'RULE_BASED', 'experimental': True, 'trained_behavior_model': False,
                  'coordinate_system': 'IMAGE_PIXELS', 'track_id': track_id,
                  'statuses': {}, 'measured_criteria': {}}
        statuses, measured = result['statuses'], result['measured_criteria']
        if not _finite(timestamp):
            self._tracks.pop(track_id, None)
            result['history_reset'] = 'INVALID_TIMESTAMP'
            for name in ('entry', 'dwell', 'walking', 'bending', 'hand_raise'):
                statuses[name] = 'UNKNOWN'
                measured[name] = {'reason': 'INVALID_TIMESTAMP'}
            return result
        state = self._tracks.get(track_id)
        reason = None
        if state is None:
            reason = 'FIRST_OBSERVATION'
        elif timestamp <= state['timestamp']:
            reason = 'NON_MONOTONIC_TIMESTAMP'
        elif timestamp - state['timestamp'] > cfg.max_gap_seconds:
            reason = 'OBSERVATION_GAP'
        if reason:
            state = {'timestamp': timestamp, 'roi': None, 'inside_since': None,
                     'ankles': deque(), 'holds': {}}
            self._tracks[track_id] = state
            result['history_reset'] = reason
        state['timestamp'] = timestamp

        # First appearance within an ROI is not an observed boundary crossing.
        roi = inside_roi if isinstance(inside_roi, bool) else None
        previous = state['roi']
        statuses['entry'] = ('UNKNOWN' if roi is None or previous is None else
                             'OBSERVED' if previous is False and roi is True else 'NOT_OBSERVED')
        measured['entry'] = {'previous_inside_roi': previous, 'inside_roi': roi,
                             'criterion': 'observed outside-to-inside transition; not first appearance'}
        if roi is True:
            if state['inside_since'] is None:
                state['inside_since'] = timestamp
            seconds = timestamp - state['inside_since']
            statuses['dwell'] = 'CANDIDATE' if seconds >= cfg.dwell_seconds else 'PENDING'
        else:
            seconds = None
            state['inside_since'] = None
            statuses['dwell'] = 'UNKNOWN' if roi is None else 'NOT_OBSERVED'
        measured['dwell'] = {'observed_inside_seconds': seconds, 'threshold_seconds': cfg.dwell_seconds,
                             'criterion': 'continuous tracked presence in supplied image ROI; not consumer intent'}
        state['roi'] = roi

        height = None
        if (isinstance(bbox, (list, tuple)) and len(bbox) == 4 and all(_finite(x) for x in bbox)
                and bbox[2] > bbox[0] and bbox[3] > bbox[1]):
            height = bbox[3] - bbox[1]
        points = {p.get('name'): p for p in (keypoints or []) if isinstance(p, dict)}
        point = lambda name: self._point(points, name)
        ankles = [point('left_ankle'), point('right_ankle')]
        walking = {'criterion': 'ankle midpoint image translation / mean bbox height / seconds; not gait or ground speed',
                   'threshold_height_per_second': cfg.walking_height_per_second,
                   'minimum_window_seconds': cfg.walking_min_seconds, 'normalized_speed': None}
        if height is None or any(p is None for p in ankles):
            state['ankles'].clear()
            statuses['walking'] = 'UNKNOWN'
            walking['reason'] = 'INSUFFICIENT_VISIBLE_ANKLES_OR_BBOX'
        else:
            foot = _midpoint(*ankles)
            history = state['ankles']
            history.append((timestamp, foot, height))
            while history and timestamp - history[0][0] > cfg.walking_window_seconds:
                history.popleft()
            duration = timestamp - history[0][0]
            walking.update(window_seconds=duration, samples=len(history))
            if duration < cfg.walking_min_seconds or len(history) < cfg.min_samples:
                statuses['walking'] = 'UNKNOWN'
                walking['reason'] = 'INSUFFICIENT_TEMPORAL_WINDOW'
            else:
                displacement = math.dist(foot, history[0][1])
                speed = displacement / (sum(row[2] for row in history) / len(history)) / duration
                walking.update(normalized_speed=speed, displacement_pixels=displacement)
                statuses['walking'] = 'CANDIDATE' if speed >= cfg.walking_height_per_second else 'NOT_OBSERVED'
        measured['walking'] = walking

        # Both sides are required to avoid interpreting a hidden torso as straight.
        joints = [point(f'{side}_{joint}') for joint in ('shoulder', 'hip', 'knee') for side in ('left', 'right')]
        lean = hip_angle = None
        if all(p is not None for p in joints):
            shoulder, hip, knee = [_midpoint(*joints[i:i + 2]) for i in (0, 2, 4)]
            hip_angle = _angle(shoulder, hip, knee)
            if hip_angle is not None:
                lean = math.degrees(math.atan2(abs(shoulder[0] - hip[0]), abs(shoulder[1] - hip[1])))
        predicate = None if lean is None else lean >= cfg.bend_torso_degrees and hip_angle <= cfg.bend_hip_degrees
        status, held, samples = self._hold(state, 'bend', predicate, timestamp)
        statuses['bending'] = status
        measured['bending'] = {'torso_lean_degrees': lean, 'hip_angle_degrees': hip_angle,
            'minimum_lean_degrees': cfg.bend_torso_degrees, 'maximum_hip_degrees': cfg.bend_hip_degrees,
            'held_seconds': held, 'required_seconds': cfg.hold_seconds, 'samples': samples,
            'reason': 'INSUFFICIENT_VISIBLE_JOINTS' if predicate is None else 'IMAGE_POSE_RULE_ONLY'}

        sides = {}
        for side in ('left', 'right'):
            shoulder, wrist = point(f'{side}_shoulder'), point(f'{side}_wrist')
            margin = None if shoulder is None or wrist is None or height is None else (shoulder[1] - wrist[1]) / height
            predicate = None if margin is None else margin >= cfg.wrist_above_shoulder_height
            status, held, samples = self._hold(state, f'raise_{side}', predicate, timestamp)
            sides[side] = {'status': status, 'wrist_above_shoulder_height': margin,
                           'held_seconds': held, 'samples': samples}
        side_statuses = {value['status'] for value in sides.values()}
        statuses['hand_raise'] = next((s for s in ('CANDIDATE', 'PENDING', 'UNKNOWN') if s in side_statuses), 'NOT_OBSERVED')
        measured['hand_raise'] = {'sides': sides, 'required_height_margin': cfg.wrist_above_shoulder_height,
                                  'required_seconds': cfg.hold_seconds, 'criterion': 'same-side wrist above shoulder, sustained image-space rule'}
        return result

"""Observed activity states for employees. Phase 10.

Turns sampled poses into `ActivityState` values, and it is the module where this
project's central ethical claim either holds or quietly fails.

WHAT THIS DOES NOT MEASURE
==========================

Movement. That is all. A wrist moved 4% of a body height between two sampled
frames; a torso centre moved 0.3 m/s across the floor; a person was within 1.2 m
of a customer. Every one of those is an observation about pixels and geometry.

None of them says how much work was done, how hard anybody tried, or whether an
hour was well spent. A person standing still at a till may be listening to a
customer; a person moving constantly may be looking for something they have
already walked past twice. The states below are named for what was *seen* and
they stop there. `tests/test_language_guard.py` fails the build if any
definition, field name, comment or label in this repository crosses that line.

`CUSTOMER_INTERACTION_INDICATOR` carries `INDICATOR` in its name for exactly this
reason: proximity to a shopper is a hint that an interaction may have occurred,
not evidence that one did.

WHY FEATURES ARE STORED RAW
===========================

`ActivityFeatures` holds the measurements; `resolve_state` applies thresholds.
Keeping them apart is Phase 10's second acceptance criterion and it is a
practical requirement, not tidiness: every threshold here is a guess that will be
wrong for a different shop, and re-tuning must not mean re-running a pose model
over hours of video.

WHY SOME FEATURES ARE OFTEN MISSING
===================================

Floor-derived features — speed, distance to a customer, distance to a work zone —
need a floor position, and D-015 measured that employees standing behind a
counter do not reliably have one: their legs are hidden, so the foot estimate
lands outside the shop. Those features are therefore `None` far more often for
employees than for shoppers, and `None` propagates rather than defaulting to
zero. A missing measurement is not a measurement of zero, and treating it as one
would report a stationary person who was never located at all.
"""

from __future__ import annotations

import math
from dataclasses import asdict, dataclass, field
from typing import TYPE_CHECKING

from retailvision.schemas import ActivityState
from retailvision.utils.logging import get_logger

if TYPE_CHECKING:
    from collections.abc import Sequence

    from retailvision.config import ActivityConfig
    from retailvision.cv.pose import PoseResult
    from retailvision.schemas import FloorPoint

__all__ = [
    "ActivityFeatures",
    "ActivityObservation",
    "ActivityTracker",
    "extract_features",
    "resolve_state",
]

log = get_logger(__name__)


@dataclass(slots=True)
class ActivityFeatures:
    """Raw measurements from one sampled frame of one employee.

    Stored, not interpreted. Every field is a distance, a speed or a confidence,
    and every one may be `None` when it could not be measured — which is a
    different thing from being zero.

    Displacements are expressed as a fraction of the person's own height in the
    crop, so a person at the back of the shop and the same person at the front
    produce comparable numbers. Raw pixels would make whoever is nearest the
    camera appear to move most.
    """

    timestamp: float  # scene seconds
    frame_index: int
    camera_id: str
    global_id: str

    pose_confidence: float | None = None
    confident_keypoints: int | None = None

    # Movement of the upper body between this sample and the previous one, as a
    # fraction of body height. None on the first sample of a track, and whenever
    # the keypoint was not confidently found in both frames.
    wrist_displacement: float | None = None
    shoulder_displacement: float | None = None
    torso_displacement: float | None = None

    # Floor-derived. Often None for employees — see the module docstring.
    floor_speed_mps: float | None = None
    floor_acceleration_mps2: float | None = None
    distance_to_nearest_customer_m: float | None = None
    distance_to_work_zone_m: float | None = None
    in_work_zone: bool | None = None

    seconds_since_previous: float | None = None

    def as_row(self) -> dict[str, object]:
        """A flat dict for storage. Phase 15 decides the schema; this is the data."""
        return asdict(self)


@dataclass(slots=True)
class ActivityObservation:
    """One resolved state, with the measurements and the reasoning behind it.

    The state alone would be an assertion. Paired with the features it came from
    and the rule that fired, it is a claim somebody can check and disagree with.
    """

    features: ActivityFeatures
    state: ActivityState
    reason: str

    @property
    def timestamp(self) -> float:
        return self.features.timestamp

    @property
    def global_id(self) -> str:
        return self.features.global_id


def _body_height(pose: PoseResult, min_confidence: float) -> float | None:
    """The person's height in the crop, for normalising displacements.

    Shoulder-to-hip where both are confident, because that span survives
    occlusion far better than head-to-ankle — and an employee behind a counter
    has no visible ankles at all. Falls back to the crop height, which is an
    over-estimate and is therefore conservative: it makes movement look smaller
    rather than larger.
    """
    shoulders = pose.midpoint("left_shoulder", "right_shoulder", min_confidence=min_confidence)
    hips = pose.midpoint("left_hip", "right_hip", min_confidence=min_confidence)
    if shoulders is not None and hips is not None:
        torso = abs(hips[1] - shoulders[1])
        if torso > 1e-6:
            # A torso is roughly a third of standing height. Approximate and
            # stated as such; it only has to be consistent between two frames of
            # the same person, which it is.
            return torso * 3.0
    return float(pose.crop_height) if pose.crop_height else None


def _displacement(
    current: PoseResult,
    previous: PoseResult,
    names: Sequence[str],
    *,
    min_confidence: float,
    height: float | None,
) -> float | None:
    """Mean movement of named keypoints between two samples, height-normalised.

    Returns None when no named keypoint was confidently found in *both* frames.
    Averaging over whichever happened to be visible would silently compare a
    left wrist in one frame with a right wrist in the next.
    """
    if height is None or height <= 0:
        return None
    moved: list[float] = []
    for name in names:
        a = current.point(name, min_confidence=min_confidence)
        b = previous.point(name, min_confidence=min_confidence)
        if a is None or b is None:
            continue
        moved.append(math.dist(a, b) / height)
    return sum(moved) / len(moved) if moved else None


def extract_features(
    *,
    global_id: str,
    camera_id: str,
    frame_index: int,
    timestamp: float,
    pose: PoseResult | None,
    previous_pose: PoseResult | None = None,
    previous_timestamp: float | None = None,
    floor_xy: FloorPoint | None = None,
    previous_floor_xy: FloorPoint | None = None,
    previous_speed: float | None = None,
    customer_positions: Sequence[FloorPoint] = (),
    work_zone_distance_m: float | None = None,
    in_work_zone: bool | None = None,
    min_keypoint_confidence: float = 0.4,
) -> ActivityFeatures:
    """Measure one sampled frame. No thresholds, no states, no judgements."""
    features = ActivityFeatures(
        timestamp=timestamp,
        frame_index=frame_index,
        camera_id=camera_id,
        global_id=global_id,
        distance_to_work_zone_m=work_zone_distance_m,
        in_work_zone=in_work_zone,
    )
    if previous_timestamp is not None:
        features.seconds_since_previous = max(0.0, timestamp - previous_timestamp)

    if pose is not None:
        features.pose_confidence = pose.mean_confidence
        features.confident_keypoints = pose.confident_keypoints(min_keypoint_confidence)

        if previous_pose is not None:
            height = _body_height(pose, min_keypoint_confidence)
            features.wrist_displacement = _displacement(
                pose, previous_pose, ("left_wrist", "right_wrist"),
                min_confidence=min_keypoint_confidence, height=height,
            )
            features.shoulder_displacement = _displacement(
                pose, previous_pose, ("left_shoulder", "right_shoulder"),
                min_confidence=min_keypoint_confidence, height=height,
            )
            features.torso_displacement = _displacement(
                pose, previous_pose, ("left_hip", "right_hip", "left_shoulder",
                                      "right_shoulder"),
                min_confidence=min_keypoint_confidence, height=height,
            )

    elapsed = features.seconds_since_previous
    if floor_xy is not None and previous_floor_xy is not None and elapsed:
        speed = math.dist(floor_xy, previous_floor_xy) / elapsed
        features.floor_speed_mps = speed
        if previous_speed is not None:
            features.floor_acceleration_mps2 = (speed - previous_speed) / elapsed

    if floor_xy is not None and customer_positions:
        features.distance_to_nearest_customer_m = min(
            math.dist(floor_xy, position) for position in customer_positions
        )

    return features


def resolve_state(
    features: ActivityFeatures, config: ActivityConfig
) -> tuple[ActivityState, str]:
    """Turn measurements into an observed state, and say which rule fired.

    The precedence below is a decision, not an accident, and it is ordered by how
    much each rule actually knows:

    1. **UNKNOWN first.** A pose the model was not confident about cannot support
       any of the other statements. Guessing from a bad pose is how a person who
       was never really seen acquires a described state.
    2. **Proximity to a customer next**, because it is the most specific
       observation available and the least dependent on thresholds — and because
       its name already says it is an indicator rather than a finding.
    3. **Work zone with upper-body movement**, which says where somebody was and
       that their arms moved. Not what they were doing.
    4. **Moving**, from floor speed where a floor position exists, or from torso
       displacement where it does not — which is the common case for employees
       (D-015).
    5. **STATIONARY** only when everything above has been ruled out *and*
       something was actually measured. Silence is UNKNOWN, never STATIONARY.
    """
    if features.pose_confidence is None:
        return (
            ActivityState.UNKNOWN,
            "no pose was estimated for this sample, so nothing was observed",
        )
    if features.pose_confidence < config.min_pose_confidence:
        return (
            ActivityState.UNKNOWN,
            f"pose confidence {features.pose_confidence:.2f} is below "
            f"{config.min_pose_confidence}; the keypoints are not reliable enough "
            "to describe",
        )
    if (features.confident_keypoints or 0) < config.min_confident_keypoints:
        return (
            ActivityState.UNKNOWN,
            f"only {features.confident_keypoints} keypoint(s) were confidently "
            f"found, fewer than the {config.min_confident_keypoints} required",
        )

    distance = features.distance_to_nearest_customer_m
    if distance is not None and distance <= config.customer_proximity_m:
        return (
            ActivityState.CUSTOMER_INTERACTION_INDICATOR,
            f"within {distance:.2f} m of a customer (threshold "
            f"{config.customer_proximity_m} m). Proximity is an INDICATOR that an "
            "interaction may have occurred, not evidence that one did — the two "
            "may simply have been standing near each other.",
        )

    upper_body = max(
        features.wrist_displacement or 0.0, features.shoulder_displacement or 0.0
    )
    measured_upper_body = (
        features.wrist_displacement is not None
        or features.shoulder_displacement is not None
    )

    if (
        features.in_work_zone
        and measured_upper_body
        and upper_body >= config.upper_body_movement
    ):
        return (
            ActivityState.WORK_ZONE_ACTIVITY,
            f"in the work zone with upper-body movement of {upper_body:.3f} body "
            f"heights between samples (threshold {config.upper_body_movement}). "
            "This states where the person was and that their arms moved.",
        )

    speed = features.floor_speed_mps
    if speed is not None:
        if speed >= config.moving_speed_mps:
            return (
                ActivityState.MOVING,
                f"floor speed {speed:.2f} m/s is at or above "
                f"{config.moving_speed_mps} m/s",
            )
        return (
            ActivityState.STATIONARY,
            f"floor speed {speed:.2f} m/s is below {config.moving_speed_mps} m/s",
        )

    if measured_upper_body:
        if (features.torso_displacement or 0.0) >= config.torso_movement:
            return (
                ActivityState.MOVING,
                f"no floor position was available, but the torso moved "
                f"{features.torso_displacement:.3f} body heights between samples "
                f"(threshold {config.torso_movement}). Employees standing behind a "
                "counter frequently have no usable floor position (D-015), so the "
                "fallback is image-space movement.",
            )
        return (
            ActivityState.STATIONARY,
            f"no floor position was available; upper-body movement {upper_body:.3f} "
            f"and torso movement {features.torso_displacement or 0.0:.3f} are both "
            "below their thresholds",
        )

    return (
        ActivityState.UNKNOWN,
        "a pose was found but nothing could be compared against — this is the "
        "first sample for this person, so no movement has been observed yet",
    )


@dataclass(slots=True)
class ActivityTracker:
    """Accumulates samples per employee and resolves each into a state.

    Holds the previous pose, position and speed per person so displacement can be
    measured between consecutive *samples* rather than consecutive frames — the
    sampling interval is what `seconds_since_previous` records, and every
    displacement is relative to it.
    """

    config: ActivityConfig
    _previous_pose: dict[str, PoseResult] = field(default_factory=dict, init=False)
    _previous_time: dict[str, float] = field(default_factory=dict, init=False)
    _previous_floor: dict[str, FloorPoint] = field(default_factory=dict, init=False)
    _previous_speed: dict[str, float] = field(default_factory=dict, init=False)
    observations: list[ActivityObservation] = field(default_factory=list, init=False)

    def observe(
        self,
        *,
        global_id: str,
        camera_id: str,
        frame_index: int,
        timestamp: float,
        pose: PoseResult | None,
        floor_xy: FloorPoint | None = None,
        customer_positions: Sequence[FloorPoint] = (),
        work_zone_distance_m: float | None = None,
        in_work_zone: bool | None = None,
    ) -> ActivityObservation:
        features = extract_features(
            global_id=global_id,
            camera_id=camera_id,
            frame_index=frame_index,
            timestamp=timestamp,
            pose=pose,
            previous_pose=self._previous_pose.get(global_id),
            previous_timestamp=self._previous_time.get(global_id),
            floor_xy=floor_xy,
            previous_floor_xy=self._previous_floor.get(global_id),
            previous_speed=self._previous_speed.get(global_id),
            customer_positions=customer_positions,
            work_zone_distance_m=work_zone_distance_m,
            in_work_zone=in_work_zone,
            min_keypoint_confidence=self.config.min_keypoint_confidence,
        )
        state, reason = resolve_state(features, self.config)
        observation = ActivityObservation(features=features, state=state, reason=reason)
        self.observations.append(observation)

        if pose is not None:
            self._previous_pose[global_id] = pose
        self._previous_time[global_id] = timestamp
        if floor_xy is not None:
            self._previous_floor[global_id] = floor_xy
        if features.floor_speed_mps is not None:
            self._previous_speed[global_id] = features.floor_speed_mps
        return observation

    def states_for(self, global_id: str) -> list[ActivityState]:
        return [o.state for o in self.observations if o.global_id == global_id]

    def summary(self) -> dict[str, dict[str, int]]:
        """Counts of each observed state per person.

        Counts of *samples*, deliberately — not seconds, and not percentages.
        A share would invite the reading this project refuses: that a proportion
        of somebody's time can be characterised from a handful of sampled frames.
        """
        out: dict[str, dict[str, int]] = {}
        for observation in self.observations:
            per_person = out.setdefault(observation.global_id, {})
            key = str(observation.state)
            per_person[key] = per_person.get(key, 0) + 1
        return out

    def stats(self) -> dict[str, object]:
        return {
            "observations": len(self.observations),
            "people": len({o.global_id for o in self.observations}),
            "unknown": sum(
                1 for o in self.observations if o.state is ActivityState.UNKNOWN
            ),
        }

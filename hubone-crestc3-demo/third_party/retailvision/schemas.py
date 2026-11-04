"""Core data contracts shared by every RetailVision stage.

Design note — why dataclasses here and pydantic in `config.py`:

These objects sit on the hot path. A 2-camera, 10-minute run at 25 fps produces
~30 000 frames and, at a handful of people per frame, low-hundreds-of-thousands
of `Detection` objects. Pydantic validates on every instantiation, which is the
right trade for a config file read once at startup and the wrong one for an
object built 200 000 times. So: `slots=True` dataclasses for per-frame data,
pydantic for configuration.

`slots=True` also blocks accidental attribute typos (`det.bbbox = ...` raises)
and cuts per-object memory, which matters at these counts.

Coordinate conventions, fixed once here so no module has to guess:

- `bbox` is **pixel** `(x1, y1, x2, y2)`, top-left origin, x right, y down —
  the OpenCV/Ultralytics convention.
- Floor-plan coordinates are `(X, Y)` in **metres**, origin at the floor plan's
  top-left, and are always named `X`/`Y` or `floor_xy` to keep them visibly
  distinct from pixel `x`/`y`.
- Time is **seconds from the start of the video**, never wall-clock. The brief is
  explicit that system-clock time must not stand in for video time.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import StrEnum
from typing import TYPE_CHECKING

if TYPE_CHECKING:  # numpy is a runtime dep, but only the annotation needs it here
    import numpy as np

__all__ = [
    "ActivityState",
    "BBox",
    "CameraConfig",
    "Detection",
    "FloorPoint",
    "GlobalIdentity",
    "MatchState",
    "Track",
    "Transaction",
    "TransactionMatch",
    "VideoFrame",
    "ZoneEvent",
]

# (x1, y1, x2, y2) in pixels.
BBox = tuple[float, float, float, float]

# (X, Y) in floor-plan metres.
FloorPoint = tuple[float, float]


# --------------------------------------------------------------------------- #
# Ingestion
# --------------------------------------------------------------------------- #


@dataclass(slots=True)
class CameraConfig:
    """Static description of one camera. Comes from `config/cameras.yaml`."""

    camera_id: str
    video_path: str
    fps: float
    width: int
    height: int
    # Cameras a person can plausibly walk to next, with the fastest feasible
    # travel time. Phase 08 uses this to reject impossible re-ID transitions.
    neighbours: dict[str, float] = field(default_factory=dict)


@dataclass(slots=True)
class VideoFrame:
    """One decoded frame plus the identity it needs to be interpreted."""

    camera_id: str
    frame_index: int
    timestamp: float  # seconds from start of video — NOT wall-clock
    fps: float
    image: np.ndarray

    @classmethod
    def timestamp_for(cls, frame_index: int, fps: float) -> float:
        """`t = frame_index / fps`, guarded against a zero/absent fps.

        Some containers report fps as 0. Silently producing `inf` timestamps
        would corrupt every downstream dwell calculation, so fail loudly.
        """
        if fps <= 0:
            raise ValueError(f"fps must be positive, got {fps!r}")
        return frame_index / fps


# --------------------------------------------------------------------------- #
# Detection and tracking
# --------------------------------------------------------------------------- #


@dataclass(slots=True)
class Detection:
    """One detected person in one frame. Phase 04."""

    bbox: BBox
    confidence: float
    class_id: int = 0  # COCO 'person'

    @property
    def foot_point(self) -> tuple[float, float]:
        """Bottom-centre of the box — the floor contact point.

        This is the pixel that Phase 06 pushes through the homography. It is an
        approximation: it breaks when the person is occluded at the feet or
        partially out of frame, which is why `Track` carries confidence forward.
        """
        x1, _, x2, y2 = self.bbox
        return ((x1 + x2) / 2.0, y2)


@dataclass(slots=True)
class Track:
    """A person followed across frames of a *single* camera. Phase 05.

    `global_id` stays None until Phase 08 links tracks across cameras. Keeping
    it optional here — rather than inventing a placeholder — is what makes an
    unmatched track visibly unmatched instead of quietly wrong.
    """

    camera_id: str
    local_track_id: int
    bbox: BBox
    confidence: float
    frame_index: int
    timestamp: float
    global_id: str | None = None
    floor_xy: FloorPoint | None = None
    zone: str | None = None


# --------------------------------------------------------------------------- #
# Cross-camera identity
# --------------------------------------------------------------------------- #


@dataclass(slots=True)
class GlobalIdentity:
    """One person as understood across all cameras. Phase 08.

    The brief is firm that the system must expose confidence rather than
    pretend every global ID is correct, hence `match_confidence` and the
    human-readable `match_reason` travelling with the identity itself.
    """

    global_id: str
    camera_id: str
    local_track_id: int
    first_seen: float
    last_seen: float
    reid_similarity: float | None = None
    match_reason: str = "seed"  # 'seed' = first sighting, nothing matched yet
    match_confidence: float = 1.0
    is_employee: bool = False
    employee_id: str | None = None


# --------------------------------------------------------------------------- #
# Space and journeys
# --------------------------------------------------------------------------- #


@dataclass(slots=True)
class ZoneEvent:
    """A contiguous interval one person spent in one zone. Phase 07.

    Stored as an interval rather than per-frame rows: the brief calls out that
    event data beats millions of frame rows, and dwell time is the quantity
    every analytic actually wants.
    """

    global_id: str
    zone_id: str
    entered_at: float
    exited_at: float | None = None

    @property
    def duration_seconds(self) -> float | None:
        """None while the person is still inside the zone — not 0.

        0 would silently mean 'no dwell'; None means 'not yet known'.
        """
        if self.exited_at is None:
            return None
        return self.exited_at - self.entered_at


class ActivityState(StrEnum):
    """Observable employee states. Phase 10.

    Deliberately describes *what was observed*, never effort or output. Per
    `docs/privacy.md` and the brief, detected movement says nothing about how
    much work was done, and the vocabulary is the first place that distinction
    erodes — so it is fixed here and enforced by `tests/test_language_guard.py`.
    """

    STATIONARY = "STATIONARY"
    MOVING = "MOVING"
    CUSTOMER_INTERACTION_INDICATOR = "CUSTOMER_INTERACTION_INDICATOR"
    WORK_ZONE_ACTIVITY = "WORK_ZONE_ACTIVITY"
    UNKNOWN = "UNKNOWN"


# --------------------------------------------------------------------------- #
# POS
# --------------------------------------------------------------------------- #


@dataclass(slots=True)
class Transaction:
    """One simulated till transaction. Phase 13."""

    transaction_id: str
    timestamp: float
    register_id: str
    total_amount: float
    items: str
    category: str


class MatchState(StrEnum):
    """Outcome of linking a transaction to a person. Phase 14.

    AMBIGUOUS and UNMATCHED exist because the brief forbids forcing every
    transaction onto a person. They are real, reportable answers.
    """

    MATCHED = "MATCHED"
    AMBIGUOUS = "AMBIGUOUS"
    UNMATCHED = "UNMATCHED"


@dataclass(slots=True)
class TransactionMatch:
    """The link — or the explicit absence of one — between a till and a person."""

    transaction_id: str
    global_id: str | None
    state: MatchState
    match_score: float
    match_confidence: float
    match_method: str
    # Runners-up, kept so an AMBIGUOUS verdict can be explained rather than
    # just asserted: [(global_id, score), ...]
    candidates: list[tuple[str, float]] = field(default_factory=list)

"""Per-camera tracking. Phase 05.

Detection answers "who is in this frame". Tracking answers "is that the same
person as last frame", which is the first question in this project whose answer
can be *wrong in a way nobody notices*: an identity swap produces two plausible
journeys instead of one correct one, and nothing downstream can tell.

Design, and the reasons for it:

- **The backend sits behind this module's own contract.** Callers get `Track`
  objects and never see an Ultralytics `STrack`. `DECISIONS.md` D-005 chose
  ByteTrack provisionally; Phase 05's job was to confirm or replace it, and that
  is only possible if replacing it is a config edit rather than a refactor.
- **Two backends ship, not one.** `bytetrack` wraps Ultralytics' implementation;
  `iou` is this project's own, ~80 lines of Hungarian assignment over IoU. The
  second exists because the first is reached through an API Ultralytics does not
  promise to keep, and because a swappable seam nobody has ever swapped is a
  claim, not a feature.
- **Time comes from the video.** The tracker is built with its camera, so it
  derives `timestamp = frame_index / fps` itself (C-018). Callers cannot
  accidentally hand it a wall clock, and striding detection does not compress
  time.
- **Buffers are configured in seconds, not frames.** "How long can somebody be
  hidden behind a shelf and still be the same person" is a question about the
  world; 30 frames is an answer that silently changes meaning when the fps does.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Protocol, runtime_checkable

import numpy as np

from retailvision.config import TrackerConfig, load_models_config
from retailvision.schemas import Track, VideoFrame
from retailvision.utils.logging import get_logger

if TYPE_CHECKING:
    from collections.abc import Iterable, Iterator, Sequence

    from retailvision.schemas import CameraConfig, Detection

__all__ = [
    "IoUTracker",
    "Tracker",
    "TrackerError",
    "build_tracker",
    "iou_matrix",
]

log = get_logger(__name__)


class TrackerError(RuntimeError):
    """The tracker could not be built or updated. Always names the backend."""


@runtime_checkable
class Tracker(Protocol):
    """Follows people across frames of a single camera.

    Implementations must:

    - return `Track` objects whose `local_track_id` is stable for as long as the
      tracker believes it is looking at the same person, and never reused for a
      different one within a run;
    - derive `timestamp` from the video, never the system clock;
    - accept a frame with no detections (people leave) and return `[]` rather
      than raising or repeating the last frame's tracks;
    - be resettable, so one instance per camera is a choice rather than a
      requirement.
    """

    def update(self, detections: Sequence[Detection], frame_index: int) -> list[Track]:
        """Associate this frame's detections with existing tracks."""
        ...

    def reset(self) -> None:
        """Forget everything. Track ids may restart from zero."""
        ...

    @property
    def name(self) -> str:
        """Identifier for logs and reports, e.g. `bytetrack@cam01`."""
        ...


# --------------------------------------------------------------------------- #
# Pure geometry — no state, no backend
# --------------------------------------------------------------------------- #


def iou_matrix(a: Sequence[Sequence[float]], b: Sequence[Sequence[float]]) -> np.ndarray:
    """Pairwise IoU between two sets of `(x1, y1, x2, y2)` boxes.

    Returns an `len(a) x len(b)` matrix. Vectorised because this runs per frame
    and a Python double loop over a busy aisle is a measurable share of the
    frame budget.
    """
    if not len(a) or not len(b):
        return np.zeros((len(a), len(b)), dtype=np.float64)

    boxes_a = np.asarray(a, dtype=np.float64).reshape(-1, 4)
    boxes_b = np.asarray(b, dtype=np.float64).reshape(-1, 4)

    x1 = np.maximum(boxes_a[:, None, 0], boxes_b[None, :, 0])
    y1 = np.maximum(boxes_a[:, None, 1], boxes_b[None, :, 1])
    x2 = np.minimum(boxes_a[:, None, 2], boxes_b[None, :, 2])
    y2 = np.minimum(boxes_a[:, None, 3], boxes_b[None, :, 3])

    overlap = np.clip(x2 - x1, 0, None) * np.clip(y2 - y1, 0, None)
    area_a = np.clip(boxes_a[:, 2] - boxes_a[:, 0], 0, None) * np.clip(
        boxes_a[:, 3] - boxes_a[:, 1], 0, None
    )
    area_b = np.clip(boxes_b[:, 2] - boxes_b[:, 0], 0, None) * np.clip(
        boxes_b[:, 3] - boxes_b[:, 1], 0, None
    )
    union = area_a[:, None] + area_b[None, :] - overlap
    # A zero-area box unions to zero. Returning 0 rather than nan keeps the
    # assignment step from silently refusing to match anything.
    with np.errstate(divide="ignore", invalid="ignore"):
        return np.where(union > 0, overlap / union, 0.0)


# --------------------------------------------------------------------------- #
# This project's own tracker
# --------------------------------------------------------------------------- #


@dataclass(slots=True)
class _Candidate:
    """One tracked person, as `IoUTracker` understands them."""

    track_id: int
    bbox: tuple[float, float, float, float]
    confidence: float
    hits: int = 1
    age: int = 0
    frames_lost: int = 0
    confirmed: bool = False
    # Pixels per frame, from the last matched step. Used to predict where the
    # person will be while they are hidden — without it, anyone occluded for
    # more than a frame or two is re-found at their old position and matched to
    # whoever has since walked into it.
    velocity: tuple[float, float] = (0.0, 0.0)
    history: list[tuple[int, tuple[float, float, float, float]]] = field(
        default_factory=list, repr=False
    )

    def predicted_bbox(self) -> tuple[float, float, float, float]:
        vx, vy = self.velocity
        steps = self.frames_lost
        x1, y1, x2, y2 = self.bbox
        return (x1 + vx * steps, y1 + vy * steps, x2 + vx * steps, y2 + vy * steps)


class IoUTracker:
    """Greedy-optimal IoU tracking: Hungarian assignment, constant velocity.

    Written rather than imported for two reasons. It is the fallback if
    Ultralytics changes the private API the other backend reaches through; and
    a "swappable backend" that has never been swapped is an untested claim.

    Deliberately simple — no Kalman filter, no appearance model. It exists to be
    a correct, readable baseline and to make the seam real, not to beat
    ByteTrack. Where they disagree on this machine is recorded in
    `DECISIONS.md`, measured rather than assumed.
    """

    def __init__(self, camera: CameraConfig, config: TrackerConfig | None = None) -> None:
        self.camera = camera
        self.config = config or load_models_config().tracker
        self.fps = camera.fps if camera.fps > 0 else 25.0
        self._tracks: list[_Candidate] = []
        self._next_id = 1
        self._frames = 0

    # -- lifecycle ---------------------------------------------------------- #

    def reset(self) -> None:
        self._tracks.clear()
        self._next_id = 1
        self._frames = 0

    @property
    def name(self) -> str:
        return f"iou@{self.camera.camera_id}"

    @property
    def max_frames_lost(self) -> int:
        """How many frames a person may stay hidden and keep their id."""
        return max(1, round(self.config.lost_track_seconds * self.fps))

    @property
    def min_hits(self) -> int:
        """Detections before a track is shown to callers.

        A single spurious box should not create a customer. The cost is that a
        real person is invisible for their first frames, which is why the value
        is small and configured rather than fixed.
        """
        return max(1, self.config.min_hits)

    # -- association -------------------------------------------------------- #

    def update(self, detections: Sequence[Detection], frame_index: int) -> list[Track]:
        self._frames += 1
        for track in self._tracks:
            track.age += 1

        kept = [d for d in detections if d.confidence >= self.config.min_confidence]

        if self._tracks and kept:
            predicted = [t.predicted_bbox() for t in self._tracks]
            iou = iou_matrix(predicted, [d.bbox for d in kept])
            matches, unmatched_tracks, unmatched_dets = self._assign(iou)
        else:
            matches = []
            unmatched_tracks = list(range(len(self._tracks)))
            unmatched_dets = list(range(len(kept)))

        for track_i, det_i in matches:
            self._absorb(self._tracks[track_i], kept[det_i], frame_index)

        for track_i in unmatched_tracks:
            self._tracks[track_i].frames_lost += 1

        for det_i in unmatched_dets:
            detection = kept[det_i]
            if detection.confidence < self.config.new_track_confidence:
                continue
            self._tracks.append(
                _Candidate(
                    track_id=self._next_id,
                    bbox=tuple(detection.bbox),
                    confidence=detection.confidence,
                    confirmed=self.min_hits <= 1,
                    history=[(frame_index, tuple(detection.bbox))],
                )
            )
            self._next_id += 1

        # Drop the ones that have been gone too long. Ids are never reissued:
        # a recycled id would silently merge two different people's journeys.
        self._tracks = [t for t in self._tracks if t.frames_lost <= self.max_frames_lost]

        return [
            self._as_track(t, frame_index)
            for t in self._tracks
            if t.confirmed and t.frames_lost == 0
        ]

    def _assign(self, iou: np.ndarray) -> tuple[list[tuple[int, int]], list[int], list[int]]:
        """Optimal one-to-one assignment, then drop matches that are too weak.

        Hungarian rather than greedy: greedy matching gives a different answer
        depending on which track it happens to consider first, which is exactly
        the kind of order-dependence that makes an identity swap unreproducible
        and therefore undebuggable.
        """
        from scipy.optimize import linear_sum_assignment

        rows, cols = linear_sum_assignment(-iou)
        matches: list[tuple[int, int]] = []
        matched_rows: set[int] = set()
        matched_cols: set[int] = set()
        for r, c in zip(rows, cols, strict=True):
            if iou[r, c] < self.config.match_iou:
                continue
            matches.append((int(r), int(c)))
            matched_rows.add(int(r))
            matched_cols.add(int(c))

        unmatched_tracks = [i for i in range(iou.shape[0]) if i not in matched_rows]
        unmatched_dets = [j for j in range(iou.shape[1]) if j not in matched_cols]
        return matches, unmatched_tracks, unmatched_dets

    def _absorb(self, track: _Candidate, detection: Detection, frame_index: int) -> None:
        previous = track.bbox
        elapsed = max(1, track.frames_lost)
        new = tuple(float(v) for v in detection.bbox)
        track.velocity = (
            (new[0] - previous[0]) / elapsed,
            (new[1] - previous[1]) / elapsed,
        )
        track.bbox = new
        track.confidence = detection.confidence
        track.hits += 1
        track.frames_lost = 0
        if track.hits >= self.min_hits:
            track.confirmed = True
        track.history.append((frame_index, new))

    def _as_track(self, candidate: _Candidate, frame_index: int) -> Track:
        return Track(
            camera_id=self.camera.camera_id,
            local_track_id=candidate.track_id,
            bbox=candidate.bbox,
            confidence=candidate.confidence,
            frame_index=frame_index,
            timestamp=VideoFrame.timestamp_for(frame_index, self.fps),
        )

    def stats(self) -> dict[str, object]:
        return {
            "tracker": self.name,
            "frames": self._frames,
            "tracks_created": self._next_id - 1,
            "tracks_alive": len(self._tracks),
        }


# --------------------------------------------------------------------------- #
# Ultralytics ByteTrack, wrapped
# --------------------------------------------------------------------------- #


class _ByteTrackInput:
    """Adapter presenting our detections the way Ultralytics' tracker expects.

    `BYTETracker.update()` wants an object with `.xywh`, `.conf` and `.cls`
    arrays that also supports boolean-mask indexing — the shape of an
    Ultralytics `Boxes`. Building that here, rather than calling
    `model.track()`, is what keeps detection and tracking as separate stages:
    `model.track()` would run its own detector, and Phase 04's configured,
    measured detector would be bypassed without anybody noticing.
    """

    __slots__ = ("cls", "conf", "xywh")

    def __init__(self, xywh: np.ndarray, conf: np.ndarray, cls: np.ndarray) -> None:
        self.xywh = xywh
        self.conf = conf
        self.cls = cls

    @classmethod
    def from_detections(cls, detections: Sequence[Detection]) -> _ByteTrackInput:
        if not detections:
            empty = np.zeros((0, 4), dtype=np.float32)
            return cls(empty, np.zeros(0, dtype=np.float32), np.zeros(0, dtype=np.float32))
        boxes = np.asarray([d.bbox for d in detections], dtype=np.float32)
        xywh = np.stack(
            [
                (boxes[:, 0] + boxes[:, 2]) / 2,
                (boxes[:, 1] + boxes[:, 3]) / 2,
                boxes[:, 2] - boxes[:, 0],
                boxes[:, 3] - boxes[:, 1],
            ],
            axis=1,
        )
        return cls(
            xywh,
            np.asarray([d.confidence for d in detections], dtype=np.float32),
            np.asarray([d.class_id for d in detections], dtype=np.float32),
        )

    def __len__(self) -> int:
        return len(self.conf)

    def __getitem__(self, index) -> _ByteTrackInput:
        return _ByteTrackInput(self.xywh[index], self.conf[index], self.cls[index])


class ByteTrackTracker:
    """Ultralytics' ByteTrack, driven by *our* detections.

    ByteTrack's contribution is its second association pass: low-confidence
    boxes, which most trackers discard, are matched against tracks that failed
    the first pass. That is exactly the partially-occluded shopper this project
    cares about, and it is why D-005 proposed it.

    The wrapper exists because `BYTETracker.update()` is not a public, stable
    API. If it changes, this class breaks and `IoUTracker` keeps working — which
    is the whole point of there being two.
    """

    def __init__(self, camera: CameraConfig, config: TrackerConfig | None = None) -> None:
        self.camera = camera
        self.config = config or load_models_config().tracker
        self.fps = camera.fps if camera.fps > 0 else 25.0
        self._frames = 0
        self._seen_ids: set[int] = set()
        self._backend = self._build_backend()

    def _build_backend(self):
        try:
            from types import SimpleNamespace

            from ultralytics.trackers.byte_tracker import BYTETracker
        except ImportError as exc:  # pragma: no cover - environment failure
            raise TrackerError(
                f"the bytetrack backend needs ultralytics: {exc}. "
                "Use tracker.backend: iou in config/models.yaml to run without it."
            ) from exc

        # ByteTrack expresses its buffer in frames at a notional 30 fps and
        # rescales internally (`frame_rate / 30 * track_buffer`). Configuring in
        # seconds and converting here means a 25 fps and a 30 fps camera keep
        # the same physical memory instead of silently differing by 20%.
        args = SimpleNamespace(
            track_high_thresh=self.config.high_confidence,
            track_low_thresh=self.config.low_confidence,
            new_track_thresh=self.config.new_track_confidence,
            track_buffer=max(1, round(self.config.lost_track_seconds * 30)),
            match_thresh=self.config.match_thresh,
            fuse_score=self.config.fuse_score,
        )
        try:
            return BYTETracker(args, frame_rate=round(self.fps))
        except Exception as exc:
            raise TrackerError(
                f"could not construct Ultralytics BYTETracker: {exc}. This wrapper "
                "drives an API ultralytics does not promise to keep stable; "
                "tracker.backend: iou in config/models.yaml is the fallback."
            ) from exc

    def reset(self) -> None:
        self._backend = self._build_backend()
        self._frames = 0
        self._seen_ids.clear()

    @property
    def name(self) -> str:
        return f"bytetrack@{self.camera.camera_id}"

    def update(self, detections: Sequence[Detection], frame_index: int) -> list[Track]:
        self._frames += 1
        kept = [d for d in detections if d.confidence >= self.config.min_confidence]
        results = _ByteTrackInput.from_detections(kept)

        try:
            rows = self._backend.update(results)
        except Exception as exc:
            raise TrackerError(
                f"{self.name} failed on frame {frame_index}: {exc}"
            ) from exc

        timestamp = VideoFrame.timestamp_for(frame_index, self.fps)
        rows = np.asarray(rows, dtype=np.float64)
        if rows.size == 0:
            return []

        tracks: list[Track] = []
        for row in rows.reshape(len(rows), -1):
            # Ultralytics returns [x1, y1, x2, y2, track_id, score, cls, idx].
            # The trailing columns have moved between releases, so only the
            # leading six — the ones this project needs — are read positionally.
            x1, y1, x2, y2, track_id, score = (float(v) for v in row[:6])
            self._seen_ids.add(int(track_id))
            tracks.append(
                Track(
                    camera_id=self.camera.camera_id,
                    local_track_id=int(track_id),
                    bbox=(x1, y1, x2, y2),
                    confidence=score,
                    frame_index=frame_index,
                    timestamp=timestamp,
                )
            )
        return tracks

    def stats(self) -> dict[str, object]:
        return {
            "tracker": self.name,
            "frames": self._frames,
            "tracks_created": len(self._seen_ids),
            "tracks_alive": len(getattr(self._backend, "tracked_stracks", [])),
        }


# --------------------------------------------------------------------------- #
# Construction and streaming
# --------------------------------------------------------------------------- #

_BACKENDS = {"bytetrack": ByteTrackTracker, "iou": IoUTracker}


def build_tracker(camera: CameraConfig, config: TrackerConfig | None = None) -> Tracker:
    """Construct the configured tracker for one camera.

    One tracker per camera, always: `local_track_id` is only meaningful scoped
    to a camera, and sharing an instance between two would merge two people the
    moment their boxes happened to overlap in image space.
    """
    config = config or load_models_config().tracker
    backend = _BACKENDS.get(config.backend)
    if backend is None:
        raise TrackerError(
            f"unknown tracker backend {config.backend!r}; known: {sorted(_BACKENDS)}"
        )
    tracker = backend(camera, config)
    log.info(
        "tracker ready",
        extra={
            "tracker": tracker.name,
            "backend": config.backend,
            "fps": tracker.fps,
            "lost_track_seconds": config.lost_track_seconds,
        },
    )
    return tracker


def track_stream(
    tracker: Tracker,
    detected: Iterable[tuple[VideoFrame, Sequence[Detection]]],
) -> Iterator[tuple[VideoFrame, list[Track]]]:
    """Run a tracker over `Detector.detect_stream()` output.

    A thin generator rather than a class: the pipeline stage that owns the
    video, the detector and the tracker is Phase 27's business, and inventing an
    orchestrator here would put policy in the wrong module.
    """
    for frame, detections in detected:
        yield frame, tracker.update(detections, frame.frame_index)

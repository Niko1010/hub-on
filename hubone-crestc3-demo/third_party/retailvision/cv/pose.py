"""Pose estimation for employees. Phase 10.

Runs a keypoint model over **employee crops only**, on **sampled frames only**.
Both restrictions are load-bearing rather than optimisations:

- **Employees only**, because pose on every shopper would be surveillance of
  customers that this project has no reason to perform and no basis to justify.
  `docs/privacy.md` is the argument; this module is where it is enforced.
- **Sampled frames only**, because pose is the second heavy model in the
  pipeline and C-001 forbids two being resident at once on a 4 GiB card
  (D-004). It loads after the detector has been released, runs over a batch of
  stored crops, and unloads.

What comes out is **keypoints**, not conclusions. Turning positions into
observed states is `cv/activity.py`'s job, and keeping the two apart is what
allows thresholds to be retuned later without re-running the model over video —
the phase's second acceptance criterion.

A note on vocabulary, enforced in CI by `tests/test_language_guard.py`: nothing
here describes what a person was *achieving*. A wrist moved 40 pixels. That is
the entire claim.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Protocol, runtime_checkable

import numpy as np

from retailvision.config import project_root
from retailvision.evaluation.residency import note_load, note_release
from retailvision.utils.logging import get_logger

if TYPE_CHECKING:
    from pathlib import Path

__all__ = [
    "COCO_KEYPOINTS",
    "KEYPOINT_INDEX",
    "PoseError",
    "PoseEstimator",
    "PoseResult",
    "YoloPoseEstimator",
    "build_pose_estimator",
]

log = get_logger(__name__)

# The 17 COCO keypoints, in the order every COCO-trained pose model emits them.
# Named rather than indexed at call sites: `keypoints[9]` is unreadable and
# `keypoints[KEYPOINT_INDEX["left_wrist"]]` cannot be silently wrong.
COCO_KEYPOINTS = (
    "nose",
    "left_eye",
    "right_eye",
    "left_ear",
    "right_ear",
    "left_shoulder",
    "right_shoulder",
    "left_elbow",
    "right_elbow",
    "left_wrist",
    "right_wrist",
    "left_hip",
    "right_hip",
    "left_knee",
    "right_knee",
    "left_ankle",
    "right_ankle",
)
KEYPOINT_INDEX = {name: i for i, name in enumerate(COCO_KEYPOINTS)}


class PoseError(RuntimeError):
    """The pose model could not be built or run. Always names the model."""


@dataclass(slots=True)
class PoseResult:
    """One person's keypoints in one frame, in the crop's own pixel space.

    `confidence` is per keypoint. A model returns a position for an occluded
    wrist regardless — it has to return something — and the confidence is the
    only thing distinguishing "the wrist is there" from "the wrist is probably
    somewhere around there". Every consumer here is required to check it.
    """

    xy: np.ndarray  # (17, 2) float32, pixels within the crop
    confidence: np.ndarray  # (17,) float32
    crop_width: int
    crop_height: int

    def point(self, name: str, *, min_confidence: float = 0.0) -> tuple[float, float] | None:
        """One named keypoint, or None when the model is not confident enough.

        None rather than a low-confidence guess: a wrist position invented for
        an occluded arm would produce movement that never happened, and nothing
        downstream could tell it from the real thing.
        """
        index = KEYPOINT_INDEX.get(name)
        if index is None:
            raise PoseError(f"unknown keypoint {name!r}; expected one of {COCO_KEYPOINTS}")
        if float(self.confidence[index]) < min_confidence:
            return None
        return (float(self.xy[index][0]), float(self.xy[index][1]))

    def midpoint(
        self, left: str, right: str, *, min_confidence: float = 0.0
    ) -> tuple[float, float] | None:
        """The centre between a symmetric pair, when both are confident enough.

        Used for the shoulder and hip centres, which are far steadier than
        either side alone: a person turning sideways loses one shoulder to
        self-occlusion, and the midpoint of one shoulder is not a torso.
        """
        a = self.point(left, min_confidence=min_confidence)
        b = self.point(right, min_confidence=min_confidence)
        if a is None or b is None:
            return None
        return ((a[0] + b[0]) / 2.0, (a[1] + b[1]) / 2.0)

    @property
    def mean_confidence(self) -> float:
        return float(np.mean(self.confidence)) if self.confidence.size else 0.0

    def confident_keypoints(self, min_confidence: float) -> int:
        return int(np.sum(self.confidence >= min_confidence))

    def normalised(self, name: str, *, min_confidence: float = 0.0) -> tuple[float, float] | None:
        """A keypoint as a fraction of the crop, so scale cancels.

        A person 400 px tall at the front of the store and 90 px tall at the
        back move their wrist the same *distance in the world* but wildly
        different distances in pixels. Comparing raw pixel displacement across
        those two would make the near person look far busier — which is exactly
        the kind of artefact that turns into a false claim about a person.
        """
        point = self.point(name, min_confidence=min_confidence)
        if point is None or not self.crop_width or not self.crop_height:
            return None
        return (point[0] / self.crop_width, point[1] / self.crop_height)


@runtime_checkable
class PoseEstimator(Protocol):
    """Finds body keypoints in person crops.

    Implementations must:

    - accept a **batch** of crops, for the same reason the re-ID embedder does:
      per-crop calls waste most of the card.
    - return one `PoseResult` per crop, or None where no person was found —
      never a zero-filled result, which would read downstream as a person
      standing perfectly still at the origin.
    - be releasable, because this is the second heavy model in the pipeline and
      only one may be resident at a time (C-001).
    """

    def estimate(self, crops: list[np.ndarray]) -> list[PoseResult | None]:
        """Estimate poses for N crops, returning N results."""
        ...

    @property
    def keypoint_names(self) -> tuple[str, ...]:
        """The skeleton this estimator emits, in the order it emits it.

        Per-estimator rather than a module constant, because a model trained on
        a different skeleton would return a different set — and a consumer
        asking for `left_wrist` by name deserves an answer from the model that
        produced the numbers, not from a hard-coded list that happens to match
        today.
        """
        ...

    @property
    def name(self) -> str:
        """Identifier for logs and reports."""
        ...


class YoloPoseEstimator:
    """Ultralytics' YOLO-pose, driven over stored employee crops.

    Deliberately not run over whole frames. Running pose on a frame would
    estimate a pose for every person in it, including customers, and the model
    would be doing work this project has no basis to justify. Feeding it crops
    means the restriction is structural: a customer's pixels are never sent to
    it at all.
    """

    def __init__(
        self,
        weights: Path | str | None = None,
        *,
        device: str = "auto",
        min_confidence: float = 0.3,
        imgsz: int = 256,
    ) -> None:
        try:
            import torch
            from ultralytics import YOLO
        except ImportError as exc:  # pragma: no cover - environment failure
            raise PoseError(f"the pose backend is unavailable: {exc}") from exc

        from pathlib import Path as _Path

        from retailvision.config import ActivityConfig

        # The fallback is the declared default in config.py, not a second copy
        # of it (Phase 25).
        path = _Path(weights) if weights else _Path(ActivityConfig().weights)
        self.weights = path if path.is_absolute() else (project_root() / path).resolve()
        if not self.weights.exists():
            raise PoseError(
                f"pose weights not found: {self.weights}\n"
                "Fetch them with `python scripts/download_models.py --all`."
            )

        self._torch = torch
        self.device = (
            ("cuda" if torch.cuda.is_available() else "cpu") if device == "auto" else device
        )
        self.min_confidence = min_confidence
        self.imgsz = imgsz
        self._model = YOLO(str(self.weights))
        self._crops = 0
        self._found = 0

        note_load(self, "pose", self.name, self.device)

        log.info(
            "pose estimator ready",
            extra={
                "model": self.weights.name,
                "device": self.device,
                "imgsz": imgsz,
                "min_confidence": min_confidence,
            },
        )

    @property
    def keypoint_names(self) -> tuple[str, ...]:
        return COCO_KEYPOINTS

    @property
    def name(self) -> str:
        return f"{self.weights.stem}@{self.imgsz}/{self.device}"

    def estimate(self, crops: list[np.ndarray]) -> list[PoseResult | None]:
        if not crops:
            return []
        model = self._model
        if model is None:
            raise PoseError(f"{self.name} has been unloaded")

        results = model.predict(
            list(crops),
            imgsz=self.imgsz,
            conf=self.min_confidence,
            device=0 if self.device == "cuda" else "cpu",
            verbose=False,
        )

        out: list[PoseResult | None] = []
        for crop, result in zip(crops, results, strict=True):
            self._crops += 1
            keypoints = result.keypoints
            if keypoints is None or keypoints.xy is None or len(keypoints.xy) == 0:
                # No person found in a crop that a detector said was a person.
                # It happens — a heavily occluded or motion-blurred crop — and
                # None is the honest answer. A zero-filled result would read as
                # somebody standing perfectly still at the top-left corner.
                out.append(None)
                continue
            self._found += 1
            confidence = (
                keypoints.conf[0].cpu().numpy()
                if keypoints.conf is not None
                else np.zeros(len(COCO_KEYPOINTS), dtype=np.float32)
            )
            out.append(
                PoseResult(
                    xy=keypoints.xy[0].cpu().numpy().astype(np.float32),
                    confidence=confidence.astype(np.float32),
                    crop_width=crop.shape[1],
                    crop_height=crop.shape[0],
                )
            )
        return out

    def unload(self) -> None:
        """Release the model. Idempotent."""
        if getattr(self, "_model", None) is not None:
            self._model = None
        if getattr(self, "device", None) == "cuda":
            self._torch.cuda.empty_cache()
        note_release(self)

    def __enter__(self) -> YoloPoseEstimator:
        return self

    def __exit__(self, *exc_info: object) -> None:
        self.unload()

    def stats(self) -> dict[str, object]:
        return {
            "model": self.name,
            "crops": self._crops,
            "poses_found": self._found,
            "crops_without_a_pose": self._crops - self._found,
        }


def build_pose_estimator(**kwargs) -> PoseEstimator:
    """Construct the configured pose estimator."""
    return YoloPoseEstimator(**kwargs)

"""Person detection. Contract from Phase 01, implementation from Phase 04.

The `Detector` Protocol is the contract every later stage codes against; the
`YoloPersonDetector` below is the first thing to satisfy it.

What this module is careful about, and why:

- **Only people come out.** The pipeline treats every `Detection` as a person,
  so the class filter belongs here rather than at a dozen call sites, one of
  which will eventually forget.
- **Nothing is hard-coded.** Confidence, NMS IoU, input size, frame stride and
  the checkpoint itself come from `config/models.yaml` (C-001). Swapping the
  model is one line of YAML.
- **One heavy model at a time.** The GPU is a 4096 MiB RTX 3050 Laptop
  (DECISIONS.md D-004). The model loads once in `__init__`, never per frame,
  and `unload()` exists so a later phase can hand the card to the pose or re-ID
  model without holding two sets of weights resident.
- **Numbers are measured, not quoted.** `stats()` reports what this machine
  actually did. No published FPS figure appears anywhere in this project
  (C-016); `scripts/benchmark_detector.py` is where the real one comes from.

Why a Protocol rather than a base class: nothing here needs shared behaviour,
and structural typing lets a test supply a canned list of boxes without
importing Ultralytics or touching the GPU. That keeps the unit tests for
tracking, zones and analytics fast and CPU-only.
"""

from __future__ import annotations

import time
from collections.abc import Iterable, Iterator, Sequence
from typing import TYPE_CHECKING, Protocol, runtime_checkable

import numpy as np

from retailvision.config import DetectorConfig, load_app_config, load_models_config
from retailvision.evaluation.residency import note_load, note_release
from retailvision.schemas import Detection
from retailvision.utils.logging import get_logger

if TYPE_CHECKING:
    from pathlib import Path

    from retailvision.schemas import VideoFrame

__all__ = [
    "Detector",
    "DetectorError",
    "YoloPersonDetector",
    "build_detector",
    "detections_from_arrays",
    "resolve_device",
]

log = get_logger(__name__)


class DetectorError(RuntimeError):
    """The detector could not be built or run. Always says which model."""


@runtime_checkable
class Detector(Protocol):
    """Finds people in a single frame.

    Implementations must:

    - return only people. The pipeline treats every `Detection` as a person, so
      class filtering belongs here, not at the call sites.
    - apply their own confidence threshold and NMS, taking both from
      `config/models.yaml` rather than hard-coding them.
    - be safe to call repeatedly on one instance — the model is loaded once, in
      `__init__`, not per frame. On a 4 GiB card (D-004) reloading per call is
      the difference between running and thrashing.
    - return `[]` for a frame with no people, never None.
    """

    def detect(self, frame: np.ndarray) -> list[Detection]:
        """Detect people in one BGR image.

        `frame` is HxWx3 uint8 in OpenCV's BGR order — the order `cv2.imread`
        and `VideoCapture.read` produce. Implementations that need RGB convert
        internally; callers should not have to know.
        """
        ...

    @property
    def name(self) -> str:
        """Identifier for logs and the evaluation report, e.g. `yolov8n@640`.

        Phase 21 compares detectors, and a report that cannot say which model
        produced a number is not evidence.
        """
        ...


# --------------------------------------------------------------------------- #
# Pure helpers — no model, no GPU, unit-testable on their own
# --------------------------------------------------------------------------- #


def resolve_device(requested: str, *, cuda_available: bool) -> str:
    """Turn `config/models.yaml`'s `device` into a concrete `cuda` or `cpu`.

    `auto` follows `app.yaml`'s runtime device where it can and falls back to
    CPU where it cannot, because a laptop without a working driver should run
    slowly rather than not at all.

    An explicit `cuda` is different: someone wrote it down, so silently running
    on the CPU would turn a 30x slowdown into a mystery. That case raises.
    """
    requested = requested.lower()
    if requested == "cpu":
        return "cpu"
    if requested == "cuda":
        if not cuda_available:
            raise DetectorError(
                "config asks for device: cuda but torch reports no CUDA device. "
                "Run `python scripts/check_gpu.py` to diagnose, or set "
                "device: auto in config/models.yaml to allow a CPU fallback."
            )
        return "cuda"
    if requested != "auto":
        raise DetectorError(f"unknown device {requested!r}; expected auto, cuda or cpu")

    preferred = load_app_config().runtime.device
    if preferred == "cuda" and not cuda_available:
        log.warning(
            "CUDA unavailable - falling back to CPU. Detection will be far slower.",
            extra={"requested": "auto", "app_device": preferred},
        )
        return "cpu"
    return preferred


def detections_from_arrays(
    xyxy: Sequence[Sequence[float]],
    confidence: Sequence[float],
    class_ids: Sequence[float],
    *,
    person_class_id: int,
    max_detections: int,
) -> list[Detection]:
    """Convert one frame's raw model output into `Detection` objects.

    Kept free of any model or GPU so the filtering rules — which are the part
    that can quietly go wrong — are testable with three lists.

    Non-person classes are dropped here even though the model was already asked
    for one class: a custom checkpoint may not honour the request, and a bus
    tracked as a shopper would be very hard to notice downstream.

    `max_detections` truncates by descending confidence rather than by array
    order, so the cap keeps the best boxes rather than the first ones.
    """
    if not (len(xyxy) == len(confidence) == len(class_ids)):
        raise DetectorError(
            "model returned mismatched arrays: "
            f"{len(xyxy)} boxes, {len(confidence)} scores, {len(class_ids)} classes"
        )

    people = [
        Detection(
            bbox=(float(box[0]), float(box[1]), float(box[2]), float(box[3])),
            confidence=float(score),
            class_id=int(cls),
        )
        for box, score, cls in zip(xyxy, confidence, class_ids, strict=True)
        if int(cls) == person_class_id
    ]

    if len(people) > max_detections:
        people.sort(key=lambda d: d.confidence, reverse=True)
        log.warning(
            "frame exceeded max_detections - keeping the highest-confidence boxes",
            extra={"returned": len(people), "cap": max_detections},
        )
        return people[:max_detections]
    return people


# --------------------------------------------------------------------------- #
# The Ultralytics implementation
# --------------------------------------------------------------------------- #


class YoloPersonDetector:
    """A YOLO person detector, configured entirely from `config/models.yaml`.

    Use it as a context manager when the GPU is contended::

        with YoloPersonDetector() as detector:
            people = detector.detect(frame.image)

    Leaving the block releases the weights, which is the whole reason the
    context-manager form exists: two heavy models resident at once is the one
    thing a 4 GiB card cannot survive (D-004, C-001).
    """

    def __init__(self, config: DetectorConfig | None = None) -> None:
        self.config = config or load_models_config().detector

        if self.config.backend != "ultralytics":
            raise DetectorError(
                f"backend {self.config.backend!r} is not implemented; "
                "only 'ultralytics' exists today"
            )

        weights = self.config.resolved_weights()
        if not weights.exists():
            raise DetectorError(
                f"detector weights not found: {weights}\n"
                "Weights are not committed (they are large binaries). Fetch them "
                "with `python scripts/download_models.py`."
            )
        self.weights: Path = weights

        # Imported here, not at module scope: `import ultralytics` pulls in torch
        # and costs seconds, and every module that merely *type-checks* against
        # the Detector protocol would otherwise pay for it.
        try:
            import torch
            from ultralytics import YOLO
        except ImportError as exc:  # pragma: no cover - environment failure
            raise DetectorError(
                f"could not import the ultralytics backend: {exc}. "
                "Install it with `pip install -r requirements.txt`."
            ) from exc

        self._torch = torch
        self.device = resolve_device(
            self.config.device, cuda_available=torch.cuda.is_available()
        )
        # FP16 is a CUDA optimisation. On CPU it is emulated and slower, so the
        # config's `half: true` is honoured on the GPU and ignored off it.
        self.half = bool(self.config.half and self.device == "cuda")

        try:
            self._model = YOLO(str(weights))
        except Exception as exc:
            raise DetectorError(f"could not load {weights.name}: {exc}") from exc

        self._frames = 0
        self._detections = 0
        self._inference_seconds = 0.0

        if self.device == "cuda":
            torch.cuda.reset_peak_memory_stats()
        self.warmup()
        self._check_vram_budget()

        # Phase 22: announce the handle so a residency watcher can prove the
        # stage-by-stage discipline instead of inferring it from VRAM totals.
        # A no-op unless somebody is watching.
        note_load(self, "detector", self.name, self.device)

        log.info(
            "detector ready",
            extra={
                "model": self.name,
                "device": self.device,
                "half": self.half,
                "confidence": self.config.confidence,
                "iou": self.config.iou,
                "frame_stride": self.config.frame_stride,
            },
        )

    # -- lifecycle ---------------------------------------------------------- #

    def __enter__(self) -> YoloPersonDetector:
        return self

    def __exit__(self, *exc_info: object) -> None:
        self.unload()

    def unload(self) -> None:
        """Release the weights and the CUDA cache.

        Idempotent — calling it twice, or after a failed load, is safe, because
        a cleanup path that can itself fail is worse than no cleanup path.
        """
        model = getattr(self, "_model", None)
        if model is not None:
            self._model = None
            del model
        if getattr(self, "device", None) == "cuda":
            self._torch.cuda.empty_cache()
        note_release(self)

    def _require_model(self):
        if getattr(self, "_model", None) is None:
            raise DetectorError(
                f"{self.name} has been unloaded; build a new detector to run again"
            )
        return self._model

    def warmup(self, shape: tuple[int, int] | None = None, *, batch: int = 1) -> None:
        """Run and discard a few inferences so the first real frame is honest.

        The first call to a CUDA model pays for context creation, kernel
        autotuning, the FP16 conversion and memory-pool growth. Measured here,
        that cost was seconds, not milliseconds — enough to make the first frame
        look catastrophically slow and every average slightly wrong.

        `shape` is `(height, width)` of the frames that will actually be fed in,
        and `batch` how many will arrive per call. Both matter: cuDNN re-tunes
        when the input geometry *or* the batch dimension changes, so warming up
        at 640x640 batch 1 and then running 1280x720 batch 8 pays most of the
        cost again on the first real call. That was measured, not assumed — it
        showed up as a batch-4 run appearing three times slower than batch 1
        until the warmup matched the shape being timed.

        The pipeline should call this once it knows its camera resolution and
        batch size; the constructor's own call is a fallback for callers who
        never do.
        """
        if self.config.warmup_iterations <= 0:
            return
        if batch < 1:
            raise ValueError(f"warmup batch must be >= 1, got {batch}")
        height, width = shape or (self.config.imgsz, self.config.imgsz)
        blank = np.zeros((height, width, 3), dtype=np.uint8)
        for _ in range(self.config.warmup_iterations):
            self._predict([blank] * batch)
        # Warmup frames are not data. Counting them would understate the
        # detection rate and inflate the frame count in every later report.
        self._reset_counters()

    def _reset_counters(self) -> None:
        self._frames = 0
        self._detections = 0
        self._inference_seconds = 0.0

    def _check_vram_budget(self) -> None:
        """Warn if loading alone has already eaten the configured budget.

        A warning, not an error: the budget in `app.yaml` is a self-imposed
        ceiling for planning, and the useful behaviour when a model turns out
        larger than expected is a loud line in the run log — not a refusal that
        stops someone finding out how large it actually is.
        """
        if self.device != "cuda":
            return
        budget = load_app_config().runtime.vram_budget_mib
        peak = self.vram_peak_mib()
        if peak > budget:
            log.warning(
                "detector already exceeds the VRAM budget after warmup",
                extra={
                    "model": self.name,
                    "peak_mib": round(peak, 1),
                    "budget_mib": budget,
                },
            )

    # -- inference ---------------------------------------------------------- #

    def _predict(self, images: list[np.ndarray]):
        """One call into Ultralytics, with every knob taken from config."""
        model = self._require_model()
        return model.predict(
            images,
            imgsz=self.config.imgsz,
            conf=self.config.confidence,
            iou=self.config.iou,
            max_det=self.config.max_detections,
            classes=[self.config.person_class_id],
            device=0 if self.device == "cuda" else "cpu",
            half=self.half,
            verbose=False,
        )

    @staticmethod
    def _validate_frame(frame: np.ndarray) -> np.ndarray:
        if not isinstance(frame, np.ndarray):
            raise DetectorError(f"expected a numpy image, got {type(frame).__name__}")
        if frame.ndim != 3 or frame.shape[2] != 3:
            raise DetectorError(
                f"expected an HxWx3 BGR image, got shape {frame.shape}. "
                "Greyscale and RGBA frames must be converted by the caller."
            )
        if frame.dtype != np.uint8:
            raise DetectorError(
                f"expected a uint8 image, got {frame.dtype}. A float image would "
                "be rescaled silently and the boxes would be wrong."
            )
        return frame

    def detect(self, frame: np.ndarray) -> list[Detection]:
        """Detect people in one BGR image. Returns `[]` when there are none."""
        return self.detect_batch([frame])[0]

    def detect_batch(self, frames: Sequence[np.ndarray]) -> list[list[Detection]]:
        """Detect over several frames in one call.

        Batching amortises the per-call Python and launch overhead, which on a
        small model is a meaningful share of the time. Batch size is the
        caller's decision because it is the caller who knows how much of the
        card is already spoken for.
        """
        if not frames:
            return []
        images = [self._validate_frame(f) for f in frames]

        started = time.perf_counter()
        results = self._predict(images)
        if self.device == "cuda":
            # predict() returns once the copy back to host is queued; without
            # this the timing measures the launch, not the work.
            self._torch.cuda.synchronize()
        self._inference_seconds += time.perf_counter() - started

        batch: list[list[Detection]] = []
        for result in results:
            boxes = result.boxes
            if boxes is None or len(boxes) == 0:
                batch.append([])
                continue
            batch.append(
                detections_from_arrays(
                    boxes.xyxy.tolist(),
                    boxes.conf.tolist(),
                    boxes.cls.tolist(),
                    person_class_id=self.config.person_class_id,
                    max_detections=self.config.max_detections,
                )
            )

        self._frames += len(images)
        self._detections += sum(len(d) for d in batch)
        return batch

    def detect_stream(
        self, frames: Iterable[VideoFrame]
    ) -> Iterator[tuple[VideoFrame, list[Detection]]]:
        """Run over a `VideoStream`, honouring `frame_stride` and `batch`.

        Skipped frames are not yielded at all rather than yielded with an empty
        detection list: an empty list means "looked, found nobody", and a
        consumer cannot be expected to tell that apart from "did not look".

        **Frames are yielded in the order they arrived**, batching or not. That
        is not a nicety: the tracker downstream associates by time, so a
        reordered stream would not be slower or noisier, it would be wrong. A
        batch is therefore buffered, inferred in one call, and then handed on
        one pair at a time in the order it was filled.

        `batch: 1` restores the frame-at-a-time path exactly, which is what
        every phase before 22 measured against.
        """
        stride = self.config.frame_stride
        size = max(self.config.batch, 1)
        kept = (frame for position, frame in enumerate(frames) if not position % stride)

        if size == 1:
            for frame in kept:
                yield frame, self.detect(frame.image)
            return

        buffer: list[VideoFrame] = []
        for frame in kept:
            buffer.append(frame)
            if len(buffer) == size:
                yield from zip(buffer, self.detect_batch([f.image for f in buffer]), strict=True)
                buffer = []
        # The tail. A video whose frame count is not a multiple of the batch
        # would otherwise lose up to `batch - 1` frames off the end, silently,
        # and a run that quietly stops early is the hardest kind of wrong.
        if buffer:
            yield from zip(buffer, self.detect_batch([f.image for f in buffer]), strict=True)

    # -- reporting ---------------------------------------------------------- #

    @property
    def name(self) -> str:
        precision = "fp16" if self.half else "fp32"
        return f"{self.weights.stem}@{self.config.imgsz}/{self.device}/{precision}"

    def vram_peak_mib(self) -> float:
        """Peak CUDA memory this process has reserved, in MiB. 0.0 on CPU.

        Reserved rather than allocated: the caching allocator holds on to blocks
        it is not currently using, and that reserved figure is what actually
        competes with the display and any other model for the 4096 MiB.
        """
        if self.device != "cuda":
            return 0.0
        return self._torch.cuda.max_memory_reserved() / (1024 * 1024)

    def stats(self) -> dict[str, object]:
        """What this instance actually did — for the run log and Phase 21.

        Deliberately reports what happened over these frames on this machine.
        That is a narrower claim than "the system runs at N fps", and the
        narrower claim is the true one.
        """
        seconds = self._inference_seconds
        return {
            "model": self.name,
            "weights": str(self.weights),
            "device": self.device,
            "half": self.half,
            "frames": self._frames,
            "detections": self._detections,
            "inference_seconds": round(seconds, 4),
            "mean_ms_per_frame": (
                round(1000 * seconds / self._frames, 2) if self._frames else None
            ),
            "frames_per_second": (
                round(self._frames / seconds, 2) if seconds > 0 else None
            ),
            "vram_peak_mib": round(self.vram_peak_mib(), 1),
        }


def build_detector(config: DetectorConfig | None = None) -> Detector:
    """Construct the configured detector.

    The indirection is not ceremony: `config/models.yaml` names a backend, and
    callers should ask for "the detector" rather than for Ultralytics by name,
    so that a second backend is a change here and nowhere else.
    """
    config = config or load_models_config().detector
    if config.backend == "ultralytics":
        return YoloPersonDetector(config)
    raise DetectorError(f"unknown detector backend: {config.backend!r}")

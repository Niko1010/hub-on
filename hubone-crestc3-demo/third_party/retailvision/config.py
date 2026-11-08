"""Configuration loading for RetailVision.

The brief's rule is that nothing important is hard-coded in Python. This module
is the single door between `config/*.yaml` and the rest of the package: no other
module should call `yaml.safe_load` or reach for an environment variable.

Pydantic is used here (and deliberately *not* in `schemas.py` — see the note
there) because config is read once at startup, where validation cost is free and
a clear error beats a `KeyError` surfacing three stages later.

Modelled today: `app.yaml`, `aws.yaml` and `models.yaml` (Phase 04).
`cameras.yaml` is loaded by hand into schema objects rather than through
pydantic, because its output is the `CameraConfig` dataclass the hot path uses.
`zones.yaml`, `employees.yaml` and `pos.yaml` arrive with the phases that need
them (07, 09, 13) and get a model at that point. Inventing their shape now would
be guessing, and the generic `load_yaml` below covers the interim.
"""

from __future__ import annotations

import os
import re
from functools import lru_cache
from pathlib import Path
from typing import TYPE_CHECKING, Any, Literal

import yaml
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

if TYPE_CHECKING:
    # Annotation only — the runtime import stays inside load_cameras() so
    # importing config does not drag the schema module in with it.
    from retailvision.schemas import CameraConfig

__all__ = [
    "GPU_TOTAL_MIB",
    "ActivityConfig",
    "AnalyticsConfig",
    "AppConfig",
    "AwsConfig",
    "ConfigError",
    "DemographicsConfig",
    "DetectorConfig",
    "ModelsConfig",
    "POSMatchConfig",
    "PathsConfig",
    "ReIDConfig",
    "RuntimeConfig",
    "TrackerConfig",
    "analytics_config",
    "config_dir",
    "load_app_config",
    "load_aws_config",
    "load_cameras",
    "load_models_config",
    "load_pos_config",
    "load_yaml",
    "project_root",
]

# The card this project is pinned to (D-004). A hardware fact rather than a
# preference, so it is a constant rather than a config key — but it is declared
# HERE, once, because three modules used to carry their own copy of it and the
# benchmark's copy was the one the VRAM verdict trusted. Phase 25 found that: a
# literal repeated across modules is a config key that has not noticed yet.
GPU_TOTAL_MIB = 4096

# src/retailvision/config.py -> src/retailvision -> src -> <root>
_ROOT = Path(__file__).resolve().parents[2]


class ConfigError(RuntimeError):
    """Raised when configuration is missing, malformed, or self-contradictory."""


def project_root() -> Path:
    """Absolute path to the repository root.

    Overridable with `RETAILVISION_ROOT` so tests and the eventual container
    image are not tied to this file's position in the tree.
    """
    return Path(os.environ.get("RETAILVISION_ROOT", _ROOT)).resolve()


def config_dir() -> Path:
    return project_root() / "config"


def load_yaml(name: str) -> dict[str, Any]:
    """Read one file from `config/`, with errors that name the file.

    Accepts either `app` or `app.yaml`.
    """
    filename = name if name.endswith((".yaml", ".yml")) else f"{name}.yaml"
    path = config_dir() / filename
    if not path.exists():
        raise ConfigError(f"config file not found: {path}")
    try:
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        raise ConfigError(f"{path} is not valid YAML: {exc}") from exc
    if data is None:
        return {}
    if not isinstance(data, dict):
        raise ConfigError(f"{path} must contain a YAML mapping, got {type(data).__name__}")
    return data


# --------------------------------------------------------------------------- #
# app.yaml
# --------------------------------------------------------------------------- #


class _Strict(BaseModel):
    """Reject unknown keys.

    A silently-ignored typo in a config file is the exact failure mode that
    wastes an afternoon — `vram_budget_mb` where `vram_budget_mib` was meant
    should be an error, not a default.
    """

    model_config = ConfigDict(extra="forbid")


class PathsConfig(_Strict):
    # Phase 25 removed `data_dir` and `model_dir`: validated, never read. Model
    # paths are per-model keys in models.yaml, and a directory key beside them
    # invited an edit that would have moved nothing.
    video_dir: Path
    pos_dir: Path
    output_dir: Path
    log_dir: Path
    database: Path

    def resolved(self) -> PathsConfig:
        """Re-anchor the config's relative paths against the project root.

        Without this, every path would resolve against the process's working
        directory, so `python -m retailvision` would look in a different place
        depending on where it was launched from.
        """
        root = project_root()
        return PathsConfig(
            **{k: (root / v).resolve() for k, v in self.model_dump().items()}
        )


class RuntimeConfig(_Strict):
    device: Literal["cuda", "cpu"]
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"]
    vram_budget_mib: int = Field(gt=0)

    @field_validator("vram_budget_mib")
    @classmethod
    def _fits_the_gpu(cls, v: int) -> int:
        """Guard the 4 GiB ceiling recorded in DECISIONS.md D-004.

        The GPU is a 4096 MiB RTX 3050 Laptop. A budget at or above that is
        not a budget, so refuse it here rather than discovering it as an OOM
        thirty minutes into a run.
        """
        if v >= GPU_TOTAL_MIB:
            raise ValueError(
                f"vram_budget_mib={v} leaves nothing for the driver or display; "
                f"the GPU has {GPU_TOTAL_MIB} MiB total (DECISIONS.md D-004). "
                "Use <= 3500."
            )
        return v


class AnalyticsConfig(_Strict):
    """Policy about what the analytics refuse to say, not about how they say it.

    This exists because Phase 25 found the same threshold written twice — in
    `analytics/customer.py` and in `evaluation/analytics_metrics.py` — with a
    comment in the first saying it was "deliberately the same threshold" as the
    second. Nothing enforced that. Editing one would have left the reporting
    floor and the evaluation floor silently disagreeing about when a rate is
    allowed to exist, which is exactly the class of drift D-020 was written to
    prevent in the documents.
    """

    # Below this many samples, a rate is reported as None rather than as a
    # number. Deliberately arbitrary and obviously small: the point is to refuse
    # "100% accurate (n=2)", not to claim that 20 is a sufficient sample.
    min_samples_for_a_rate: int = Field(default=20, ge=1)


class AppConfig(_Strict):
    # No `project:` section since Phase 25: its `name` and `environment` were
    # validated and read by nothing.
    paths: PathsConfig
    runtime: RuntimeConfig
    analytics: AnalyticsConfig = Field(default_factory=AnalyticsConfig)

    def resolve_paths(self) -> AppConfig:
        return self.model_copy(update={"paths": self.paths.resolved()})


# --------------------------------------------------------------------------- #
# aws.yaml
# --------------------------------------------------------------------------- #


class _S3Config(BaseModel):
    model_config = ConfigDict(extra="allow")
    bucket: str | None = None
    prefixes: dict[str, str] = Field(default_factory=dict)


class _BudgetConfig(BaseModel):
    model_config = ConfigDict(extra="allow")
    monthly_limit_usd: float = 5.0
    alert_thresholds_percent: list[int] = Field(default_factory=lambda: [50, 80, 100])


class AwsConfig(BaseModel):
    """AWS settings. Never contains credentials — those live in `~/.aws`.

    `extra="allow"` here, unlike the app config: this file is edited by hand
    during the AWS bootstrap and an unrecognised key should not break a local
    CV run that does not touch AWS at all.
    """

    model_config = ConfigDict(extra="allow")

    region: str = "ap-south-1"
    project: str = "retailvision"
    environment: str = "prototype"
    # True while Phase 00.5-00.11 remain deferred (DECISIONS.md D-006).
    deferred: bool = False
    s3: _S3Config = Field(default_factory=_S3Config)
    tags: dict[str, str] = Field(default_factory=dict)
    budget: _BudgetConfig = Field(default_factory=_BudgetConfig)


# --------------------------------------------------------------------------- #
# Loaders
# --------------------------------------------------------------------------- #


def _validate(model: type[BaseModel], data: dict[str, Any], source: str):
    try:
        return model.model_validate(data)
    except Exception as exc:  # pydantic ValidationError, re-raised with the filename
        raise ConfigError(f"{source} is invalid:\n{exc}") from exc


@lru_cache(maxsize=1)
def load_app_config() -> AppConfig:
    """Load and validate `config/app.yaml`, with paths anchored to the root.

    Cached: config is immutable for the life of a process. Call
    `load_app_config.cache_clear()` in tests that write a different config.
    """
    cfg = _validate(AppConfig, load_yaml("app"), "config/app.yaml")
    return cfg.resolve_paths()


@lru_cache(maxsize=1)
def analytics_config() -> AnalyticsConfig:
    """The analytics policy, from `app.yaml`, falling back to its own defaults.

    Falls back rather than raising because this is read at import time by two
    modules, and a module that cannot be imported without a readable config file
    is a module that cannot be unit-tested without one. The fallback is the same
    declared default the file normally carries, so the two cannot disagree —
    which is the entire point of this function existing.
    """
    try:
        return load_app_config().analytics
    except (ConfigError, OSError):
        return AnalyticsConfig()


@lru_cache(maxsize=1)
def load_aws_config() -> AwsConfig:
    """Load `config/aws.yaml`. A missing file is not fatal while AWS is deferred."""
    try:
        data = load_yaml("aws")
    except ConfigError:
        return AwsConfig(deferred=True)
    return _validate(AwsConfig, data, "config/aws.yaml")


# --------------------------------------------------------------------------- #
# models.yaml
# --------------------------------------------------------------------------- #


class DetectorConfig(_Strict):
    """Everything the person detector needs, and nothing it may hard-code.

    Phase 04's acceptance is explicit that confidence, NMS and frame skipping
    are read from configuration. They are validated here so a typo surfaces at
    start-up rather than as an empty result set forty minutes into a run.
    """

    backend: Literal["ultralytics"] = "ultralytics"
    weights: Path
    imgsz: int = Field(default=640, gt=0)
    # Defaults equal the MEASURED values in models.yaml (D-023, D-025), and
    # `tests/test_config.py` fails the build if they drift apart. Until Phase 25
    # these were still 0.25 and 1, so a models.yaml that omitted either key
    # silently ran the configuration both phases had measured and rejected.
    confidence: float = Field(default=0.10, ge=0.0, le=1.0)
    iou: float = Field(default=0.45, ge=0.0, le=1.0)
    max_detections: int = Field(default=100, gt=0)
    person_class_id: int = Field(default=0, ge=0)
    half: bool = True
    device: Literal["auto", "cuda", "cpu"] = "auto"
    frame_stride: int = Field(default=1, ge=1)
    # Frames handed to the model per inference call. Phase 22 measured this as
    # the only lever with a real win and no cost anywhere else, and capped it
    # at 16: the win is flattening by 8 while the activation memory is still
    # growing, and a 4 GiB card should not be asked to hold more decoded frames
    # than the win justifies.
    batch: int = Field(default=8, ge=1, le=16)
    warmup_iterations: int = Field(default=3, ge=0)

    @field_validator("imgsz")
    @classmethod
    def _fits_the_card(cls, v: int) -> int:
        """Phase 04 caps inference resolution at 640 (C-001, D-004).

        Activation memory grows with the square of the input side, so 1280 on a
        4 GiB laptop card is how a run turns into an OOM. A larger input is a
        decision to be taken and recorded, not one to be typed into a YAML file
        by accident.
        """
        if v > 640:
            raise ValueError(
                f"imgsz={v} exceeds the 640 ceiling this phase works under. "
                "The GPU has 4096 MiB total (DECISIONS.md D-004); raising this "
                "needs a measurement and an ADR, not a config edit."
            )
        if v % 32:
            raise ValueError(
                f"imgsz={v} is not a multiple of 32. YOLO strides down by 32, so "
                "the model would silently pad to the next multiple and the "
                "recorded resolution would not be the one that ran."
            )
        return v

    @field_validator("weights")
    @classmethod
    def _is_a_permitted_scale(cls, v: Path) -> Path:
        """Keep the `l`/`x` scales out of a 4 GiB budget.

        Checked on the filename because that is all that exists before the file
        is downloaded. A custom checkpoint whose name matches nothing is allowed
        through — this guard exists to catch `yolo11x.pt` typed in optimism, not
        to police names it cannot reason about.
        """
        stem = v.stem.lower()
        if re.fullmatch(r"yolo(?:v)?\d+[lx](?:-\w+)?", stem):
            raise ValueError(
                f"{v.name} is an l/x-scale model. Phase 04 works at n/s scale "
                "under the 4096 MiB ceiling (DECISIONS.md D-004)."
            )
        return v

    def resolved_weights(self) -> Path:
        """Absolute path to the checkpoint, anchored to the project root."""
        weights = self.weights
        return weights if weights.is_absolute() else (project_root() / weights).resolve()


class TrackerConfig(_Strict):
    """Per-camera tracking settings. Phase 05.

    Buffers are expressed in seconds rather than frames on purpose: the
    underlying libraries count frames, which makes the same configuration mean
    different things on a 25 fps and a 30 fps camera. How long a person can be
    hidden and still be the same person is a question about the world.
    """

    backend: Literal["bytetrack", "iou"] = "bytetrack"
    min_confidence: float = Field(default=0.1, ge=0.0, le=1.0)
    high_confidence: float = Field(default=0.35, ge=0.0, le=1.0)
    low_confidence: float = Field(default=0.1, ge=0.0, le=1.0)
    new_track_confidence: float = Field(default=0.35, ge=0.0, le=1.0)
    lost_track_seconds: float = Field(default=1.2, gt=0.0)
    match_thresh: float = Field(default=0.8, ge=0.0, le=1.0)
    match_iou: float = Field(default=0.2, ge=0.0, le=1.0)
    fuse_score: bool = True
    min_hits: int = Field(default=2, ge=1)

    @model_validator(mode="after")
    def _thresholds_are_ordered(self) -> TrackerConfig:
        """ByteTrack's second pass needs a band to work in.

        With `low_confidence >= high_confidence` that band is empty, so the
        low-score association silently never runs and the tracker quietly
        degrades to an ordinary one — which looks like a tuning problem months
        later rather than the configuration error it is.
        """
        if self.low_confidence >= self.high_confidence:
            raise ValueError(
                f"low_confidence ({self.low_confidence}) must be below "
                f"high_confidence ({self.high_confidence}), or ByteTrack's "
                "second association pass has no detections to consider."
            )
        if self.min_confidence > self.low_confidence:
            raise ValueError(
                f"min_confidence ({self.min_confidence}) filters out detections "
                f"below low_confidence ({self.low_confidence}), so the low-score "
                "pass would never see them."
            )
        return self


class ReIDWeights(_Strict):
    """How much each matching term contributes. Phase 08.

    Not normalised to 1 by convention but by construction: `total` divides the
    weighted sum, so an edit that changes one weight cannot silently change the
    scale of every score and leave the threshold meaning something different.
    """

    appearance: float = Field(default=0.45, ge=0.0)
    time: float = Field(default=0.15, ge=0.0)
    spatial: float = Field(default=0.25, ge=0.0)
    transition: float = Field(default=0.10, ge=0.0)
    confidence: float = Field(default=0.05, ge=0.0)

    @property
    def total(self) -> float:
        return (
            self.appearance + self.time + self.spatial + self.transition + self.confidence
        )

    @model_validator(mode="after")
    def _at_least_one_weight(self) -> ReIDWeights:
        if self.total <= 0:
            raise ValueError("all re-ID weights are zero, so every score would be 0/0")
        return self


class ReIDConfig(_Strict):
    """Cross-camera re-identification settings. Phase 08.

    The threshold here is the one C-019 is about: it must come from a
    measurement, not from habit. D-014 records where this value came from and,
    just as importantly, what it is not — a probe of six identities is a
    starting value, not a settled operating point.
    """

    backend: Literal["onnx-osnet", "timm", "ultralytics"] = "onnx-osnet"
    # Read only by `onnx-osnet`. Was a path literal inside `cv/reid.py` until
    # Phase 25; every other model this project loads already had a config key.
    onnx_weights: Path = Path("models/osnet_x0_25_msmt17.onnx")
    samples_per_track: int = Field(default=8, ge=1)
    sample_stride: int = Field(default=12, ge=1)
    min_crop_confidence: float = Field(default=0.4, ge=0.0, le=1.0)
    min_crop_height: int = Field(default=48, ge=1)
    match_threshold: float = Field(default=0.55, ge=0.0, le=1.0)
    ambiguity_margin: float = Field(default=0.05, ge=0.0, le=1.0)
    max_gap_seconds: float = Field(default=120.0, gt=0.0)
    max_walk_speed_mps: float = Field(default=3.0, gt=0.0)
    overlap_tolerance_m: float = Field(default=1.5, gt=0.0)
    weights: ReIDWeights = Field(default_factory=ReIDWeights)

    @model_validator(mode="after")
    def _threshold_is_reachable(self) -> ReIDConfig:
        """A threshold no score can reach silently disables matching.

        With `transition` and `time` both capped at 1.0 and appearance rarely
        above 0.9, a threshold near 1.0 means every person becomes a new
        identity and the system looks like it is working while doing nothing.
        """
        if self.match_threshold >= 0.95:
            raise ValueError(
                f"match_threshold={self.match_threshold} is effectively unreachable; "
                "no cross-camera match would ever be made and every person would "
                "become a new identity."
            )
        if self.ambiguity_margin >= self.match_threshold:
            raise ValueError(
                f"ambiguity_margin ({self.ambiguity_margin}) is not smaller than "
                f"match_threshold ({self.match_threshold}), so every match would be "
                "reported ambiguous."
            )
        return self

    def resolved_onnx_weights(self) -> Path:
        """The OSNet graph, anchored to the project root."""
        weights = self.onnx_weights
        return weights if weights.is_absolute() else (project_root() / weights).resolve()


class ActivityConfig(_Strict):
    """Employee activity settings. Phase 10.

    Every value here decides how a movement is DESCRIBED, never what it
    achieved. The validators below guard the two ways this can go quietly
    wrong: a pose threshold so low that noise is described as posture, and a
    sampling rate so dense that pose runs on effectively every frame, which
    C-001 forbids on a 4 GiB card.
    """

    weights: Path = Path("models/yolo11n-pose.pt")
    imgsz: int = Field(default=256, gt=0)
    samples_per_track: int = Field(default=24, ge=1)
    sample_stride: int = Field(default=10, ge=1)
    min_pose_confidence: float = Field(default=0.35, ge=0.0, le=1.0)
    min_keypoint_confidence: float = Field(default=0.4, ge=0.0, le=1.0)
    min_confident_keypoints: int = Field(default=6, ge=1, le=17)
    customer_proximity_m: float = Field(default=1.2, gt=0.0)
    upper_body_movement: float = Field(default=0.05, ge=0.0)
    torso_movement: float = Field(default=0.04, ge=0.0)
    moving_speed_mps: float = Field(default=0.25, gt=0.0)

    @model_validator(mode="after")
    def _sampling_stays_sparse(self) -> ActivityConfig:
        """Pose must not become a per-frame model by configuration drift.

        `sample_stride: 1` would run the pose model on every frame of every
        employee track, which is precisely the co-residency and cost the phase
        is built to avoid. If that is genuinely wanted it needs an ADR and a
        measurement, not a one-character config edit.
        """
        if self.sample_stride < 2:
            raise ValueError(
                f"sample_stride={self.sample_stride} runs pose on effectively every "
                "frame. Phase 10 samples deliberately (C-001, D-004); raising this "
                "to every frame needs a measurement and an ADR."
            )
        return self

    def resolved_weights(self) -> Path:
        return (
            self.weights
            if self.weights.is_absolute()
            else (project_root() / self.weights).resolve()
        )


class DemographicsConfig(_Strict):
    """Optional demographic estimation. Phase 11.

    Shipped disabled after assessment, not by omission — see D-017 and
    `docs/benchmarks/demographics-assessment.md`. The validator below is the
    guard that matters: enabling the feature while no validated backend exists
    is allowed, because `none` answers UNKNOWN honestly, but selecting a backend
    that does not exist must fail loudly rather than silently produce nothing.
    """

    enabled: bool = False
    backend: Literal["none"] = "none"
    min_crop_height: int = Field(default=320, ge=1)
    min_confidence: float = Field(default=0.6, ge=0.0, le=1.0)


class ModelsConfig(_Strict):
    detector: DetectorConfig
    tracker: TrackerConfig = Field(default_factory=TrackerConfig)
    reid: ReIDConfig = Field(default_factory=ReIDConfig)
    activity: ActivityConfig = Field(default_factory=ActivityConfig)
    demographics: DemographicsConfig = Field(default_factory=DemographicsConfig)


class POSWeights(_Strict):
    time: float = Field(default=0.65, ge=0.0)
    presence: float = Field(default=0.25, ge=0.0)
    category: float = Field(default=0.10, ge=0.0)

    @property
    def total(self) -> float:
        return self.time + self.presence + self.category

    @model_validator(mode="after")
    def _timing_leads(self) -> POSWeights:
        """Timing must outweigh category, or dwell decides who paid.

        A shopper who lingered in Grocery is slightly more likely to have bought
        groceries; they are not therefore the person who paid. Letting the weak
        hint outrank the strong signal would attribute purchases by browsing
        habit, which is exactly the sort of plausible-looking wrong answer this
        project is built to avoid.
        """
        if self.total <= 0:
            raise ValueError("all POS matching weights are zero")
        if self.category >= self.time:
            raise ValueError(
                f"category weight ({self.category}) is not below the time weight "
                f"({self.time}); dwell would decide who paid rather than timing"
            )
        return self


class POSMatchConfig(_Strict):
    """When a transaction may be attributed to a person. Phase 14."""

    min_delay_seconds: float = 1.0
    max_delay_seconds: float = 35.0
    match_threshold: float = Field(default=0.45, ge=0.0, le=1.0)
    ambiguity_margin: float = Field(default=0.08, ge=0.0, le=1.0)
    weights: POSWeights = Field(default_factory=POSWeights)

    @model_validator(mode="after")
    def _window_is_ordered(self) -> POSMatchConfig:
        if self.max_delay_seconds <= self.min_delay_seconds:
            raise ValueError(
                f"max_delay_seconds ({self.max_delay_seconds}) must exceed "
                f"min_delay_seconds ({self.min_delay_seconds}), or no transaction "
                "can ever be feasible and everything reports UNMATCHED"
            )
        return self


@lru_cache(maxsize=1)
def load_pos_config() -> POSMatchConfig:
    """Load `config/pos.yaml`. Defaults apply if the file is absent."""
    try:
        data = load_yaml("pos")
    except ConfigError:
        return POSMatchConfig()
    return _validate(POSMatchConfig, data.get("matching", {}), "config/pos.yaml")


@lru_cache(maxsize=1)
def load_models_config() -> ModelsConfig:
    """Load and validate `config/models.yaml`.

    Cached like the app config; call `load_models_config.cache_clear()` in tests
    that write a different one.
    """
    return _validate(ModelsConfig, load_yaml("models"), "config/models.yaml")


# --------------------------------------------------------------------------- #
# cameras.yaml
# --------------------------------------------------------------------------- #


def load_cameras() -> tuple[list[CameraConfig], dict[str, float]]:
    """Load `config/cameras.yaml` into schema objects plus start offsets.

    Returns `(cameras, offsets)`. Video paths are resolved against the project
    root, so a run behaves the same whatever directory it was launched from.

    Duplicate camera ids are rejected rather than deduplicated: `local_track_id`
    is only meaningful when scoped to a unique `camera_id`, so two cameras
    sharing an id would silently merge two people into one.
    """
    from retailvision.schemas import CameraConfig  # local: keeps import cost off startup

    data = load_yaml("cameras")
    raw = data.get("cameras") or []
    if not raw:
        raise ConfigError("config/cameras.yaml defines no cameras")

    root = project_root()
    cameras: list[CameraConfig] = []
    seen: set[str] = set()

    for i, entry in enumerate(raw):
        missing = {"camera_id", "video_path"} - set(entry)
        if missing:
            raise ConfigError(
                f"config/cameras.yaml: camera #{i} is missing {sorted(missing)}"
            )
        camera_id = str(entry["camera_id"])
        if camera_id in seen:
            raise ConfigError(
                f"config/cameras.yaml: duplicate camera_id {camera_id!r}. Track ids "
                "are scoped per camera, so two cameras sharing an id would merge "
                "two different people into one."
            )
        seen.add(camera_id)

        cameras.append(
            CameraConfig(
                camera_id=camera_id,
                video_path=str((root / entry["video_path"]).resolve()),
                fps=float(entry.get("fps", 0.0)),
                width=int(entry.get("width", 0)),
                height=int(entry.get("height", 0)),
                neighbours={
                    str(k): float(v) for k, v in (entry.get("neighbours") or {}).items()
                },
            )
        )

    for camera in cameras:
        unknown = set(camera.neighbours) - seen
        if unknown:
            raise ConfigError(
                f"config/cameras.yaml: camera {camera.camera_id!r} lists unknown "
                f"neighbour(s) {sorted(unknown)}. A transition graph pointing at a "
                "camera that does not exist would silently never match."
            )

    offsets = {str(k): float(v) for k, v in (data.get("offsets") or {}).items()}
    unknown_offsets = set(offsets) - seen
    if unknown_offsets:
        raise ConfigError(
            f"config/cameras.yaml: offsets given for unknown camera(s) "
            f"{sorted(unknown_offsets)}"
        )

    return cameras, offsets

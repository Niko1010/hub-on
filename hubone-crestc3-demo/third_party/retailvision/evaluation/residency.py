"""Which models are holding the card, and when. Phase 22.

Phase 22's third success criterion is that models **load and release stage by
stage rather than sitting resident together**. On a 4096 MiB card that is the
difference between a pipeline that runs and one that dies half way (D-004,
C-001), so it deserves evidence rather than an assurance.

The obvious evidence is arithmetic, and it does not work. Sum what each stage
adds to VRAM, compare the total against the peak of a whole run, and call the
stages co-resident when the two are close. The first Phase 22 run did exactly
that and reported 72.0 MiB against a 74.0 MiB sum — 97%, which reads as damning
until you notice that both numbers are tens of megabytes on a four-gigabyte
card, that CUDA's caching allocator hands blocks back to the pool rather than
to the driver so "peak" never falls, and that a stage measured after another
stage starts life already holding its predecessor's residue. At that scale the
test is measuring the allocator, not the pipeline.

So measure the thing itself. Every model wrapper announces when it takes a
handle on weights and when it lets go, and this module records those
announcements in order with the VRAM held at each one. Co-residency then stops
being an inference from two totals and becomes a fact about a timeline: either
two models were live at the same instant or they were not.

Nothing here runs unless somebody is watching::

    from retailvision.evaluation.residency import watch

    with watch() as log:
        run_analysis(inputs)
    log.max_concurrent      # 1 if the discipline held
    log.overlaps()          # the pairs that were live together, if any

Outside a `watch()` block `note_load`/`note_release` are a single `is None`
check, which is why the wrappers can call them unconditionally.
"""

from __future__ import annotations

import time
from contextlib import contextmanager
from dataclasses import asdict, dataclass, field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from collections.abc import Iterator

__all__ = [
    "Residency",
    "ResidencyEvent",
    "held_vram_mib",
    "note_load",
    "note_release",
    "watch",
]


def held_vram_mib() -> float:
    """VRAM currently reserved on the device, or 0.0 where there is no device.

    Reserved rather than allocated on purpose: reserved is what the driver
    considers spoken for, and therefore what the *next* model has to fit
    alongside. Allocated would flatter every reading by ignoring the pool.
    """
    try:
        import torch
    except ImportError:  # pragma: no cover - torch is a hard dependency in practice
        return 0.0
    if not torch.cuda.is_available():
        return 0.0
    return torch.cuda.memory_reserved() / (1024 * 1024)


@dataclass(frozen=True, slots=True)
class ResidencyEvent:
    """One model taking or releasing a handle on weights."""

    stage: str
    model: str
    event: str  # "load" | "release"
    device: str
    seconds: float
    held_mib: float
    live: tuple[str, ...]

    @property
    def concurrent(self) -> int:
        return len(self.live)


@dataclass(slots=True)
class Residency:
    """The ordered record of one run's model loads and releases."""

    events: list[ResidencyEvent] = field(default_factory=list)
    _live: dict[int, tuple[str, str, str, float]] = field(default_factory=dict)
    _began: float = field(default_factory=time.perf_counter)

    # -- recording ---------------------------------------------------------- #

    def load(self, key: int, stage: str, model: str, device: str) -> None:
        self._live[key] = (stage, model, device, time.perf_counter())
        self._append(stage, model, "load", device)

    def release(self, key: int) -> None:
        # A release with no matching load is not an error worth raising: the
        # wrappers make `unload()` idempotent deliberately, so a second call is
        # normal rather than a bug. Recording it again would invent an event.
        #
        # The stage, model and device come from what was recorded at load time
        # rather than from the caller, so a release can never disagree with the
        # load it closes.
        if key not in self._live:
            return
        stage, model, device, _ = self._live.pop(key)
        self._append(stage, model, "release", device)

    def _append(self, stage: str, model: str, event: str, device: str) -> None:
        self.events.append(
            ResidencyEvent(
                stage=stage,
                model=model,
                event=event,
                device=device,
                seconds=round(time.perf_counter() - self._began, 4),
                held_mib=round(held_vram_mib(), 1),
                live=tuple(sorted(entry[0] for entry in self._live.values())),
            )
        )

    # -- reading ------------------------------------------------------------ #

    @property
    def max_concurrent(self) -> int:
        """The most models live at any one instant. 1 is the discipline holding.

        Zero when nothing was ever loaded — which is a distinct answer from 1,
        and the caller has to tell them apart rather than read an empty run as
        a pass.
        """
        return max((event.concurrent for event in self.events), default=0)

    @property
    def stages(self) -> tuple[str, ...]:
        """Stage names in the order they first loaded."""
        seen: list[str] = []
        for event in self.events:
            if event.event == "load" and event.stage not in seen:
                seen.append(event.stage)
        return tuple(seen)

    def overlaps(self) -> list[tuple[str, ...]]:
        """Every distinct set of stages that were live together.

        Empty when no two models were ever resident at the same moment. This is
        the evidence for criterion 3, and it is a list of counterexamples: a
        passing run returns nothing at all, which cannot be mistaken for a
        number that happened to come out favourably.
        """
        found: list[tuple[str, ...]] = []
        for event in self.events:
            if event.concurrent > 1 and event.live not in found:
                found.append(event.live)
        return found

    def peak_held_mib(self) -> float:
        return max((event.held_mib for event in self.events), default=0.0)

    def held_after_release(self) -> dict[str, float]:
        """What the card was still holding just after each stage let go.

        The column worth reading twice on a 4 GiB card: a stage that peaks high
        and gives the memory back is affordable, and one that holds is not,
        however fast it was.
        """
        return {
            event.stage: event.held_mib for event in self.events if event.event == "release"
        }

    def as_dict(self) -> dict[str, object]:
        return {
            "max_concurrent": self.max_concurrent,
            "stages": list(self.stages),
            "overlaps": [list(pair) for pair in self.overlaps()],
            "peak_held_mib": round(self.peak_held_mib(), 1),
            "held_after_release": {k: round(v, 1) for k, v in self.held_after_release().items()},
            "events": [asdict(event) | {"live": list(event.live)} for event in self.events],
        }


# --------------------------------------------------------------------------- #
# The hook the model wrappers call
# --------------------------------------------------------------------------- #

_watching: Residency | None = None


def note_load(owner: object, stage: str, model: str, device: str) -> None:
    """Record that `owner` now holds weights. A no-op unless somebody watches.

    `owner` is identified by `id()` rather than by name: two detectors of the
    same name can be alive at once, and that is precisely the case this exists
    to catch.
    """
    if _watching is None:
        return
    _watching.load(id(owner), stage, model, device)


def note_release(owner: object) -> None:
    """Record that `owner` has let go. A no-op unless somebody watches.

    Takes no stage or model name: they are read back from the load this closes,
    so a wrapper cannot release itself under a different name than it took.
    """
    if _watching is None:
        return
    _watching.release(id(owner))


@contextmanager
def watch() -> Iterator[Residency]:
    """Record model residency for the duration of the block.

    Not re-entrant on purpose: two overlapping watchers would each see half a
    timeline, and half a timeline is exactly the artefact that would make a
    co-resident pair look sequential.
    """
    global _watching
    if _watching is not None:
        raise RuntimeError("residency is already being watched; nesting would split the timeline")
    log = Residency()
    _watching = log
    try:
        yield log
    finally:
        _watching = None

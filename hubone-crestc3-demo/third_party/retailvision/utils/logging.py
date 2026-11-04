"""Structured logging for RetailVision.

Two sinks, deliberately different, because they have different readers:

- **Console** — human-readable, and quiet. A processing run touches tens of
  thousands of frames; anything logged per frame makes the console useless and
  hides the one line that mattered. Per-frame detail goes to DEBUG, which the
  console does not show by default.
- **File** — one JSON object per line (`logs/run-<run_id>.jsonl`). Machine
  readable, so a run can be analysed after the fact rather than by squinting at
  scrollback. This is what carries `run_id`, `camera`, `stage` and `duration_ms`.

The fields the brief asks a run to record — run_id, timestamp, camera, stage,
message, duration, warnings, errors — are all present on the file sink.

Phase 24 revisits this; the shape is settled here because every phase from 03
onward wants to log, and retrofitting structure is worse than starting with it.
"""

from __future__ import annotations

import json
import logging
import sys
import time
import uuid
from collections.abc import Iterator
from contextlib import contextmanager
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

__all__ = [
    "configure_logging",
    "current_run_id",
    "get_logger",
    "log_every",
    "new_run_id",
    "stage",
]

_LOGGER_ROOT = "retailvision"

# Set by configure_logging so log records can carry it without every call site
# having to thread it through.
_RUN_ID: str = "unconfigured"

# Attributes LogRecord always has; anything else was passed via `extra=` and is
# therefore structured context worth emitting.
_STANDARD_RECORD_KEYS = frozenset(
    logging.LogRecord("", 0, "", 0, "", (), None).__dict__
) | {"message", "asctime", "taskName"}


def new_run_id() -> str:
    """A short, sortable identifier for one processing run.

    Timestamp-prefixed so runs sort chronologically in a directory listing, with
    a random suffix so two runs started in the same second cannot collide.
    """
    stamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%S")
    return f"{stamp}-{uuid.uuid4().hex[:6]}"


def current_run_id() -> str:
    return _RUN_ID


class _JsonlFormatter(logging.Formatter):
    """One JSON object per line, with any `extra=` fields merged in."""

    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "timestamp": datetime.fromtimestamp(
                record.created, tz=UTC
            ).isoformat(),
            "run_id": getattr(record, "run_id", _RUN_ID),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        for key, value in record.__dict__.items():
            if key in _STANDARD_RECORD_KEYS or key in payload:
                continue
            payload[key] = value

        if record.exc_info:
            payload["error"] = self.formatException(record.exc_info)

        # default=str so a Path or an enum cannot take down the logger.
        return json.dumps(payload, default=str)


class _ConsoleFormatter(logging.Formatter):
    """Compact and skimmable. Structured context is appended only when present."""

    def format(self, record: logging.LogRecord) -> str:
        head = f"{self.formatTime(record, '%H:%M:%S')} {record.levelname:<7} {record.getMessage()}"

        bits = []
        for key in ("camera", "stage", "duration_ms"):
            value = getattr(record, key, None)
            if value is not None:
                bits.append(f"{key}={value}")
        if bits:
            head = f"{head}  [{' '.join(bits)}]"

        if record.exc_info:
            head = f"{head}\n{self.formatException(record.exc_info)}"
        return head


class _RunIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        if not hasattr(record, "run_id"):
            record.run_id = _RUN_ID
        return True


def configure_logging(
    log_dir: Path | str | None = None,
    *,
    run_id: str | None = None,
    console_level: int | str = logging.INFO,
    file_level: int | str = logging.DEBUG,
) -> str:
    """Set up the console and JSONL sinks. Returns the run id.

    Idempotent: calling it twice replaces the handlers rather than doubling every
    line, which is what happens if a module configures logging on import and the
    entry point does it again.
    """
    global _RUN_ID
    _RUN_ID = run_id or new_run_id()

    logger = logging.getLogger(_LOGGER_ROOT)
    for handler in list(logger.handlers):
        logger.removeHandler(handler)
        handler.close()

    # The root package logger passes everything through; the handlers decide.
    logger.setLevel(logging.DEBUG)
    logger.propagate = False
    logger.addFilter(_RunIdFilter())

    console = logging.StreamHandler(stream=sys.stderr)
    console.setLevel(console_level)
    console.setFormatter(_ConsoleFormatter())
    logger.addHandler(console)

    if log_dir is not None:
        directory = Path(log_dir)
        directory.mkdir(parents=True, exist_ok=True)
        file_handler = logging.FileHandler(
            directory / f"run-{_RUN_ID}.jsonl", encoding="utf-8"
        )
        file_handler.setLevel(file_level)
        file_handler.setFormatter(_JsonlFormatter())
        logger.addHandler(file_handler)

    return _RUN_ID


def get_logger(name: str) -> logging.Logger:
    """Logger for a module, always under the package root.

    `get_logger(__name__)` from inside the package returns that module's logger;
    a bare name is namespaced so it still inherits the handlers.
    """
    if name == _LOGGER_ROOT or name.startswith(f"{_LOGGER_ROOT}."):
        return logging.getLogger(name)
    return logging.getLogger(f"{_LOGGER_ROOT}.{name}")


@contextmanager
def stage(
    logger: logging.Logger,
    name: str,
    *,
    camera: str | None = None,
    level: int = logging.INFO,
    **context: Any,
) -> Iterator[dict[str, Any]]:
    """Time a pipeline stage and log how it ended.

        with stage(log, "detect", camera="cam01") as ctx:
            ctx["frames"] = run_detection()

    Logs `duration_ms` on the way out, whether the block succeeded or raised —
    a stage that fails after 40 seconds is exactly the one worth timing. The
    exception is logged at ERROR with its traceback and then re-raised; this
    records failures, it does not swallow them.
    """
    extra: dict[str, Any] = {"stage": name, **context}
    if camera is not None:
        extra["camera"] = camera

    started = time.perf_counter()
    payload: dict[str, Any] = {}
    try:
        yield payload
    except Exception:
        elapsed_ms = round((time.perf_counter() - started) * 1000, 1)
        logger.error(
            f"{name} failed",
            exc_info=True,
            extra={**extra, **payload, "duration_ms": elapsed_ms, "outcome": "error"},
        )
        raise
    else:
        elapsed_ms = round((time.perf_counter() - started) * 1000, 1)
        logger.log(
            level,
            f"{name} done",
            extra={**extra, **payload, "duration_ms": elapsed_ms, "outcome": "ok"},
        )


def log_every(n: int) -> _EveryN:
    """Rate-limit a hot-loop log line to one in every `n` calls.

        progress = log_every(500)
        for i, frame in enumerate(frames):
            if progress():
                log.info("processing", extra={"frame_index": i})

    Frame loops are the one place a well-meant log line silently costs more than
    the work it describes.
    """
    return _EveryN(n)


class _EveryN:
    __slots__ = ("_count", "_n")

    def __init__(self, n: int) -> None:
        if n < 1:
            raise ValueError(f"n must be >= 1, got {n}")
        self._n = n
        self._count = -1

    def __call__(self) -> bool:
        """True on the first call and every nth call thereafter."""
        self._count += 1
        return self._count % self._n == 0

"""Video decoding. Phase 03.

Turns a prerecorded file into a stream of `VideoFrame`, each carrying the camera
id, frame index, fps and a video-relative timestamp.

The rule that matters here, stated outright in the brief: **never let the system
clock stand in for video time.** Timestamps come from the frame index and fps
(`t = frame_index / fps`), so a run gives identical results today and next week,
and a processing pause does not open a hole in someone's dwell time.

Containers lie. fps is reported as 0 by some encoders, frame counts are estimates
rather than facts, and files truncate mid-stream. Everything here validates
rather than assumes, and says which file was wrong when it complains.
"""

from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING

import cv2

from retailvision.schemas import CameraConfig, VideoFrame
from retailvision.utils.logging import get_logger

if TYPE_CHECKING:
    import numpy as np

__all__ = ["VideoProbe", "VideoStream", "VideoStreamError", "probe_video"]

log = get_logger(__name__)


class VideoStreamError(RuntimeError):
    """A video could not be opened or read. Always names the file."""


@dataclass(slots=True, frozen=True)
class VideoProbe:
    """What the container claims about a file, before any frame is decoded.

    Deliberately separate from `VideoStream`: the synchroniser needs to compare
    several files cheaply, and opening every stream to do it would be wasteful.

    `frame_count` is what the container *reports*. For many encodings it is an
    estimate, so it is fine for a progress bar and must not be trusted as the
    authority on where a video ends. Decode until frames run out instead.
    """

    path: Path
    fps: float
    width: int
    height: int
    frame_count: int

    @property
    def duration_seconds(self) -> float:
        """Reported duration. Inherits `frame_count`'s unreliability."""
        return self.frame_count / self.fps if self.fps > 0 else 0.0

    @property
    def resolution(self) -> tuple[int, int]:
        return (self.width, self.height)


def probe_video(path: Path | str) -> VideoProbe:
    """Read a video's metadata without decoding it.

    Raises `VideoStreamError` if the file is missing or unopenable, rather than
    returning a zero-filled probe that would fail confusingly further down.
    """
    path = Path(path)
    if not path.exists():
        raise VideoStreamError(f"video not found: {path}")
    if path.is_dir():
        raise VideoStreamError(f"expected a video file, got a directory: {path}")

    capture = cv2.VideoCapture(str(path))
    try:
        if not capture.isOpened():
            # OpenCV also returns False for a codec it cannot handle, not just
            # for a corrupt file, so the message covers both.
            raise VideoStreamError(
                f"could not open video (missing codec, or the file is corrupt): {path}"
            )
        probe = VideoProbe(
            path=path,
            fps=float(capture.get(cv2.CAP_PROP_FPS)),
            width=int(capture.get(cv2.CAP_PROP_FRAME_WIDTH)),
            height=int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT)),
            frame_count=int(capture.get(cv2.CAP_PROP_FRAME_COUNT)),
        )
    finally:
        capture.release()

    if probe.fps <= 0:
        raise VideoStreamError(
            f"{path} reports fps={probe.fps}. Video timestamps are derived from "
            "fps, so every downstream dwell time would be wrong. Re-encode the "
            "file or set an explicit fps in config/cameras.yaml."
        )
    if probe.width <= 0 or probe.height <= 0:
        raise VideoStreamError(f"{path} reports a {probe.width}x{probe.height} frame size")

    return probe


class VideoStream:
    """Decodes one camera's video into `VideoFrame`s.

    Use as a context manager so the capture is always released::

        with VideoStream(camera) as stream:
            for frame in stream:
                ...

    `stride` skips frames: `stride=3` yields every third one. Frame *indices*
    stay absolute, so timestamps remain correct — skipping frames must not
    compress time, or a person who dwells 30 s would appear to dwell 10 s.
    """

    def __init__(
        self,
        camera: CameraConfig,
        *,
        stride: int = 1,
        fps_override: float | None = None,
    ) -> None:
        if stride < 1:
            raise ValueError(f"stride must be >= 1, got {stride}")

        self.camera = camera
        self.stride = stride
        self._capture: cv2.VideoCapture | None = None
        self._frames_read = 0
        self._frames_yielded = 0

        self.probe = probe_video(camera.video_path)
        # An explicit config fps beats the container's claim — that is the
        # documented escape hatch for a file whose metadata is wrong.
        self.fps = fps_override or self.probe.fps

        if camera.fps and abs(camera.fps - self.probe.fps) > 0.01:
            log.warning(
                "camera fps disagrees with the file",
                extra={
                    "camera": camera.camera_id,
                    "configured_fps": camera.fps,
                    "container_fps": self.probe.fps,
                    "using": self.fps,
                },
            )

    def __enter__(self) -> VideoStream:
        self.open()
        return self

    def __exit__(self, *exc_info: object) -> None:
        self.close()

    def open(self) -> None:
        if self._capture is not None:
            return
        capture = cv2.VideoCapture(str(self.camera.video_path))
        if not capture.isOpened():
            raise VideoStreamError(f"could not open video: {self.camera.video_path}")
        self._capture = capture

    def close(self) -> None:
        if self._capture is not None:
            self._capture.release()
            self._capture = None

    def __iter__(self) -> Iterator[VideoFrame]:
        return self.frames()

    def frames(self) -> Iterator[VideoFrame]:
        """Yield frames, honouring `stride`.

        Decoding stops when the file runs out, not when the container's reported
        frame count is reached — that count is an estimate, and trusting it
        truncates or over-runs the video.
        """
        if self._capture is None:
            raise VideoStreamError(
                "VideoStream is not open. Use it as a context manager, or call open()."
            )

        index = 0
        while True:
            ok, image = self._capture.read()
            if not ok:
                # Normal end of file, and also how a truncated file ends. There
                # is no way to tell them apart from here; the frame count
                # comparison in `summary()` is what surfaces a short read.
                break
            self._frames_read += 1

            if index % self.stride == 0:
                self._frames_yielded += 1
                yield VideoFrame(
                    camera_id=self.camera.camera_id,
                    frame_index=index,
                    # Absolute index over fps: skipping must not compress time.
                    timestamp=VideoFrame.timestamp_for(index, self.fps),
                    fps=self.fps,
                    image=image,
                )
            index += 1

    def read_frame(self, index: int) -> np.ndarray:
        """Decode one specific frame. For previews and homography setup.

        Seeking is approximate on many codecs — the decoder lands on the nearest
        keyframe — so this is fine for picking calibration points by eye and
        wrong for anything that must be frame-accurate.
        """
        if self._capture is None:
            raise VideoStreamError("VideoStream is not open.")
        if index < 0:
            raise ValueError(f"frame index must be >= 0, got {index}")

        self._capture.set(cv2.CAP_PROP_POS_FRAMES, index)
        ok, image = self._capture.read()
        if not ok:
            raise VideoStreamError(
                f"could not read frame {index} of {self.camera.video_path} "
                f"(reported frame count: {self.probe.frame_count})"
            )
        return image

    def summary(self) -> dict[str, object]:
        """What actually happened, for the run log.

        `short_read` is the useful field: the container promised N frames and
        decoding produced fewer, which is the signature of a truncated file.
        """
        expected = self.probe.frame_count
        return {
            "camera": self.camera.camera_id,
            "path": str(self.camera.video_path),
            "fps": self.fps,
            "resolution": f"{self.probe.width}x{self.probe.height}",
            "frames_read": self._frames_read,
            "frames_yielded": self._frames_yielded,
            "stride": self.stride,
            "reported_frame_count": expected,
            "short_read": bool(expected > 0 and self._frames_read < expected),
        }

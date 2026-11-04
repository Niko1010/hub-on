"""Windows/Linux USB and RTSP extension, never started in the cloud implicitly."""
from pathlib import Path
import time
import cv2


def capture_video(source: int | str, output: Path, duration: float = 15, fps: float = 15):
    """USB: source=0. RTSP: source='rtsp://…'. Output goes through the same file API."""
    cap = cv2.VideoCapture(source)
    writer = None
    try:
        if not cap.isOpened():
            raise RuntimeError('无法打开摄像头 / RTSP，请检查本地设备和权限。')
        started = time.monotonic()
        while time.monotonic() - started < duration:
            ok, frame = cap.read()
            if not ok:
                raise RuntimeError('视频源断开。')
            if writer is None:
                writer = cv2.VideoWriter(str(output),cv2.VideoWriter_fourcc(*'mp4v'),fps,
                                         (frame.shape[1],frame.shape[0]))
                if not writer.isOpened():
                    raise RuntimeError('无法写入视频。')
            writer.write(frame)
            time.sleep(1/fps)
    finally:
        cap.release()
        if writer:
            writer.release()

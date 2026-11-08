"""Bounded RTSP decoder process; credentials never enter argv or returned state."""
import multiprocessing as mp
import os
import queue
import time
from datetime import datetime, timezone
from urllib.parse import quote
from pathlib import Path

from dotenv import dotenv_values


LOCAL_ENV = Path(__file__).resolve().parents[1] / '.env.local'


def read_configuration():
    # Existing dotenv dependency; never execute file contents or interpolate secrets.
    local = dotenv_values(LOCAL_ENV, interpolate=False) if LOCAL_ENV.is_file() else {}
    defaults = {'HUBONE_RTSP_HOST': '192.168.1.108', 'HUBONE_RTSP_PORT': '554',
                'HUBONE_RTSP_PATH': '/cam/realmonitor?channel=1&subtype=1',
                'HUBONE_RTSP_USERNAME': '', 'HUBONE_RTSP_PASSWORD': ''}
    return {key: os.getenv(key) or local.get(key) or default for key, default in defaults.items()}


def configured():
    try:
        config = read_configuration()
        return bool(config['HUBONE_RTSP_USERNAME'] and config['HUBONE_RTSP_PASSWORD']
                    and 0 < int(config['HUBONE_RTSP_PORT']) < 65536)
    except (OSError, ValueError):
        return False


def _latest(channel, value):
    try:
        channel.put_nowait(value)
    except queue.Full:
        try:
            channel.get_nowait()
        except queue.Empty:
            return
        try:
            channel.put_nowait(value)
        except queue.Full:
            pass


def _decode(channel, stopped):
    # OpenCV/FFmpeg native errors can contain the URL. Suppress native output in
    # this isolated process before importing the decoder; publish only safe codes.
    with open(os.devnull, 'w') as null:
        os.dup2(null.fileno(), 2)
        os.dup2(null.fileno(), 1)
    import cv2
    cv2.setLogLevel(0)
    os.environ['OPENCV_FFMPEG_CAPTURE_OPTIONS'] = 'rtsp_transport;tcp'
    config = read_configuration()
    user = quote(config['HUBONE_RTSP_USERNAME'], safe='')
    password = quote(config['HUBONE_RTSP_PASSWORD'], safe='')
    host = config['HUBONE_RTSP_HOST']
    port = int(config['HUBONE_RTSP_PORT'])
    path = config['HUBONE_RTSP_PATH']
    url = f'rtsp://{user}:{password}@{host}:{port}{path}'
    index, epoch, failures = 0, 0, 0
    channel.cancel_join_thread()
    try:
        while not stopped.is_set():
            cap = None
            try:
                cap = cv2.VideoCapture(url, cv2.CAP_FFMPEG, [
                    cv2.CAP_PROP_OPEN_TIMEOUT_MSEC, 5000,
                    cv2.CAP_PROP_READ_TIMEOUT_MSEC, 3000])
                if not cap.isOpened():
                    raise RuntimeError('connect_failed')
                epoch += 1
                window_start, window_frames, source_fps = time.monotonic(), 0, None
                reported = cap.get(cv2.CAP_PROP_FPS)
                while not stopped.is_set():
                    read_started = time.perf_counter()
                    ok, frame = cap.read()
                    # Wall time includes network/buffering wait and decode, not codec-only time.
                    rtsp_read_ms = (time.perf_counter()-read_started)*1000
                    if not ok:
                        raise RuntimeError('read_failed')
                    now = time.monotonic()
                    index += 1
                    window_frames += 1
                    if now-window_start >= 1:
                        source_fps = window_frames/(now-window_start)
                        window_start, window_frames = now, 0
                    failures = 0
                    _latest(channel, {'kind':'frame', 'frame':frame, 'frame_index':index,
                        'connection_epoch':epoch, 'captured_monotonic':now,
                        'rtsp_read_ms':rtsp_read_ms,
                        'captured_at':datetime.now(timezone.utc).isoformat(),
                        'source_fps':source_fps, 'reported_fps':reported if 0 < reported < 240 else None})
            except Exception:
                failures += 1
                _latest(channel, {'kind':'disconnected', 'error':'RTSP_CONNECTION_LOST',
                                  'reconnect_attempt':failures})
            finally:
                if cap is not None:
                    cap.release()
            stopped.wait(min(15, 2**min(failures, 4)))
    finally:
        channel.close()


class LatestRTSP:
    def __init__(self):
        if not configured():
            raise ValueError('RTSP credentials are not configured')
        context = mp.get_context('spawn')
        self.channel = context.Queue(maxsize=1)
        self.stopped = context.Event()
        self.process = context.Process(target=_decode, args=(self.channel,self.stopped), daemon=True)
        self.process.start()

    def read(self, timeout=1):
        try:
            return self.channel.get(timeout=timeout)
        except queue.Empty:
            if not self.process.is_alive():
                return {'kind':'error','error':'DECODER_PROCESS_STOPPED'}
            return None

    def close(self):
        self.stopped.set()
        self.process.join(timeout=4)
        if self.process.is_alive():
            self.process.terminate()
            self.process.join(timeout=3)
        self.channel.close()
        self.channel.cancel_join_thread()

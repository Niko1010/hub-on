"""Reproducible, unthrottled recording benchmark; never opens RTSP or production DB.

Use the same video/weights/frames/stride/profile for CPU and CUDA. All output
artifacts and the isolated Store live beneath --output, which must be new.
"""
from __future__ import annotations

import argparse
import csv
from datetime import datetime, timezone
import hashlib
import importlib.metadata
import json
from pathlib import Path
import statistics
import subprocess
import sys
import threading
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / 'third_party'))


def sha256_file(path):
    digest = hashlib.sha256()
    with path.open('rb') as source:
        for block in iter(lambda: source.read(1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest()


def percentile(values, fraction):
    values = sorted(values)
    at = (len(values) - 1) * fraction
    low = int(at)
    high = min(low + 1, len(values) - 1)
    return values[low] + (values[high] - values[low]) * (at - low)


class ResourceSampler:
    """Low-rate samples; GPU values are whole-device, not process attribution."""
    def __init__(self):
        import psutil
        self.psutil = psutil
        self.process = psutil.Process()
        self.rows = []
        self.stop = threading.Event()
        self.thread = threading.Thread(target=self.run, daemon=True)

    def run(self):
        self.psutil.cpu_percent()
        self.process.cpu_percent()
        while not self.stop.is_set():
            row = {'monotonic': time.perf_counter(),
                   'process_cpu_percent': self.process.cpu_percent(),
                   'system_cpu_percent': self.psutil.cpu_percent(),
                   'process_rss_mb': self.process.memory_info().rss / 1048576}
            try:
                result = subprocess.run(['nvidia-smi', '--query-gpu=utilization.gpu,memory.used',
                    '--format=csv,noheader,nounits'], capture_output=True, text=True,
                    timeout=1, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
                values = result.stdout.strip().splitlines()[0].split(',')
                row.update(gpu_utilization_percent=float(values[0]), gpu_memory_mb=float(values[1]))
            except (OSError, subprocess.SubprocessError, IndexError, ValueError):
                row.update(gpu_utilization_percent=None, gpu_memory_mb=None)
            self.rows.append(row)
            self.stop.wait(1)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--video', type=Path, required=True)
    parser.add_argument('--weights', type=Path, default=ROOT / 'models/yolo11n-pose.pt')
    parser.add_argument('--device', choices=['cpu', 'cuda'], required=True)
    parser.add_argument('--frames', type=int, default=120)
    parser.add_argument('--stride', type=int, default=4)
    parser.add_argument('--warmup', type=int, default=5)
    parser.add_argument('--threads', type=int, default=2)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if min(args.frames, args.stride, args.warmup, args.threads) < 1:
        parser.error('frames, stride, warmup and threads must be positive')
    video, weights, output = args.video.resolve(), args.weights.resolve(), args.output.resolve()
    if not video.is_file() or not weights.is_file():
        parser.error('Existing local video and model weights are required; no downloads are performed')
    if output.exists():
        parser.error('Output directory must not exist; refusing to overwrite any previous data')
    if output.is_relative_to(ROOT / 'runtime'):
        parser.error('Output must be isolated from the production runtime')

    import cv2
    import psutil
    import torch
    from backend.models import Session
    from database.store import Store
    from vision.live import LiveStore
    from retailvision.config import DetectorConfig, TrackerConfig
    from retailvision.cv.detector import YoloPersonDetector
    from retailvision.cv.tracker import IoUTracker
    from retailvision.schemas import CameraConfig

    if args.device == 'cuda' and not torch.cuda.is_available():
        raise RuntimeError('CUDA was requested but is unavailable; no CPU fallback performed')
    torch.set_num_threads(args.threads)
    video_sha, weights_sha = sha256_file(video), sha256_file(weights)
    capture = cv2.VideoCapture(str(video))
    if not capture.isOpened():
        raise RuntimeError('Recording could not be decoded')
    width, height = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH)), int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    source_fps = float(capture.get(cv2.CAP_PROP_FPS))
    if source_fps <= 0:
        raise RuntimeError('Recording FPS is missing')
    warmup_frames = []
    for index in range((args.warmup - 1) * args.stride + 1):
        ok, frame = capture.read()
        if not ok:
            raise RuntimeError('Recording is shorter than the warmup selection')
        if index % args.stride == 0:
            warmup_frames.append(frame)
    capture.release()
    detector = None
    sampler = ResourceSampler()
    output.mkdir(parents=True)
    frame_directory = output / 'frames'
    frame_directory.mkdir()
    store = Store(output / 'isolated-runtime')
    live_store = LiveStore(store)
    session = Session(name='Isolated recording benchmark', product='P0 vision benchmark', simulated=False)
    store.create_session(session)
    state = {'session_id': session.session_id, 'source_mode': 'REAL_RECORDING_BENCHMARK',
             'source_type': 'LOCAL_MP4', 'status': 'BENCHMARK', 'simulated': False,
             'coordinate_system': 'IMAGE_PIXELS', 'floor_id': None, 'latest_observation': None}
    live_store.save(state)
    sync = (lambda: torch.cuda.synchronize()) if args.device == 'cuda' else (lambda: None)
    rows, selected_hash = [], hashlib.sha256()
    try:
        started = time.perf_counter()
        detector = YoloPersonDetector(DetectorConfig(weights=weights, device=args.device,
            half=False, imgsz=480, batch=1, warmup_iterations=0, confidence=.35))
        sync()
        cold_load_seconds = time.perf_counter() - started
        loaded_device = str(next(detector._model.model.parameters()).device)
        warmup_ms = []
        threads_after_initial_predict = None
        for frame in warmup_frames:
            sync(); started = time.perf_counter()
            detector.detect(frame)
            sync(); warmup_ms.append((time.perf_counter() - started) * 1000)
            if threads_after_initial_predict is None:
                threads_after_initial_predict = torch.get_num_threads()
            # Ultralytics select_device resets CPU threads on the first predict.
            torch.set_num_threads(args.threads)
        actual_device = str(next(detector._model.model.parameters()).device)
        actual_dtype = str(next(detector._model.model.parameters()).dtype)
        assert actual_device.startswith(args.device) and actual_dtype == 'torch.float32'
        actual_threads = torch.get_num_threads()
        assert actual_threads == args.threads
        if args.device == 'cuda':
            torch.cuda.reset_peak_memory_stats()
        tracker = IoUTracker(CameraConfig(camera_id='BENCHMARK-01', video_path=str(video),
            fps=source_fps / args.stride, width=width, height=height),
            TrackerConfig(backend='iou', min_hits=1, match_iou=.15))
        capture = cv2.VideoCapture(str(video))
        process = psutil.Process()
        cpu_before = process.cpu_times()
        sampler.thread.start()
        pipeline_start = time.perf_counter()
        source_frames_read = 0
        pending_decode_ms = 0.0
        sample_index = 0
        while sample_index < args.frames:
            started = time.perf_counter()
            ok, frame = capture.read()
            pending_decode_ms += (time.perf_counter() - started) * 1000
            if not ok:
                raise RuntimeError('Recording ended before the fixed benchmark frame count')
            source_index = source_frames_read
            source_frames_read += 1
            if source_index % args.stride:
                continue
            row = {'sample_index': sample_index, 'source_frame_index': source_index,
                   'media_time_s': source_index / source_fps, 'decode_read_ms': pending_decode_ms}
            pending_decode_ms = 0.0
            selected_hash.update(source_index.to_bytes(8, 'little'))
            selected_hash.update(frame.tobytes())
            sync(); started = time.perf_counter()
            detections = detector.detect(frame)
            sync(); row['yolo_wall_ms'] = (time.perf_counter() - started) * 1000
            started = time.perf_counter()
            tracks = tracker.update(detections, sample_index)
            row['tracking_ms'] = (time.perf_counter() - started) * 1000
            started = time.perf_counter()
            ok, jpeg = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 82])
            if not ok:
                raise RuntimeError('JPEG encoding failed')
            row['jpeg_encode_ms'] = (time.perf_counter() - started) * 1000
            started = time.perf_counter()
            filename = f'{source_index:012d}.jpg'
            (frame_directory / filename).write_bytes(jpeg.tobytes())
            row['jpeg_write_ms'] = (time.perf_counter() - started) * 1000
            started = time.perf_counter()
            observation = {'session_id':session.session_id, 'camera_id':'BENCHMARK-01',
                'source_type':'LOCAL_MP4', 'source_mode':'REAL_RECORDING_BENCHMARK',
                'simulated':False, 'frame_index':source_index, 'timestamp':source_index/source_fps,
                'captured_at':None, 'width':width, 'height':height, 'coordinate_system':'IMAGE_PIXELS',
                'floor_id':None, 'tracks':[{'track_id':str(t.local_track_id), 'bbox':list(map(float,t.bbox)),
                    'confidence':float(t.confidence), 'footpoint':[(t.bbox[0]+t.bbox[2])/2,t.bbox[3]]} for t in tracks],
                'snapshot':filename, 'event_ids':[]}
            row['observation_build_ms'] = (time.perf_counter() - started) * 1000
            started = time.perf_counter()
            live_store.append(observation)
            state['latest_observation'] = observation
            live_store.save(state)
            row['sqlite_write_ms'] = (time.perf_counter() - started) * 1000
            row.update(detections=len(detections), tracks=len(tracks), jpeg_bytes=int(jpeg.nbytes))
            rows.append(row)
            sample_index += 1
        sync()
        pipeline_seconds = time.perf_counter() - pipeline_start
        cpu_after = process.cpu_times()
        gpu_memory = {'allocated_peak_mb':torch.cuda.max_memory_allocated()/1048576,
                      'reserved_peak_mb':torch.cuda.max_memory_reserved()/1048576} if args.device=='cuda' else None
        sampler.stop.set(); sampler.thread.join(timeout=3)
        stages = {key:{'mean_ms':statistics.mean(r[key] for r in rows),
                       'p50_ms':percentile([r[key] for r in rows],.5),
                       'p95_ms':percentile([r[key] for r in rows],.95),
                       'total_ms':sum(r[key] for r in rows)} for key in rows[0] if key.endswith('_ms')}
        report = {'benchmark_version':1, 'created_at':datetime.now(timezone.utc).isoformat(),
            'video':str(video), 'video_sha256':video_sha, 'weights':str(weights), 'weights_sha256':weights_sha,
            'selected_frames_sha256':selected_hash.hexdigest(), 'frame_indices':[r['source_frame_index'] for r in rows],
            'requested_device':args.device, 'actual_parameter_device':actual_device,
            'parameter_device_immediately_after_constructor':loaded_device, 'parameter_dtype':actual_dtype,
            'runtime':{'python':sys.version.split()[0], 'torch':torch.__version__, 'torch_cuda':torch.version.cuda,
                'ultralytics':importlib.metadata.version('ultralytics'), 'opencv':cv2.__version__,
                'gpu_name':torch.cuda.get_device_name(0) if args.device=='cuda' else None},
            'profile':{'imgsz':480,'confidence':.35,'half':False,'batch':1,'threads':args.threads,
                'actual_torch_threads':actual_threads,'threads_after_initial_predict':threads_after_initial_predict,
                'stride':args.stride,'frames':args.frames,'warmup_frames':args.warmup,'sampling_limit':None,
                'nms_iou':detector.config.iou,'tracker_match_iou':.15,'jpeg_quality':82},
            'source':{'width':width,'height':height,'metadata_fps':source_fps,'decoded_frames':source_frames_read},
            'cold_load_seconds':cold_load_seconds, 'warmup_ms':warmup_ms, 'stages':stages,
            'pipeline_seconds':pipeline_seconds, 'pipeline_fps':len(rows)/pipeline_seconds,
            'yolo_stage_fps':len(rows)/(stages['yolo_wall_ms']['total_ms']/1000),
            'unattributed_overhead_ms':pipeline_seconds*1000-sum(s['total_ms'] for s in stages.values()),
            'detections':sum(r['detections'] for r in rows),'track_observations':sum(r['tracks'] for r in rows),
            'resources':{'process_cpu_average_percent':100*((cpu_after.user+cpu_after.system)-(cpu_before.user+cpu_before.system))/pipeline_seconds,
                'gpu_process_memory':gpu_memory,'samples':sampler.rows,'gpu_sample_scope':'whole_device_not_process'},
            'isolated_database':str(store.path),'session_id':session.session_id,
            'limits':['Local MP4 read/decode is not RTSP latency or sustained live-camera performance.',
                'YOLO wall time includes preprocessing, postprocessing, NMS, tensor copies and CUDA synchronization; not pure network kernel time.',
                'Pipeline FPS includes stride-frame decoding, tracking, JPEG encoding/writes, Observation construction and SQLite append+state save, plus hashes/monitor overhead.',
                'No Event-rule execution, API transport, browser rendering, real-time sampling throttle or network reconnection is measured.',
                'Warmup uses the first five selected real frames and is excluded. Model construction is reported separately; first warmup includes lazy predictor/device initialization.',
                'Requested Torch CPU threads are restored after every warmup prediction because Ultralytics may reset them during first-predict initialization. Tracker lazy-import startup remains included in measured tracking.',
                'Filesystem cache is uncontrolled; before timing the source and weights are hashed. No fsync is forced; write times reflect normal buffered file writes.',
                'GPU utilization and nvidia-smi memory include other applications. Only Torch peak allocated/reserved memory is process-local.']}
        (output/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
        with (output/'frames.csv').open('w',newline='',encoding='utf-8') as stream:
            writer=csv.DictWriter(stream,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
        print(json.dumps({k:report[k] for k in ['requested_device','actual_parameter_device','pipeline_fps','yolo_stage_fps','detections','track_observations','selected_frames_sha256']},ensure_ascii=False))
    finally:
        capture.release()
        sampler.stop.set()
        if sampler.thread.is_alive():sampler.thread.join(timeout=3)
        if detector:detector.unload()


if __name__ == '__main__':
    main()

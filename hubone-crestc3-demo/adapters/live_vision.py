"""LIVE-only single-pass detection and pose over the existing YOLO and IoU stack."""
import gc
import math
import os

from backend.config import CapabilityError, configured_path
from retailvision.config import ActivityConfig, DetectorConfig, TrackerConfig
from retailvision.cv.detector import YoloPersonDetector
from retailvision.cv.tracker import IoUTracker
from retailvision.schemas import CameraConfig


COCO_KEYPOINT_NAMES = (
    'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
    'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
    'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
    'left_knee', 'right_knee', 'left_ankle', 'right_ankle',
)


def _values(value):
    if value is None:
        return []
    if hasattr(value, 'detach'):
        value = value.detach().cpu()
    return value.tolist() if hasattr(value, 'tolist') else value


class SinglePassPoseDetector(YoloPersonDetector):
    """Cache pose from exactly the same result that supplies each detection box."""
    def __init__(self, config, *, requested_device='cpu', cpu_threads=2,
                 fallback_reason=None):
        self.requested_device = requested_device
        self.fallback_reason = fallback_reason
        self.cpu_threads = max(1, int(cpu_threads))
        self._fallback_used = False
        self._keypoints_by_bbox = {}
        self.unload_memory_stats = None
        super().__init__(config)

    @property
    def actual_device(self):
        model = getattr(self, '_model', None)
        if model is None:
            return 'NOT_INITIALIZED'
        try:
            return str(next(model.model.parameters()).device)
        except (AttributeError, StopIteration):
            return 'NOT_INITIALIZED'

    def memory_stats(self):
        try:
            if not self._torch.cuda.is_available():
                return {'scope': 'current_process_allocator', 'allocated_mib': 0,
                        'reserved_mib': 0, 'peak_allocated_mib': 0}
            return {'scope': 'current_process_allocator',
                    'allocated_mib': self._torch.cuda.memory_allocated() / 2**20,
                    'reserved_mib': self._torch.cuda.memory_reserved() / 2**20,
                    'peak_allocated_mib': self._torch.cuda.max_memory_allocated() / 2**20}
        except RuntimeError:
            return {'scope': 'current_process_allocator', 'allocated_mib': None,
                    'reserved_mib': None, 'peak_allocated_mib': None}

    def _predict(self, images):
        if len(images) != 1:
            raise ValueError('LIVE pose association requires one frame per inference')
        self._keypoints_by_bbox = {}
        try:
            results = super()._predict(images)
        except Exception as exc:
            if self.requested_device != 'auto' or self.device != 'cuda' or self._fallback_used:
                raise
            self._fallback_used = True
            self.fallback_reason = 'CUDA_INFERENCE_FAILED:' + type(exc).__name__
            # Move this same YOLO object. Never construct or reload a second model.
            self._model.to('cpu')
            self._model.predictor = None
            self.device = 'cpu'
            self.half = False
            gc.collect()
            self._torch.cuda.empty_cache()
            results = super()._predict(images)
        finally:
            # Ultralytics' first CPU predictor setup changes torch thread count.
            self._torch.set_num_threads(self.cpu_threads)
        self._capture_keypoints(results[0], images[0].shape[:2])
        return results

    def _capture_keypoints(self, result, shape):
        boxes = getattr(result, 'boxes', None)
        pose = getattr(result, 'keypoints', None)
        rows = _values(getattr(pose, 'data', None))
        coords = _values(getattr(boxes, 'xyxy', None))
        classes = _values(getattr(boxes, 'cls', None))
        if len(rows) != len(coords) or len(classes) != len(coords):
            return
        height, width = shape
        for bbox, cls, points in zip(coords, classes, rows):
            if cls != self.config.person_class_id or len(points) != 17:
                continue
            key = tuple(float(v) for v in bbox)
            if len(key) != 4 or not all(math.isfinite(v) for v in key):
                continue
            if key in self._keypoints_by_bbox:
                self._keypoints_by_bbox[key] = []  # Ambiguous exact duplicates.
                continue
            named = []
            for name, point in zip(COCO_KEYPOINT_NAMES, points):
                x, y, confidence = point[:3] if len(point) >= 3 else (None, None, None)
                finite = all(v is not None and math.isfinite(float(v)) for v in (x, y, confidence))
                visible = bool(finite and .5 <= confidence <= 1 and 0 < x < width and 0 < y < height)
                named.append({'name': name, 'x': float(x) if visible else None,
                              'y': float(y) if visible else None,
                              'confidence': float(confidence) if confidence is not None and math.isfinite(float(confidence)) else None,
                              'visible': visible})
            self._keypoints_by_bbox[key] = named

    def keypoints_for_bbox(self, bbox):
        """Exact current detection association; never nearest-box or stale pose."""
        return [dict(p) for p in self._keypoints_by_bbox.get(tuple(map(float, bbox)), [])]

    def unload(self):
        before = self.memory_stats()
        self._keypoints_by_bbox = {}
        try:
            super().unload()
        finally:
            gc.collect()
            if self._torch.cuda.is_available():
                self._torch.cuda.empty_cache()
            self.unload_memory_stats = {'before': before, 'after': self.memory_stats()}


def build_live_vision(width: int, height: int, fps: float):
    import torch
    requested = os.getenv('VISION_DEVICE', 'cpu').strip().lower()
    if requested not in ('cpu', 'cuda', 'auto'):
        raise CapabilityError('VISION_DEVICE must be cpu, cuda or auto')
    threads = max(1, int(os.getenv('CPU_THREADS', '2')))
    torch.set_num_threads(threads)
    available = torch.cuda.is_available()
    if requested == 'cuda' and not available:
        raise CapabilityError('CUDA explicitly requested but unavailable; no CPU fallback')
    selected = 'cuda' if requested in ('cuda', 'auto') and available else 'cpu'
    reason = 'CUDA_UNAVAILABLE' if requested == 'auto' and not available else None
    weights = configured_path('VISION_WEIGHTS', 'models/yolo11n-pose.pt')
    if not weights.is_file():
        raise CapabilityError('Visual model weights are missing')
    detector = SinglePassPoseDetector(DetectorConfig(
        weights=weights, device=selected, half=False, imgsz=480, batch=1,
        warmup_iterations=0, confidence=.35,
    ), requested_device=requested, cpu_threads=threads, fallback_reason=reason)
    camera = CameraConfig(camera_id='DAHUA-HOME-01', video_path='', fps=fps,
                          width=width, height=height)
    tracker = IoUTracker(camera, TrackerConfig(backend='iou', min_hits=1, match_iou=.15))
    return detector, None, tracker, ActivityConfig()

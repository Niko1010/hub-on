"""Thin bindings to the unmodified RetailVision modules in third_party/."""
from backend.config import configured_path, CapabilityError
import os


def build_vision(width: int, height: int, fps: float):
    import torch
    from retailvision.config import DetectorConfig, TrackerConfig, ActivityConfig
    from retailvision.cv.detector import YoloPersonDetector
    from retailvision.cv.pose import YoloPoseEstimator
    from retailvision.cv.tracker import IoUTracker
    from retailvision.schemas import CameraConfig

    weights = configured_path('VISION_WEIGHTS', 'models/yolo11n-pose.pt')
    if not weights.is_file():
        raise CapabilityError('视觉权重缺失。运行 python scripts/download_models.py。')
    torch.set_num_threads(max(1, int(os.getenv('CPU_THREADS', '2'))))
    device = os.getenv('VISION_DEVICE', 'cpu')
    detector = YoloPersonDetector(DetectorConfig(
        weights=weights, device=device, half=False, imgsz=480, batch=1,
        warmup_iterations=0, confidence=0.35,
    ))
    pose = YoloPoseEstimator(weights=weights, device=device, imgsz=256)
    camera = CameraConfig(camera_id='experience-01', video_path='', fps=fps, width=width, height=height)
    tracker = IoUTracker(camera, TrackerConfig(backend='iou', min_hits=1, match_iou=0.15))
    return detector, pose, tracker, ActivityConfig()

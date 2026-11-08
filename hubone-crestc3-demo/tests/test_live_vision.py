from types import SimpleNamespace

import numpy as np
import pytest
import torch

from adapters import live_vision as live


class Boxes(SimpleNamespace):
    def __len__(self):
        return len(self.xyxy)


def result(boxes=None, points=None):
    boxes = boxes if boxes is not None else [[10, 10, 40, 90]]
    if points is None:
        points = [[[20 + i, 30 + i, .8] for i in range(17)] for _ in boxes]
    return SimpleNamespace(
        boxes=Boxes(xyxy=np.array(boxes, dtype=float),
                              conf=np.array([.9]*len(boxes)), cls=np.zeros(len(boxes))),
        keypoints=SimpleNamespace(data=np.array(points, dtype=float)),
    )


@pytest.fixture
def fake_yolo(monkeypatch, tmp_path):
    import ultralytics
    loaded=[]
    threads=[]

    class Model:
        def __init__(self, weights):
            loaded.append(self)
            self.weights=weights
            self.device='cpu'
            self.predictor=object()
            self.calls=[]
            self.moves=[]
            self.fail_gpu=False
            self.fail_cpu=False
            self.output=result()
            self.model=SimpleNamespace(parameters=lambda:iter([SimpleNamespace(device=self.device)]))

        def predict(self, images, **options):
            self.calls.append(options)
            self.device='cuda:0' if options['device']==0 else 'cpu'
            threads.append(8)  # Model setup can reset the process thread policy.
            if (self.device=='cuda:0' and self.fail_gpu) or (self.device=='cpu' and self.fail_cpu):
                raise RuntimeError('deliberate unit-test inference failure')
            return [self.output]

        def to(self, device):
            self.moves.append(device)
            self.device=device
            return self

    monkeypatch.setattr(ultralytics, 'YOLO', Model)
    monkeypatch.setattr(torch, 'set_num_threads', lambda n:threads.append(n))
    monkeypatch.setattr(torch.cuda, 'is_available', lambda:False)
    for name in ('reset_peak_memory_stats','synchronize','empty_cache'):
        monkeypatch.setattr(torch.cuda,name,lambda:None)
    for name in ('memory_allocated','memory_reserved','max_memory_allocated'):
        monkeypatch.setattr(torch.cuda,name,lambda:0)
    monkeypatch.setattr(live.YoloPersonDetector,'_check_vram_budget',lambda self:None)
    weights=tmp_path/'yolo11n-pose.pt'
    weights.write_bytes(b'test fake model - never inferred')
    monkeypatch.setenv('VISION_WEIGHTS',str(weights))
    monkeypatch.setenv('VISION_DEVICE','cpu')
    monkeypatch.setenv('CPU_THREADS','2')
    return loaded,threads


def test_single_forward_supplies_detection_pose_and_exact_track_association(fake_yolo):
    loaded,threads=fake_yolo
    detector,pose,tracker,_=live.build_live_vision(100,100,25)
    assert len(loaded)==1 and pose is None
    detections=detector.detect(np.zeros((100,100,3),np.uint8))
    tracks=tracker.update(detections,1)
    points=detector.keypoints_for_bbox(tracks[0].bbox)
    assert len(loaded[0].calls)==1
    assert len(points)==17 and points[0]['name']=='nose' and points[-1]['name']=='right_ankle'
    assert all(p['visible'] for p in points)
    assert detector.actual_device=='cpu' and detector.requested_device=='cpu'
    assert threads[-1]==2
    assert detector.keypoints_for_bbox((11,10,40,90))==[]
    points[0]['x']=999
    assert detector.keypoints_for_bbox(tracks[0].bbox)[0]['x']==20
    assert loaded[0].calls[0]['half'] is False and loaded[0].calls[0]['imgsz']==480


def test_missing_low_confidence_zero_nan_and_out_of_frame_points_are_not_guessed(fake_yolo):
    loaded,_=fake_yolo
    detector,_,_,_=live.build_live_vision(100,100,25)
    points=[[20,30,.8] for _ in range(17)]
    points[0]=[20,30,.49];points[1]=[0,30,.9];points[2]=[float('nan'),30,.9]
    points[3]=[100,30,.9];points[4]=[20,30,float('nan')]
    loaded[0].output=result(points=[points])
    bbox=detector.detect(np.zeros((100,100,3),np.uint8))[0].bbox
    output=detector.keypoints_for_bbox(bbox)
    assert all(not p['visible'] and p['x'] is None and p['y'] is None for p in output[:5])
    assert output[5]['visible']
    loaded[0].output.keypoints=None
    detector.detect(np.zeros((100,100,3),np.uint8))
    assert detector.keypoints_for_bbox(bbox)==[]


def test_pose_rows_must_match_current_boxes(fake_yolo):
    loaded,_=fake_yolo
    detector,_,_,_=live.build_live_vision(100,100,25)
    loaded[0].output=result(boxes=[[10,10,40,90],[50,10,80,90]])
    loaded[0].output.keypoints.data=loaded[0].output.keypoints.data[:1]
    detections=detector.detect(np.zeros((100,100,3),np.uint8))
    assert all(detector.keypoints_for_bbox(d.bbox)==[] for d in detections)


def test_auto_without_cuda_is_explicit_cpu_and_strict_cuda_errors(fake_yolo,monkeypatch):
    monkeypatch.setenv('VISION_DEVICE','auto')
    detector,_,_,_=live.build_live_vision(100,100,25)
    assert detector.device=='cpu' and detector.requested_device=='auto'
    assert detector.fallback_reason=='CUDA_UNAVAILABLE'
    monkeypatch.setenv('VISION_DEVICE','cuda')
    with pytest.raises(live.CapabilityError,match='no CPU fallback'):
        live.build_live_vision(100,100,25)
    assert len(fake_yolo[0])==1


def test_auto_gpu_failure_reuses_one_model_and_retries_cpu_once(fake_yolo,monkeypatch):
    loaded,_=fake_yolo
    monkeypatch.setattr(torch.cuda,'is_available',lambda:True)
    monkeypatch.setenv('VISION_DEVICE','auto')
    detector,_,_,_=live.build_live_vision(100,100,25)
    assert detector.actual_device=='cpu'  # Actual parameters before first prediction.
    loaded[0].fail_gpu=True
    detector.detect(np.zeros((100,100,3),np.uint8))
    assert len(loaded)==1 and loaded[0].moves==['cpu']
    assert [p['device'] for p in loaded[0].calls]==[0,'cpu']
    assert detector.actual_device=='cpu' and detector.fallback_reason=='CUDA_INFERENCE_FAILED:RuntimeError'
    detector.detect(np.zeros((100,100,3),np.uint8))
    assert [p['device'] for p in loaded[0].calls]==[0,'cpu','cpu']
    loaded[0].fail_cpu=True
    with pytest.raises(RuntimeError):
        detector.detect(np.zeros((100,100,3),np.uint8))
    assert len(loaded)==1 and loaded[0].moves==['cpu']
    assert detector.keypoints_for_bbox((10,10,40,90))==[]


def test_explicit_cuda_never_silently_falls_back(fake_yolo,monkeypatch):
    loaded,_=fake_yolo
    monkeypatch.setattr(torch.cuda,'is_available',lambda:True)
    monkeypatch.setenv('VISION_DEVICE','cuda')
    detector,_,_,_=live.build_live_vision(100,100,25)
    loaded[0].fail_gpu=True
    with pytest.raises(RuntimeError):
        detector.detect(np.zeros((100,100,3),np.uint8))
    assert len(loaded)==1 and len(loaded[0].calls)==1 and loaded[0].moves==[]
    assert detector.fallback_reason is None


def test_auto_gpu_success_reports_actual_parameter_device(fake_yolo,monkeypatch):
    monkeypatch.setattr(torch.cuda,'is_available',lambda:True)
    monkeypatch.setenv('VISION_DEVICE','auto')
    detector,_,_,_=live.build_live_vision(100,100,25)
    detector.detect(np.zeros((100,100,3),np.uint8))
    assert detector.actual_device=='cuda:0' and detector.requested_device=='auto'
    assert detector.fallback_reason is None and len(fake_yolo[0][0].calls)==1


def test_unload_records_allocator_and_clears_pose(fake_yolo,monkeypatch):
    detector,_,_,_=live.build_live_vision(100,100,25)
    detector.detect(np.zeros((100,100,3),np.uint8))
    collected=[]
    monkeypatch.setattr(live.gc,'collect',lambda:collected.append(True))
    detector.unload()
    assert collected and detector.actual_device=='NOT_INITIALIZED'
    assert detector.keypoints_for_bbox((10,10,40,90))==[]
    assert detector.unload_memory_stats['after']['scope']=='current_process_allocator'
    detector.unload()

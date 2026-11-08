"""File-based video analysis; frame time is converted to session time exactly once."""
from dataclasses import asdict, replace
from pathlib import Path
from typing import Protocol
import os

import cv2
import numpy as np
from shapely.geometry import Polygon

from backend.config import ROOT
from backend.models import Event
from backend.provenance import labels as provenance_labels
from adapters.vision import build_vision
from vision.observations import ObservationRecorder
from vision.model_provenance import capture_model_provenance
from retailvision.ingestion.video_loader import probe_video
from retailvision.cv.activity import ActivityTracker
from retailvision.cv.pose import COCO_KEYPOINTS
from retailvision.spatial.zones import Zone, ZoneMap


class SpecialtyRecognizer(Protocol):
    """Future dressing/strap/slope classifiers. None are enabled by default."""
    def observe(self, frame: np.ndarray, tracks: list, session_time: float) -> list[Event]: ...


def analyze_video(path: Path, sid: str, aid: str, output: Path, offset=0.0,
                  zone=None, simulated=False, progress=lambda *_: None,
                  recognizers: tuple[SpecialtyRecognizer, ...] = (), recording_mode=None):
    probe = probe_video(path)
    if probe.duration_seconds > 600:
        raise ValueError('Demo 视频限 10 分钟，请先裁剪。')
    width, height = probe.width, probe.height
    detector, pose_model, tracker, activity_config = build_vision(width, height, probe.fps)
    activity = ActivityTracker(activity_config)
    points = zone or [(0.05,0.05),(0.95,0.05),(0.95,0.95),(0.05,0.95)]
    zones = ZoneMap([Zone(zone_id='experience', name='体验区', polygon=Polygon(points))], boundary_margin_m=0.02)
    sample_fps = min(10.0, max(0.2, float(os.getenv('VISION_SAMPLE_FPS', '2'))))
    stride = max(1, round(probe.fps / sample_fps))
    output.mkdir(parents=True, exist_ok=True)
    capture = cv2.VideoCapture(str(path))
    events, last_states, last_zones = [], {}, {}
    sampled, people, poses = 0, 0, 0
    model_provenance = pose_provenance = None
    observations = ObservationRecorder(sid, aid, probe, offset, points, simulated, recording_mode)
    observations.document['pose_provenance'] = None

    def emit(kind, text, ts, track, frame_index, extra=None):
        frame_name = f'{frame_index:07d}.jpg'
        events.append(Event(
            session_id=sid, timestamp=round(offset+ts, 4), event_type=kind,
            source='video', description=text,
            confidence=float(track.confidence),
            evidence={'asset_id':aid, 'media_time':round(ts,4), 'frame_index':frame_index,
                      'snapshot':frame_name, 'bbox':list(track.bbox)},
            metadata={'track_id':str(track.local_track_id),
                      'observation_run_id':observations.run_id,
                      'provenance_id':model_provenance['provenance_id'],
                      'pose_provenance_id':(pose_provenance['provenance_id'] if pose_provenance is not None
                          and kind in ('walking_indicator','stationary','activity_unknown') else None),
                      **provenance_labels(simulated,'REAL_MODEL' if kind=='person_detected' else 'RULE_BASED'),
                      'upstream_model':'REAL_MODEL/YOLO+pose',
                      'offset_seconds':offset,
                      'method':'retailvision/yolo11n-pose+iou',
                      'confidence_scope':'person_detection_only', **(extra or {})},
        ))

    try:
        index = 0
        while True:
            ok, frame = capture.read()
            if not ok:
                break
            if index % stride:
                index += 1
                continue
            ts = index / probe.fps
            if ts > 600:
                raise ValueError('解码视频超过 10 分钟限制。')
            sampled += 1
            frame_tracks, event_start = [], len(events)
            frame_pose_provenance_id = None
            detections = detector.detect(frame)
            if model_provenance is None:
                model_provenance = capture_model_provenance(detector, probe.fps/stride, probe.fps)
                observations.document['vision_provenance'] = model_provenance
            tracks = tracker.update(detections, index)
            people += len(tracks)
            annotated = frame.copy()
            cv2.polylines(annotated, [np.array([(x*width,y*height) for x,y in points],np.int32)], True, (76,210,150), 2)
            for track in tracks:
                x1,y1,x2,y2 = [int(x) for x in track.bbox]
                x1,y1,x2,y2 = max(0,x1),max(0,y1),min(width,x2),min(height,y2)
                if x2 <= x1 or y2 <= y1:
                    continue
                crop = frame[y1:y2, x1:x2]
                pose = pose_model.estimate([crop])[0]
                if pose_provenance is None:
                    pose_provenance = capture_model_provenance(pose_model, probe.fps/stride, probe.fps)
                    observations.document['pose_provenance'] = pose_provenance
                frame_pose_provenance_id = pose_provenance['provenance_id']
                # RetailVision estimates crop coordinates. Convert to the shared
                # frame coordinate system before measuring motion between crops.
                if pose is not None:
                    poses += 1
                    pose = replace(pose, xy=pose.xy + np.array([x1,y1], np.float32))
                    for (x,y), conf in zip(pose.xy, pose.confidence):
                        if conf >= 0.4:
                            cv2.circle(annotated, (int(x),int(y)),3,(255,209,82),-1)
                tid = str(track.local_track_id)
                observation = activity.observe(global_id=tid, camera_id='experience-01',
                    frame_index=index, timestamp=ts, pose=pose)
                state = str(observation.state)
                location = zones.assign(((x1+x2)/2/width, y2/height)).zone_id
                # Reuse the pose already inferred for this crop, now in frame pixels.
                # Missing/low-confidence positions remain unavailable, never zero-filled.
                keypoints=[]
                if pose is not None and len(pose.xy)==len(COCO_KEYPOINTS) and len(pose.confidence)==len(COCO_KEYPOINTS):
                    for name,(px,py),confidence in zip(COCO_KEYPOINTS,pose.xy,pose.confidence):
                        finite=bool(np.isfinite([px,py,confidence]).all())
                        visible=bool(finite and .5<=confidence<=1 and 0<px<width and 0<py<height)
                        keypoints.append({'name':name,'x':float(px) if visible else None,
                            'y':float(py) if visible else None,
                            'confidence':float(confidence) if np.isfinite(confidence) else None,'visible':visible})
                frame_tracks.append({'track_id':tid, 'bbox':[x1,y1,x2,y2],
                    'footpoint':[(x1+x2)/2,y2], 'confidence':float(track.confidence),
                    'image_zone_id':location, 'state':state,'keypoints':keypoints,
                    'pose_status':'AVAILABLE' if any(point['visible'] for point in keypoints) else 'NOT_AVAILABLE',
                    'pose_processing_method':'REAL_MODEL'})
                if tid not in last_states:
                    emit('person_detected','检测到人体（轨迹 ID 仅在当前视频内有效）',ts,track,index)
                if last_zones.get(tid) != location:
                    if location == 'experience':
                        emit('zone_enter','进入画面标定的体验区',ts,track,index)
                    elif last_zones.get(tid) == 'experience':
                        emit('zone_exit','离开画面标定的体验区',ts,track,index)
                    last_zones[tid] = location
                if last_states.get(tid) != state:
                    labels = {'MOVING':('walking_indicator','行走 / 位移迹象（姿态规则，需复核）'),
                              'STATIONARY':('stationary','静止迹象（姿态规则，需复核）')}
                    kind,text = labels.get(state, ('activity_unknown','当前姿态不足以判断基础行为'))
                    emit(kind,text,ts,track,index,{'state':state,'reason':observation.reason,
                        'features':asdict(observation.features), 'inference':'heuristic'})
                    last_states[tid] = state
                cv2.rectangle(annotated,(x1,y1),(x2,y2),(76,210,150),2)
                cv2.putText(annotated,f'#{tid} {state}',(x1,max(18,y1-8)),cv2.FONT_HERSHEY_SIMPLEX,0.5,(76,210,150),1)
            for recognizer in recognizers:
                events.extend(recognizer.observe(frame, tracks, offset+ts))
            cv2.putText(annotated, f'{"SIMULATED INPUT | " if simulated else ""}{ts:.1f}s / YOLO CPU',
                        (12,25),cv2.FONT_HERSHEY_SIMPLEX,0.55,(255,255,255),1)
            cv2.imwrite(str(output / f'{index:07d}.jpg'), annotated)
            observations.append(index, ts, frame_tracks, events[event_start:])
            observations.frames[-1]['provenance_id'] = model_provenance['provenance_id']
            observations.frames[-1]['pose_provenance_id'] = frame_pose_provenance_id
            progress(min(0.95, (index+1)/max(1,probe.frame_count)), f'已分析 {sampled} 帧 / {people} 人体观测')
            index += 1
    finally:
        capture.release()
        detector.unload()
        pose_model.unload()
    if not sampled:
        raise ValueError('视频没有可解码帧。')
    observation_stats = observations.save(output)
    return events, {**observation_stats, 'vision_provenance':model_provenance,
        'pose_provenance':pose_provenance, 'sampled_frames':sampled,'person_observations':people,'poses_found':poses,
        'duration_seconds':probe.duration_seconds,'sampling_fps':probe.fps/stride,
        'detector':'RetailVision YoloPersonDetector', 'tracker':'RetailVision IoUTracker',
        'pose':'RetailVision YoloPoseEstimator','specialty_recognizers':len(recognizers),
        'limitations':['穿戴、腰带调整、上坡未配置专用识别器。',
                      '时间邻近不能证明说话人就是画面中的人。',
                      '行为为姿态启发式，固定机位下有效；未校准实际行走速度。']}

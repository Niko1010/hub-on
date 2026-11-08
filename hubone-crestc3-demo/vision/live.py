"""Single-camera live observations over the existing detector, tracker and Store."""
from collections import deque
from datetime import datetime, timezone
import copy
import json
import math
import os
import subprocess
import threading
import time

import cv2

from adapters.rtsp_live import LatestRTSP, configured
from adapters.live_vision import build_live_vision
from vision.model_provenance import capture_model_provenance
from vision.pose_rules import PoseExperiments
from backend.models import Event, Session, SessionCreate


def utc():
    return datetime.now(timezone.utc).isoformat()


def detector_device(detector):
    """Resolved model device, never inferred from an environment request."""
    device=getattr(detector,'actual_device',None) or getattr(detector,'device',None)
    return str(device) if device is not None else None


def synchronize_detector(detector):
    device=detector_device(detector)
    if device is None or not device.startswith('cuda'):
        return False
    torch=getattr(detector,'_torch',None)
    if torch is None:
        import torch
    if not torch.cuda.is_available():
        return False
    torch.cuda.synchronize(device)
    return True


class StageTimings:
    """Last and rolling 120-sample mean wall latency, in milliseconds."""
    def __init__(self):self.windows={}

    def record(self,name,value):
        if value is not None and math.isfinite(value) and value>=0:
            self.windows.setdefault(name,deque(maxlen=120)).append(float(value))

    def export(self):
        return {key:value for name,values in self.windows.items()
                for key,value in ((name,values[-1]),('mean_'+name,sum(values)/len(values)))}


class CaptureLease:
    """A nonblocking OS lease prevents two local API processes opening one camera."""
    def __init__(self, root):
        self.file=(root/'live_capture.lock').open('a+b')
        self.file.seek(0,2)
        if self.file.tell()==0:self.file.write(b'0');self.file.flush()
        self.file.seek(0)
        try:
            if os.name=='nt':
                import msvcrt
                msvcrt.locking(self.file.fileno(),msvcrt.LK_NBLCK,1)
            else:
                import fcntl
                fcntl.flock(self.file.fileno(),fcntl.LOCK_EX|fcntl.LOCK_NB)
        except OSError:
            self.file.close()
            raise ValueError('Camera capture is owned by another local service') from None

    def close(self):
        if not self.file.closed:self.file.close()


class LiveStore:
    """Only additive tables; all business events still use Store.write_events."""
    def __init__(self, store):
        self.store = store
        with store.connect() as db:
            db.executescript('''
                CREATE TABLE IF NOT EXISTS live_sessions (
                    session_id TEXT PRIMARY KEY REFERENCES sessions(session_id), payload TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS live_observations (
                    observation_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL REFERENCES sessions(session_id),
                    frame_index INTEGER NOT NULL, timestamp REAL NOT NULL, payload TEXT NOT NULL,
                    UNIQUE(session_id, frame_index));
                CREATE INDEX IF NOT EXISTS live_observation_session ON live_observations(session_id,observation_id);
            ''')

    def save(self, state):
        with self.store.connect() as db:
            db.execute('INSERT OR REPLACE INTO live_sessions VALUES (?,?)',
                       (state['session_id'],json.dumps(state,allow_nan=False)))

    def sessions(self):
        with self.store.connect() as db:
            return [json.loads(r[0]) for r in db.execute('SELECT payload FROM live_sessions ORDER BY rowid DESC LIMIT 100')]

    def session(self, sid):
        with self.store.connect() as db:
            row=db.execute('SELECT payload FROM live_sessions WHERE session_id=?',(sid,)).fetchone()
        if row is None:
            raise KeyError('Live Session not found')
        return json.loads(row[0])

    def append(self, observation):
        with self.store.connect() as db:
            cursor=db.execute('INSERT INTO live_observations(session_id,frame_index,timestamp,payload) VALUES (?,?,?,?)',
                (observation['session_id'],observation['frame_index'],observation['timestamp'],json.dumps(observation,allow_nan=False)))
            observation['observation_id']=cursor.lastrowid
        return observation

    def observations(self, sid, after, limit):
        self.session(sid)
        with self.store.connect() as db:
            rows=db.execute('SELECT observation_id,payload FROM live_observations WHERE session_id=? AND observation_id>? ORDER BY observation_id LIMIT ?',
                            (sid,after,limit)).fetchall()
        items=[{**json.loads(r[1]),'observation_id':r[0]} for r in rows]
        return {'items':items,'next_cursor':items[-1]['observation_id'] if items else after,
                'session_id':sid,'coordinate_system':'IMAGE_PIXELS','cad_status':'NOT_CONNECTED'}


class LiveManager:
    def __init__(self, store, capture_factory=LatestRTSP, vision_factory=build_live_vision, configuration_check=configured):
        self.store, self.live = store, LiveStore(store)
        self.capture_factory, self.vision_factory = capture_factory, vision_factory
        self.configuration_check = configuration_check
        self.lock=threading.RLock()
        self.thread=None
        self.stop_event=threading.Event()
        self.current=None
        self.lease=None
        self.persistence_latencies=deque(maxlen=120)
        self.camera_id='DAHUA-HOME-01'
        # An in-memory capture cannot survive an application restart.
        try:recovery_lease=CaptureLease(store.root)
        except ValueError:recovery_lease=None
        if recovery_lease:
            try:
                for state in self.live.sessions():
                    if state['status'] in ('CONNECTING','LIVE','RECONNECTING','STOPPING'):
                        state.update(status='ERROR',ended_at=utc(),error='SERVER_RESTART_INTERRUPTED_CAPTURE')
                        self.live.save(state)
            finally:recovery_lease.close()

    def status(self):
        with self.lock:
            state=copy.deepcopy(self.current) if self.current else {
                'status':'NOT_CONNECTED','session_id':None,'latest_observation':None,'metrics':{},
                'started_at':None,'ended_at':None,'error':None}
        return {**state,'camera_id':self.camera_id,'source_type':'RTSP','source_mode':'LIVE',
                'credentials_configured':self.configuration_check(),'coordinate_system':'IMAGE_PIXELS',
                'floor_id':None,'cad_status':'NOT_CONNECTED'}

    def _update(self, **patch):
        with self.lock:
            self.current.update(patch)
            started=time.perf_counter()
            self.live.save(copy.deepcopy(self.current))
            self.persistence_latencies.append((time.perf_counter()-started)*1000)
            # The duration can only be known after the write; history has the
            # preceding write's value, while /status exposes the latest value.
            self.current['metrics']['status_persist_ms']=self.persistence_latencies[-1]
            self.current['metrics']['mean_status_persist_ms']=sum(self.persistence_latencies)/len(self.persistence_latencies)

    def start(self, session_input:SessionCreate | None = None):
        if session_input is not None and session_input.simulated:
            raise ValueError("RTSP LIVE requires a non-simulated research Session")
        with self.lock:
            if self.thread and self.thread.is_alive():
                raise ValueError('A capture is already active; stop it before starting another')
            if not self.configuration_check():
                raise ValueError('NOT CONNECTED: configure HUBONE_RTSP_USERNAME and HUBONE_RTSP_PASSWORD locally')
            self.lease=CaptureLease(self.store.root)
            try:
                session=(Session(**session_input.model_dump()) if session_input is not None else
                         Session(name='大华家庭摄像头 · RTSP LIVE',product='家庭摄像头持续采集',simulated=False))
                self.store.create_session(session)
                self.current={'session_id':session.session_id,'camera_id':self.camera_id,'source_type':'RTSP',
                    'source_mode':'LIVE','simulated':False,'coordinate_system':'IMAGE_PIXELS','floor_id':None,
                    'cad_status':'NOT_CONNECTED','status':'CONNECTING','started_at':utc(),'ended_at':None,
                    'latest_observation':None,'error':None,'vision_provenance':None,'vision_provenance_history':[],
                    'provenance_status':'PENDING_FIRST_INFERENCE','metrics':{'reconnect_count':0,'device':None,
                        'requested_device':os.getenv('VISION_DEVICE','cpu'),'gpu_inference':False,'cpu_percent':None,
                        'gpu_utilization_percent':None,'gpu_memory_mb':None,'elapsed_seconds':0}}
                self.live.save(self.current)
                self.stop_event.clear()
                self.persistence_latencies.clear()
                self.thread=threading.Thread(target=self._run,name='hubone-rtsp-inference',daemon=True)
                self.thread.start()
            except Exception:
                self.lease.close()
                self.lease=None
                self.thread=None
                if self.current and self.current.get('status')=='CONNECTING':
                    self.current.update(status='ERROR',ended_at=utc(),error='CAPTURE_START_FAILED')
                    try:self.live.save(self.current)
                    except Exception:pass
                raise
        return self.status()

    def stop(self):
        with self.lock:
            if self.thread and self.thread.is_alive():
                self.stop_event.set()
                self.current['status']='STOPPING'
                self.live.save(self.current)
        return self.status()

    def shutdown(self):
        self.stop()
        if self.thread:
            self.thread.join(timeout=30)

    def _run(self):
        source=detector=pose=tracker=None
        origin=time.monotonic()
        sid=self.current['session_id']
        processed=0;observation_count=0;latencies=deque(maxlen=120);processed_times=deque(maxlen=120)
        timings=StageTimings()
        experiments=PoseExperiments()
        provenance=None;provenance_key=None
        acquisition_wait_ms=0;last_delivered_frame=None
        sampling_skipped=stale_dropped=source_not_delivered=0
        last_sample=last_received=last_metrics=0
        track_epoch=0;previous=set();zones={};public_ids={};segment=0
        last_packet_epoch=None
        try:
            import psutil
            cpu=psutil.Process();cpu.cpu_percent()
        except ImportError:
            cpu=None
        metrics=dict(self.current['metrics'])
        try:
            frames=self.store.root/'live_frames'/sid
            frames.mkdir(parents=True,exist_ok=True)
            sample_fps=float(os.getenv('HUBONE_LIVE_SAMPLE_FPS','2'))
            if not math.isfinite(sample_fps) or not .2<=sample_fps<=10:
                raise ValueError('HUBONE_LIVE_SAMPLE_FPS must be finite and between 0.2 and 10')
            period=1/sample_fps
            metrics.update(configured_sample_fps=sample_fps,timing_window_samples=120,
                timing_scope={
                    'rtsp_read_ms':'VideoCapture.read wall time: network/buffering wait plus decode, not codec-only',
                    'queue_read_wait_ms':'parent queue read wall time including IPC, not RTSP decode',
                    'sample_acquisition_wait_ms':'sum of queue read waits since the preceding accepted sample',
                    'frame_queue_age_ms':'decoder read completion to inference admission',
                    'yolo_ms':'detector.detect wall time, including preprocessing/postprocessing; CUDA synchronized when actual device is CUDA',
                    'sampled_pipeline_fps':'completed sampled pipeline throughput, constrained by configured_sample_fps; not model capacity',
                    'mean_inference_ms':'legacy mean of YOLO plus tracking wall time',
                    'observation_build_ms':'track/Observation payload and associated Event object construction',
                    'sample_pipeline_ms':'admitted frame through status persistence; excludes queue acquisition wait',
                    'status_persist_ms':'latest completed status write; persisted history lags one write'})
            source=self.capture_factory()
            while not self.stop_event.is_set():
                queue_started=time.perf_counter()
                packet=source.read(timeout=.5)
                queue_wait_ms=(time.perf_counter()-queue_started)*1000
                acquisition_wait_ms+=queue_wait_ms
                now=time.monotonic()
                if packet is None:
                    if last_received and now-last_received>3 and self.current['status']=='LIVE':
                        track_epoch+=1;previous.clear();zones.clear();public_ids.clear()
                        if tracker: tracker.reset()
                        experiments.reset()
                        self._update(status='RECONNECTING',error='NO_RECENT_FRAMES')
                    continue
                if packet['kind']!='frame':
                    if packet['kind']=='error':
                        raise RuntimeError('decoder_stopped')
                    # Count successful reconnections once, when the decoder epoch changes.
                    track_epoch+=1;previous.clear();zones.clear();public_ids.clear()
                    if tracker: tracker.reset()
                    experiments.reset()
                    self._update(status='RECONNECTING',error='RTSP_CONNECTION_LOST',metrics=metrics)
                    continue
                last_received=now
                if last_delivered_frame is not None:
                    source_not_delivered+=max(0,packet['frame_index']-last_delivered_frame-1)
                last_delivered_frame=packet['frame_index']
                if now-last_sample<period:
                    sampling_skipped+=1
                    continue
                if now-packet['captured_monotonic']>3:
                    stale_dropped+=1
                    if self.current['status']!='RECONNECTING':
                        track_epoch+=1;previous.clear();zones.clear();public_ids.clear()
                        if tracker:tracker.reset()
                        experiments.reset()
                    self._update(status='RECONNECTING',error='STALE_FRAME_DROPPED')
                    continue
                pipeline_started=time.perf_counter()
                timings.record('sample_interval_ms',(now-last_sample)*1000 if last_sample else None)
                last_sample=now
                timings.record('rtsp_read_ms',packet.get('rtsp_read_ms'))
                timings.record('queue_read_wait_ms',queue_wait_ms)
                timings.record('sample_acquisition_wait_ms',acquisition_wait_ms)
                timings.record('frame_queue_age_ms',max(0,now-packet['captured_monotonic'])*1000)
                acquisition_wait_ms=0
                frame=packet['frame'];height,width=frame.shape[:2]
                epoch=packet['connection_epoch']
                if last_packet_epoch is not None and epoch!=last_packet_epoch:
                    metrics['reconnect_count']+=1
                    track_epoch+=1;previous.clear();zones.clear();public_ids.clear()
                    if tracker:tracker.reset()
                    experiments.reset()
                last_packet_epoch=epoch
                if detector is None:
                    # IoU expiry/velocity advance once per inference update, not decoded frame.
                    setup_started=time.perf_counter()
                    detector,pose,tracker,_=self.vision_factory(width,height,sample_fps)
                    metrics['model_setup_ms']=(time.perf_counter()-setup_started)*1000
                synchronize_detector(detector)
                infer_start=time.perf_counter()
                detections=detector.detect(frame)
                cuda_synchronized=synchronize_detector(detector)
                yolo_ms=(time.perf_counter()-infer_start)*1000
                timings.record('yolo_ms',yolo_ms)
                if processed:timings.record('warm_yolo_ms',yolo_ms)
                else:metrics['first_yolo_ms']=yolo_ms
                # Freeze provenance only after a successful real forward pass.
                # Dependency-injected non-model test doubles never claim REAL_MODEL provenance.
                runtime_key=(detector_device(detector),getattr(detector,'fallback_reason',None))
                if hasattr(detector,'weights') and runtime_key!=provenance_key:
                    provenance=capture_model_provenance(detector,sample_fps,packet.get('source_fps'))
                    provenance_key=runtime_key
                    self._update(vision_provenance=provenance,
                        vision_provenance_history=[*self.current['vision_provenance_history'],provenance],
                        provenance_status='RECORDED_AFTER_REAL_INFERENCE')
                tracking_started=time.perf_counter()
                tracks=tracker.update(detections,processed)
                tracking_ms=(time.perf_counter()-tracking_started)*1000
                timings.record('tracking_ms',tracking_ms)
                # Preserve the original decoded frame_index and monotonic timestamp
                # in observations/events below; tracker-internal time is not exported.
                latencies.append(yolo_ms+tracking_ms)
                ts=max(0,packet['captured_monotonic']-origin)
                name=f'{packet["frame_index"]:012d}.jpg'
                frame_url=f'/api/live/sessions/{sid}/frames/{name}'
                jpeg_started=time.perf_counter()
                ok,jpeg=cv2.imencode('.jpg',frame,[cv2.IMWRITE_JPEG_QUALITY,82])
                if not ok:raise RuntimeError('jpeg_encode_failed')
                timings.record('jpeg_encode_ms',(time.perf_counter()-jpeg_started)*1000)
                write_started=time.perf_counter()
                (frames/name).write_bytes(jpeg.tobytes())
                timings.record('evidence_write_ms',(time.perf_counter()-write_started)*1000)
                observation_started=time.perf_counter()
                observation={'session_id':sid,'camera_id':self.camera_id,'source_type':'RTSP','source_mode':'LIVE',
                    'simulated':False,'timestamp':round(ts,4),'captured_at':packet['captured_at'],
                    'frame_index':packet['frame_index'],'connection_epoch':epoch,'track_epoch':track_epoch,
                    'width':width,'height':height,'coordinate_system':'IMAGE_PIXELS','floor_id':None,
                    'frame_url':frame_url,'snapshot':name,'tracks':[],'event_ids':[],
                    'provenance_id':provenance['provenance_id'] if provenance else None}
                events=[];seen=set()
                for track in tracks:
                    raw=str(track.local_track_id)
                    x1,y1,x2,y2=map(float,track.bbox)
                    if not all(math.isfinite(v) for v in (x1,y1,x2,y2,track.confidence)):continue
                    x1,y1,x2,y2=max(0,x1),max(0,y1),min(width,x2),min(height,y2)
                    if x2<=x1 or y2<=y1:continue
                    # A missed sample or reconnect starts a distinct visible segment;
                    # never reconnect a drawing across an unobserved interval.
                    fresh=raw not in previous
                    if fresh:
                        segment+=1;public_ids[raw]=f'{track_epoch}-{segment}-{raw}'
                    tid=public_ids[raw];seen.add(raw)
                    foot=[(x1+x2)/2,y2]
                    inside=.05<=foot[0]/width<=.95 and .05<=foot[1]/height<=.95
                    zone='image-roi' if inside else None
                    item={'track_id':tid,'bbox':[x1,y1,x2,y2],'confidence':float(track.confidence),
                          'footpoint':foot,'image_zone_id':zone}
                    keypoints=detector.keypoints_for_bbox(track.bbox) if hasattr(detector,'keypoints_for_bbox') else []
                    item.update(keypoints=keypoints,
                        pose_status='AVAILABLE' if any(p.get('visible') for p in keypoints) else 'NOT_AVAILABLE',
                        pose_processing_method='REAL_MODEL' if keypoints else 'NOT_CONNECTED',
                        pose_experiment=experiments.observe(tid,ts,item['bbox'],keypoints,inside))
                    observation['tracks'].append(item)
                    kinds=[]
                    if fresh:kinds.append(('person_detected','检测到人体；Track ID 仅为当前采集内的连续片段','REAL_MODEL'))
                    before=zones.get(tid)
                    if inside and before!='image-roi':kinds.append(('zone_enter','首次观测于画面 ROI 内' if fresh else '进入画面 ROI','RULE_BASED'))
                    elif not inside and before=='image-roi':kinds.append(('zone_exit','离开画面 ROI','RULE_BASED'))
                    zones[tid]=zone
                    for kind,description,method in kinds:
                        events.append(Event(session_id=sid,timestamp=round(ts,4),event_type=kind,source='video',
                            description=description,confidence=float(track.confidence),
                            evidence={'frame_url':frame_url,'frame_index':packet['frame_index'],'snapshot':name,'bbox':item['bbox']},
                            metadata={'track_id':tid,'camera_id':self.camera_id,'source_type':'RTSP','recording_mode':'LIVE',
                                'input_origin':'LIVE_CAMERA','simulated':False,'processing_method':method,
                                'captured_at':packet['captured_at'],'coordinate_system':'IMAGE_PIXELS',
                                'provenance_id':observation['provenance_id'],
                                'image_zone_id':zone,'entry_basis':'first_observed' if fresh else 'observed_transition',
                                'method':'retailvision/yolo+iou','confidence_scope':'person_detection_only'}))
                previous=seen
                experiments.prune([public_ids[raw] for raw in seen])
                zones={tid:zones[tid] for raw,tid in public_ids.items() if raw in seen and tid in zones}
                public_ids={raw:tid for raw,tid in public_ids.items() if raw in seen}
                observation['event_ids']=[event.event_id for event in events]
                timings.record('observation_build_ms',(time.perf_counter()-observation_started)*1000)
                event_started=time.perf_counter()
                if events:self.store.write_events(sid,events,'live',replace=False)
                timings.record('event_write_ms',(time.perf_counter()-event_started)*1000 if events else 0)
                observation_db_started=time.perf_counter()
                self.live.append(observation)
                timings.record('observation_db_ms',(time.perf_counter()-observation_db_started)*1000)
                observation_count+=len(observation['tracks'])
                processed+=1
                metrics.update(width=width,height=height,source_fps=packet.get('source_fps'),reported_fps=packet.get('reported_fps'),
                    device=detector_device(detector),gpu_inference=cuda_synchronized,
                    yolo_cuda_synchronized=cuda_synchronized,yolo_first_sample=processed==1,
                    model_instance_count=1 if pose is None else 2,
                    fallback_reason=getattr(detector,'fallback_reason',None),
                    sampling_skipped_frames=sampling_skipped,stale_frames_dropped=stale_dropped,
                    decoder_frames_not_delivered=source_not_delivered,
                    mean_inference_ms=sum(latencies)/len(latencies),elapsed_seconds=time.monotonic()-origin,
                    sampled_frames=processed,observation_count=observation_count)
                telemetry_started=time.perf_counter()
                if now-last_metrics>=2:
                    if cpu:
                        metrics['cpu_percent']=psutil.cpu_percent()
                        metrics['process_cpu_percent']=cpu.cpu_percent()
                        metrics['cpu_metrics_scope']='cpu_percent=whole_system; process_cpu_percent=inference_process'
                    try:
                        result=subprocess.run(['nvidia-smi','--query-gpu=utilization.gpu,memory.used','--format=csv,noheader,nounits'],
                            capture_output=True,text=True,timeout=1,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
                        values=result.stdout.strip().splitlines()[0].split(',')
                        metrics['gpu_utilization_percent']=float(values[0]);metrics['gpu_memory_mb']=float(values[1])
                    except (OSError,subprocess.SubprocessError,IndexError,ValueError):
                        metrics['gpu_utilization_percent']=None;metrics['gpu_memory_mb']=None
                    last_metrics=now
                timings.record('telemetry_ms',(time.perf_counter()-telemetry_started)*1000)
                metrics['gpu_metrics_scope']='whole_device_not_inference_process'
                if hasattr(detector,'memory_stats'):metrics['torch_memory']=detector.memory_stats()
                if hasattr(detector,'_torch'):metrics['torch_threads']=detector._torch.get_num_threads()
                metrics.update(timings.export())
                self._update(status='LIVE',error=None,metrics=metrics,latest_observation=observation)
                timings.record('sample_pipeline_ms',(time.perf_counter()-pipeline_started)*1000)
                processed_times.append(time.monotonic())
                # No extra SQLite write just to record the write's own duration.
                # Persist these completed-sample timings on the following status update.
                with self.lock:
                    metrics.update(timings.export())
                    metrics['sampled_pipeline_fps']=(len(processed_times)-1)/(processed_times[-1]-processed_times[0]) if len(processed_times)>1 else None
                    metrics['inference_fps']=metrics['sampled_pipeline_fps']
        except Exception:
            self._update(status='ERROR',error='CAPTURE_OR_INFERENCE_FAILED_CHECK_LOCAL_CONFIGURATION')
        finally:
            if source:
                try:source.close()
                except Exception:pass
            for model in (detector,pose):
                if model:
                    try:model.unload()
                    except Exception:pass
            if detector and hasattr(detector,'unload_memory_stats'):
                metrics['torch_memory_after_unload']=detector.unload_memory_stats
            metrics['elapsed_seconds']=time.monotonic()-origin
            try:
                self._update(status='ERROR' if self.current['status']=='ERROR' else 'STOPPED',ended_at=utc(),metrics=metrics)
            finally:
                if self.lease:self.lease.close();self.lease=None

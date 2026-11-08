"""Persist observations from the existing inference pass, independently of Event."""
import json
from uuid import uuid4


class ObservationRecorder:
    def __init__(self, sid, aid, probe, offset, polygon, simulated, recording_mode):
        self.run_id = uuid4().hex
        self.frames = []
        self.tracks = set()
        self.document = {
            'schema_version': 1, 'run_id': self.run_id,
            'session_id': sid, 'asset_id': aid,
            'recording_mode': 'SIMULATED' if simulated else recording_mode or 'NOT_CONNECTED',
            'simulated': bool(simulated), 'processing_method': 'REAL_MODEL',
            'detector': 'YOLO', 'tracker': 'IoUTracker',
            'coordinate_system': 'IMAGE_PIXELS', 'floor_id': None,
            'cad_status': 'NOT_CONNECTED', 'rtsp_status': 'NOT_CONNECTED',
            'width': probe.width, 'height': probe.height,
            'video_fps': probe.fps, 'duration_seconds': probe.duration_seconds,
            'offset_seconds': offset, 'timestamp_basis': 'SESSION_RELATIVE_SECONDS',
            'image_zone': {'zone_id': 'experience', 'coordinate_system': 'IMAGE_NORMALIZED',
                           'polygon': polygon, 'cad_zone_id': None},
            'limitations': ['Track IDs identify within-run observations, not unique customers.',
                           'Image ROI is not a registered CAD business zone.',
                           'Missing detections and end of recording are not verified zone exits.'],
        }

    def append(self, index, media_time, tracks, events):
        self.tracks.update(t['track_id'] for t in tracks)
        self.frames.append({'frame_index': index, 'media_time': round(media_time, 4),
                            'timestamp': round(media_time + self.document['offset_seconds'], 4),
                            'snapshot': f'{index:07d}.jpg', 'tracks': tracks,
                            'event_ids': [e.event_id for e in events]})

    def save(self, output):
        counts = [len(f['tracks']) for f in self.frames]
        self.document.update(frames=self.frames, sampled_frames=len(self.frames),
            observation_count=sum(counts), track_count=len(self.tracks),
            max_simultaneous_tracks=max(counts, default=0))
        (output / 'observations.json').write_text(
            json.dumps(self.document, ensure_ascii=False, allow_nan=False), encoding='utf-8')
        return {'observation_run_id': self.run_id, 'track_observations': sum(counts),
                'track_count': len(self.tracks)}

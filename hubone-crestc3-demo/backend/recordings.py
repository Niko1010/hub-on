"""Read-only access to observations owned by the existing Session/Asset store."""
import json
import subprocess

from fastapi.responses import FileResponse

from fastapi import APIRouter, HTTPException, Query


def prepare_playback(source, output):
    """Browser-compatible derivative; preserve the original and avoid any inference."""
    target = output / 'playback.mp4'
    try:
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-n', '-i', str(source),
            '-map', '0:v:0', '-map', '0:a?', '-c:v', 'libx264', '-preset', 'fast',
            '-crf', '20', '-vf', 'setsar=1', '-c:a', 'aac', '-movflags', '+faststart',
            str(target)], check=True, capture_output=True, timeout=120)
        return 'READY'
    except (OSError, subprocess.SubprocessError):
        return 'NOT_CONNECTED'


def create_recording_router(store):
    router = APIRouter(tags=['Recorded vision'])

    @router.get('/api/sessions/{sid}/assets/{aid}/observations')
    def observations(sid: str, aid: str, offset: int = Query(0, ge=0),
                     limit: int = Query(250, ge=1, le=1000), run_id: str | None = None):
        asset = store.asset(sid, aid)
        if asset['kind'] != 'video':
            raise HTTPException(422, 'Track observations require a video asset')
        path = store.root / 'frames' / sid / aid / 'observations.json'
        if not path.is_file():
            raise HTTPException(404, 'NOT CONNECTED: this asset has no saved track observations; analyze the recording first')
        data = json.loads(path.read_text(encoding='utf-8'))
        if data['session_id'] != sid or data['asset_id'] != aid:
            raise HTTPException(409, 'Observation ownership mismatch')
        if run_id and data['run_id'] != run_id:
            raise HTTPException(409, 'Analysis changed; reload observations from the beginning')
        # Never relabel a simulated Session or Asset as a real recording.
        simulated = bool(store.session(sid)['simulated'] or asset.get('simulated') or data['simulated'])
        frames = data.pop('frames')
        return {**data, 'simulated': simulated,
                'recording_mode': 'SIMULATED' if simulated else asset.get('recording_mode', 'NOT_CONNECTED'),
                'input_origin': asset.get('input_origin', 'USER_PROVIDED'),
                'asset_sha256': asset.get('sha256'), 'frames': frames[offset:offset + limit],
                'total': len(frames), 'offset': offset, 'limit': limit,
                'events_url': f'/api/sessions/{sid}/events'}

    @router.get('/api/sessions/{sid}/assets/{aid}/playback')
    def playback(sid: str, aid: str):
        asset = store.asset(sid, aid)
        directory = store.root / 'frames' / sid / aid
        manifest = directory / 'observations.json'
        if asset['kind'] != 'video' or not manifest.is_file():
            raise HTTPException(404, 'Playback NOT CONNECTED')
        data = json.loads(manifest.read_text(encoding='utf-8'))
        if data.get('playback_status') != 'READY' or not (directory / 'playback.mp4').is_file():
            raise HTTPException(404, 'Playback NOT CONNECTED')
        return FileResponse(directory / 'playback.mp4', media_type='video/mp4')

    return router

"""Local, single-camera RTSP controls. Never accepts credential-bearing URLs."""
import re

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from vision.live import LiveManager
from backend.models import SessionCreate


def create_live_router(store):
    manager=LiveManager(store)
    router=APIRouter(prefix='/api/live',tags=['RTSP LIVE'])

    @router.get('/status')
    def status():return manager.status()

    @router.post('/start',status_code=202)
    def start(body:SessionCreate | None = None):
        try:return manager.start(body if body and body.model_fields_set else None)
        except ValueError as exc:raise HTTPException(409,str(exc)) from None

    @router.post('/stop',status_code=202)
    def stop():return manager.stop()

    @router.get('/sessions')
    def sessions():return {'items':manager.live.sessions()}

    def require_session(sid):
        try:return manager.live.session(sid)
        except KeyError:raise HTTPException(404,'Live Session not found') from None

    @router.get('/sessions/{sid}')
    def session(sid:str):return require_session(sid)

    @router.get('/sessions/{sid}/observations')
    def observations(sid:str,after:int=Query(0,ge=0),limit:int=Query(200,ge=1,le=1000)):
        require_session(sid)
        return manager.live.observations(sid,after,limit)

    @router.get('/sessions/{sid}/frames/{name}')
    def frame(sid:str,name:str):
        require_session(sid)
        if not re.fullmatch(r'\d{12}\.jpg',name):raise HTTPException(404,'Frame not found')
        path=store.root/'live_frames'/sid/name
        if not path.is_file():raise HTTPException(404,'Frame not found')
        return FileResponse(path,media_type='image/jpeg',headers={'Cache-Control':'no-store'})

    return router,manager

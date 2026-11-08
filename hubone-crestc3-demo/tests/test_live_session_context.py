from types import SimpleNamespace
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from backend.live import create_live_router
from backend.models import SessionCreate,ResearchBrief
from database.store import Store
from vision.live import LiveManager

def test_acl_live_session_keeps_product_and_research_without_changing_legacy(tmp_path,monkeypatch):
    manager=LiveManager(Store(tmp_path),configuration_check=lambda:True)
    monkeypatch.setattr('vision.live.threading.Thread',lambda **kw:SimpleNamespace(start=lambda:None,is_alive=lambda:False))
    body=SessionCreate(name='ACL Knee Brace · Wearable Product Experience Test',product='ACL Knee Brace',
        research=ResearchBrief(question='支具穿戴与调整有哪些可观察困难？',tasks=['接近产品','拿取','穿戴','调整绑带','站立','行走','脱下','体验反馈']))
    state=manager.start(body)
    try:
        actual=manager.store.session(state['session_id'])
        assert actual['product']=='ACL Knee Brace' and actual['research']==body.research.model_dump()
        assert not actual['simulated'] and state['source_mode']=='LIVE'
        assert state['cad_status']=='NOT_CONNECTED' and state['floor_id'] is None
    finally:manager.lease.close()
    legacy=manager.start()
    try:assert manager.store.session(legacy['session_id'])['product']=='家庭摄像头持续采集'
    finally:manager.lease.close()

def test_simulated_session_rejected_before_capture_or_session_creation(tmp_path):
    manager=LiveManager(Store(tmp_path),configuration_check=lambda:True)
    with pytest.raises(ValueError,match='non-simulated'):manager.start(SessionCreate(simulated=True))
    assert manager.store.sessions()==[] and manager.lease is None

def test_optional_request_is_backward_compatible_and_typed(tmp_path,monkeypatch):
    router,manager=create_live_router(Store(tmp_path));calls=[]
    monkeypatch.setattr(manager,'start',lambda body=None:calls.append(body) or {'status':'TEST_ONLY'})
    app=FastAPI();app.include_router(router)
    with TestClient(app) as client:
        assert client.post('/api/live/start').status_code==202 and calls[-1] is None
        assert client.post('/api/live/start',json={}).status_code==202 and calls[-1] is None
        assert client.post('/api/live/start',json={'product':'ACL Knee Brace','name':'ACL test'}).status_code==202
        assert isinstance(calls[-1],SessionCreate) and calls[-1].product=='ACL Knee Brace'
        assert client.post('/api/live/start',json={'secret':'not-permitted'}).status_code==422

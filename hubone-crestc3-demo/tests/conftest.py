from pathlib import Path
import sys
import time
import json

import pytest
from fastapi.testclient import TestClient

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))

from backend.main import create_app


def pytest_collection_modifyitems(config,items):
    """Public exports retain render geometry, not private lossless CAD source."""
    path=ROOT/'space_intelligence/data/floor_1.json'
    if not path.is_file() or not json.loads(path.read_text(encoding='utf-8')).get('publication_scope'):
        return
    needs_private_cad={'test_rebuild_is_deterministic_and_does_not_modify_originals',
        'test_nested_transforms_reproduce_original_xyz_and_svg_projection',
        'test_3d_data_keeps_z_without_inventing_height_or_floor_registration',
        'test_model_reuses_json_and_is_reproducible'}
    for item in items:
        if item.originalname in needs_private_cad:
            item.add_marker(pytest.mark.skip(reason='Requires private original CAD/lossless tags; public export contains prebuilt geometry only.'))


@pytest.fixture
def client(tmp_path):
    with TestClient(create_app(tmp_path)) as c:
        yield c


@pytest.fixture
def sid(client):
    return client.post('/api/sessions',json={'name':'测试体验'}).json()['session_id']


def wait_job(client,sid,job_id,timeout=180):
    started=time.monotonic()
    while time.monotonic()-started<timeout:
        response=client.get(f'/api/sessions/{sid}/jobs/{job_id}')
        assert response.status_code==200
        job=response.json()
        if job['status'] in ('failed','completed'):
            return job
        time.sleep(.05)
    raise AssertionError('Job timeout')

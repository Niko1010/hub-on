"""The 3D presentation must not turn inferred geometry or demo heights into facts."""
import hashlib
import json
from pathlib import Path

import numpy as np
import pytest
from shapely.geometry import Polygon

from backend.config import ROOT
from space_intelligence.modeling.build import model_floor

DATA=ROOT/'space_intelligence/data'


@pytest.fixture(scope='module',params=['floor_1','floor_2'])
def model_pair(request):
    fid=request.param
    return json.loads((DATA/f'{fid}.json').read_text(encoding='utf-8')),json.loads((DATA/f'{fid}_model.json').read_text(encoding='utf-8'))


def test_model_reuses_json_and_is_reproducible(model_pair):
    floor,model=model_pair
    before=hashlib.sha256((DATA/f'{floor["floor_id"]}.json').read_bytes()).hexdigest()
    assert model_floor(floor)==model
    assert hashlib.sha256((DATA/f'{floor["floor_id"]}.json').read_bytes()).hexdigest()==before
    assert model['source_sha256']==floor['source']['sha256']
    assert model['level'] in (1,2) and model['unit']=='mm'


def test_all_scene_objects_trace_to_source_ids(model_pair):
    floor,model=model_pair;ids={e['entity_id'] for e in floor['entities']}
    assert model['statistics']['column']>100 and model['statistics']['wall_plane']>100
    for c in model['components']:
        assert c['spatial_id'] in ids and set(c['source_entity_ids'])<=ids
        assert c['height_mm'] is None
    for r in model['regions']:
        assert r['floor_id']==floor['floor_id'] and r['zone_id'] is None
        assert r['verification_status']=='PENDING_REVIEW' and r['simulated'] is False
        assert r['source_entity_ids'] and set(r['source_entity_ids'])<=ids
        assert Polygon(r['footprint']['outer'],r['footprint']['holes']).is_valid
    assert len({r['spatial_id'] for r in model['regions']})==len(model['regions'])


def test_survey_unknowns_and_presentation_reconstruction_are_explicit(model_pair):
    floor,model=model_pair
    assert model['vertical_reference']==floor['vertical_reference']
    assert model['vertical_reference']['floor_elevation_mm'] is None
    assert model['vertical_reference']['floor_to_floor_height_mm'] is None
    assert model['demo_height_defaults_mm']['input_origin']=='SIMULATED'
    assert model['presentation_slab']['status']=='SIMULATED_RECONSTRUCTION'
    assert model['presentation_slab']['thickness_mm'] is None
    assert model['presentation_slab']['pixel_mm']==50
    assert model['business_zones']==[]
    for p in model['presentation_slab']['footprints']:
        assert Polygon(p['outer'],p['holes']).is_valid


def test_registration_is_an_actual_shared_axis_instance_and_camera_matches(model_pair):
    floor,model=model_pair;r=model['registration']
    ref=next(c for c in floor['containers'] if c['entity_id']==r['source_spatial_id'])
    assert ref['block_name']=='A$C138296ba'
    assert r['origin_wcs_mm']==ref['block_to_wcs_matrix44'][12:15]
    assert r['physical_verification']=='NOT_SURVEYED'
    assert np.allclose(model['demo_camera_wcs_mm'],[(floor['bounds_wcs_mm'][0]+floor['bounds_wcs_mm'][2])/2,
                                                 (floor['bounds_wcs_mm'][1]+floor['bounds_wcs_mm'][3])/2])


def test_model_endpoint_is_readonly_and_separate(client):
    for fid in ['floor_1','floor_2']:
        r=client.get(f'/api/v1/floors/{fid}/model')
        assert r.status_code==200 and r.json()['floor_id']==fid
        assert r.json()['business_zones']==[]
    assert client.get('/api/v1/floors/floor_3/model').status_code==404
    assert client.get('/api/v1/zones').json()['items']==[]
    assert client.get('/api/v1/cameras').json()['items']==[]
    assert client.get('/api/v1/events?include_simulated=true').json()['items']==[]

"""Acceptance of source fidelity, WCS/3D contracts and isolation from C3."""
import hashlib
import json
import math
from pathlib import Path
import xml.etree.ElementTree as ET

import pytest
from ezdxf.math import Matrix44, Vec3
from pydantic import ValidationError

from backend.config import ROOT
from space_intelligence.cad.extract import extract, SOURCE_SHA256
from space_intelligence.models import Camera
from space_intelligence.repository import SpaceRepository


@pytest.fixture(scope='module')
def spatial():
    return SpaceRepository()


def test_rebuild_is_deterministic_and_does_not_modify_originals(tmp_path):
    source = ROOT / 'space_intelligence/source/guanqian-original.dxf'
    original = source.read_bytes()
    assert hashlib.sha256(original).hexdigest() == SOURCE_SHA256
    extract(source, tmp_path)
    for name in ('floor_1.json', 'floor_2.json', 'floor_1.svg', 'floor_2.svg', 'spatial_metadata.json'):
        assert (tmp_path / name).read_bytes() == (ROOT / 'space_intelligence/data' / name).read_bytes()
    assert source.read_bytes() == original
    manifest = json.loads((source.parent / 'manifest.json').read_text(encoding='utf-8'))
    for asset in manifest['files']:
        assert hashlib.sha256((source.parent / asset['preserved_file']).read_bytes()).hexdigest() == asset['sha256']


def test_floor_assignment_uses_actual_titles_and_excludes_duplicate_plans(spatial):
    assert spatial.metadata['inventory']['insunits'] == 4
    assert len(spatial.metadata['inventory']['layers']) == 74
    assert len(spatial.metadata['inventory']['blocks']) == 204
    assert spatial.metadata['inventory']['audit_errors'] == spatial.metadata['inventory']['audit_fixes'] == 0
    for fid, root, title, count in [('floor_1', '2991', '一层平面图', 5842), ('floor_2', '84F', '二层平面图', 6722)]:
        floor = spatial.geometry(fid)
        assert floor['root_handle'] == root and floor['entity_count'] == count
        assert any(e['source_handle'] == root for e in floor['containers'])
        assert any(e['geometry'].get('text') == title for e in floor['entities'])
        assert not floor['unsupported']
        assert not {'1CEC', '19AA', '1CEB'} & set(floor['selection']['modelspace_handles'])
    assert spatial.metadata['pdf_reference']['rendered_pages_identical'] is True
    assert spatial.floor('floor_2')['pdf_validation'] == 'PENDING_CORRECT_SECOND_FLOOR_PDF'


def test_source_handles_layers_and_instance_ids_are_preserved(spatial):
    seen = set()
    for fid in spatial.floors:
        f = spatial.geometry(fid)
        objects = f['entities'] + f['containers']
        container_ids = {e['entity_id'] for e in f['containers']}
        layers = {v['name'] for v in spatial.metadata['inventory']['layers']}
        for obj in objects:
            assert obj['entity_id'] == obj['spatial_id'] and obj['entity_id'].startswith('guanqian-1:')
            assert obj['entity_id'] not in seen
            seen.add(obj['entity_id'])
            assert obj['source_layer'] in layers and obj['effective_layer'] in layers
            assert obj['source_handle'] in f['source_entities']
            assert set(obj['insert_chain']).issubset(container_ids)
            assert len(obj['world_matrix44']) == 16
        # A repeated door definition keeps the same handle but has distinct instance IDs.
        handles = [e['source_handle'] for e in f['entities']]
        assert len(set(handles)) < len(handles)


def test_nested_transforms_reproduce_original_xyz_and_svg_projection(spatial):
    checked = 0
    for fid in spatial.floors:
        f = spatial.geometry(fid)
        for obj in f['entities']:
            if obj['dxf_type'] == 'LINE' and obj['source_dxf_type'] == 'LINE' and len(obj['insert_chain']) >= 2:
                dxf = f['source_entities'][obj['source_handle']]['dxf']
                expected = Matrix44(obj['world_matrix44']).transform(Vec3(dxf['start']))
                assert obj['geometry']['paths'][0][0] == pytest.approx(list(expected), abs=1e-7)
                checked += 1
        svg = ET.fromstring((spatial.root / f'{fid}.svg').read_text(encoding='utf-8'))
        assert list(map(float, svg.attrib['viewBox'].split())) == pytest.approx(f['svg_view_box'], abs=1e-4)
        ids = [e.attrib['data-entity-id'] for e in svg.iter() if 'data-entity-id' in e.attrib]
        assert set(ids) == {e['entity_id'] for e in f['entities']}
        assert f['crs']['svg_matrix'] == [1, 0, 0, -1, 0, 0]
    assert checked > 100


def test_3d_data_keeps_z_without_inventing_height_or_floor_registration(spatial):
    for fid in spatial.floors:
        f = spatial.geometry(fid)
        assert f['vertical_reference'] == {'floor_elevation_mm': None, 'floor_to_floor_height_mm': None,
                                           'clear_height_mm': None, 'slab_thickness_mm': None,
                                           'status': 'NOT_SURVEYED'}
        assert f['render_frames']['cad_wcs_to_building_matrix44'] is None
        origin = f['render_frames']['floating_origin_wcs_mm']
        for obj in f['entities']:
            assert obj['dimensions_3d']['height_mm'] is None
            pts = [obj['geometry']['position']] if 'position' in obj['geometry'] else [p for line in obj['geometry']['paths'] for p in line]
            assert pts and all(len(p) == 3 and all(math.isfinite(v) for v in p) for p in pts)
        p = next(e['geometry']['paths'][0][0] for e in f['entities'] if e['geometry']['kind'] == 'paths')
        three = [(p[0] - origin[0]) / 1000, (p[2] - origin[2]) / 1000, -(p[1] - origin[1]) / 1000]
        restored = [three[0]*1000 + origin[0], -three[2]*1000 + origin[1], three[1]*1000 + origin[2]]
        assert restored == pytest.approx(p, abs=1e-7)
        # Curved boundaries retain exact source DXF tags as well as display vertices.
        assert any(e['dxf_type'] == 'ARC' and f['source_entities'][e['source_handle']]['tags'] for e in f['entities'])


def test_spatial_apis_are_independent_and_default_to_unconnected(client):
    spaces = client.get('/api/v1/spaces').json()
    assert spaces['items'][0]['building_id'] == 'guanqian-1' and not spaces['simulated']
    floors = client.get('/api/v1/floors').json()['items']
    assert len(floors) == 2 and floors[0]['vertical_reference']['floor_elevation_mm'] is None
    assert client.get('/api/v1/zones').json()['confirmed_zone_count'] is None
    cameras = client.get('/api/v1/cameras').json()
    assert cameras['items'] == [] and cameras['data_status'] == 'NOT_CONNECTED'
    assert cameras['online_real_devices'] is None and cameras['physical_device_count'] is None
    assert client.get('/api/v1/events').json()['items'] == []
    for path in ['/api/v1/floors/missing', '/api/v1/floors/missing/map.svg', '/api/v1/cameras?floor_id=missing',
                 '/api/v1/floors?building_id=missing', '/api/v1/cameras?zone_id=unverified-room']:
        assert client.get(path).status_code == 404
    for f in floors:
        response = client.get(f['geometry_url'])
        assert response.status_code == 200 and response.json()['source']['sha256'] == SOURCE_SHA256
        assert 'image/svg+xml' in client.get(f['svg_url']).headers['content-type']
    assert client.get('/api/v1/cameras?include_simulated=invalid').status_code == 422
    schema = client.get('/openapi.json').json()['components']['schemas']
    assert {'x', 'y', 'z', 'direction', 'field_of_view', 'stream_url', 'status', 'zone_id'} <= schema['Camera']['properties'].keys()
    assert 'height_mm' in schema['Zone']['properties']


def test_camera_fixtures_are_explicit_and_scoped_to_floor(client):
    response = client.get('/api/v1/cameras?floor_id=floor_2&include_simulated=true').json()
    assert response['data_status'] == 'SIMULATED' and len(response['items']) == 1
    c = response['items'][0]
    assert c['floor_id'] == 'floor_2' and c['simulated'] and c['input_origin'] == 'SIMULATED'
    assert c['camera_id'].startswith('SIM-') and c['zone_id'] is None and c['z'] is None
    assert c['stream_url'] is None and c['status'] == 'not_connected'
    assert response['registered_real_devices'] == 0 and response['online_real_devices'] is None
    with pytest.raises(ValidationError):
        Camera.model_validate({**c, 'x': float('nan')})


def test_c3_events_are_linked_only_by_explicit_valid_binding(client):
    sid = client.post('/api/sessions', json={'name': '空间桥接契约 / SIMULATED', 'simulated': True}).json()['session_id']
    base = {'timestamp': 2.5, 'event_type': 'manual_observation', 'source': 'manual', 'description': 'SIMULATED / 空间关联测试'}
    client.post(f'/api/sessions/{sid}/events', json=base).raise_for_status()
    assert client.get('/api/v1/events?include_simulated=true').json()['items'] == []
    metadata = {'spatial': {'building_id': 'guanqian-1', 'floor_id': 'floor_1', 'zone_id': None, 'camera_id': 'SIM-floor_1-01'}}
    event = client.post(f'/api/sessions/{sid}/events', json={**base, 'metadata': metadata}).json()
    assert client.get('/api/v1/events').json()['items'] == []
    linked = client.get(f'/api/v1/events?include_simulated=true&session_id={sid}').json()
    assert linked['total'] == 1 and linked['data_status'] == 'SIMULATED'
    e = linked['items'][0]
    assert (e['session_id'], e['event_id'], e['timestamp']) == (sid, event['event_id'], 2.5)
    assert e['timestamp_basis'] == 'SESSION_RELATIVE_SECONDS' and e['processing_method'] == 'MANUAL'
    assert client.get('/api/v1/events?include_simulated=true&floor_id=floor_2').json()['items'] == []
    # A camera on another floor is not a valid association; legacy events are not rewritten.
    metadata['spatial']['floor_id'] = 'floor_2'
    client.post(f'/api/sessions/{sid}/events', json={**base, 'metadata': metadata}).raise_for_status()
    linked = client.get('/api/v1/events?include_simulated=true').json()
    assert linked['total'] == 1 and linked['invalid_binding_count'] == 1
    assert len(client.get(f'/api/sessions/{sid}/events').json()) == 3


def test_spatial_object_access_is_floor_scoped(client, spatial):
    obj = spatial.geometry('floor_1')['entities'][0]
    path = '/api/v1/floors/floor_1/objects/' + obj['entity_id']
    detail = client.get(path).json()
    assert detail['source_entity']['dxf']['handle'] == obj['source_handle']
    assert client.get(path.replace('floor_1/objects', 'floor_2/objects')).status_code == 404
    assert client.get('/api/v1/events?limit=1001').status_code == 422

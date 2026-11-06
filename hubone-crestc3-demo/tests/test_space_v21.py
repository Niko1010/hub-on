"""Geometric invariants for the new presentation layer, independent of its renderer."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from shapely.geometry import Polygon,LineString,Point
from shapely.ops import unary_union
import pytest

ROOT=Path(__file__).resolve().parents[1]
NEW=ROOT/'frontend/space-v21-data'


def read(name):return json.loads((NEW/name).read_text(encoding='utf-8'))


def polygon(p):return Polygon([(v[0]/1000,v[1]/1000) for v in p['outer']], [[(v[0]/1000,v[1]/1000) for v in h] for h in p.get('holes',[])])


def test_original_cad_and_models_unchanged():
    for name,digest in read('surfaces.json')['original_data_sha256'].items():
        assert hashlib.sha256((ROOT/'space_intelligence/data'/name).read_bytes()).hexdigest()==digest


def test_opening_is_supported_by_source_symbol_and_closed_linework():
    original=json.loads((ROOT/'space_intelligence/data/floor_2.json').read_text(encoding='utf-8'))
    model=json.loads((ROOT/'space_intelligence/data/floor_2_model.json').read_text(encoding='utf-8'))
    hole=read('surfaces.json')['floors']['floor_2']['openings'][0]
    source=next(e for e in original['entities'] if e['entity_id']==hole['source_entity_id'])
    assert source['source_handle']=='189F' and source['effective_layer']=='建-孔'
    path=source['geometry']['paths'][0]
    assert path[0]!=path[-1]  # An open symbol must not be arbitrarily closed into a triangle.
    faces=[polygon(r['footprint']) for r in model['regions'] if r['spatial_id'] in hole['boundary_region_ids']]
    expected=unary_union(faces);actual=unary_union([polygon(p) for p in hole['footprints']])
    assert len(faces)==2 and actual.symmetric_difference(expected).area<1e-7
    assert actual.area==pytest.approx(hole['area_m2'],abs=.0001)
    assert 180<actual.area<195 and hole['boundary_source_entity_ids']


def test_opening_is_not_filled_by_any_display_surface_or_picking_proxy():
    data=read('surfaces.json')['floors']['floor_2'];hole=unary_union([polygon(p) for p in data['openings'][0]['footprints']])
    surface=unary_union([polygon(p) for p in data['surfaces']])
    assert surface.intersection(hole).area<1e-7
    assert not surface.covers(Point(*[v/1000 for v in data['openings'][0]['sample_wcs_mm']]))
    assert surface.area>4000
    for proxy in data['region_picking_proxies'].values():assert polygon(proxy['footprint']).intersection(hole).area<1e-7


def test_upper_opening_is_not_cut_from_wrong_floor():
    first=read('surfaces.json')['floors']['floor_1']
    assert first['openings']==[] and len(first['upper_opening_references'])==1
    assert first['upper_opening_references'][0]['target_floor_id'] is None
    assert first['display_surface_area_m2']==pytest.approx(first['source_surface_area_m2'])


def test_stair_reserved_faces_retain_actual_source_and_do_not_claim_riser_heights():
    second=read('surfaces.json')['floors']['floor_2'];source=json.loads((ROOT/'space_intelligence/data/floor_2.json').read_text(encoding='utf-8'));byid={e['entity_id']:e for e in source['entities']}
    surface=unary_union([polygon(p) for p in second['surfaces']]);assert len(second['stair_plan_reservations'])==4
    for reserve in second['stair_plan_reservations']:
        assert byid[reserve['direction_annotation_id']]['geometry']['text'] in ['上','下']
        assert reserve['source_entity_ids'] and 'not a confirmed vertical void' in reserve['status']
        for p in reserve['footprints']:assert surface.intersection(polygon(p)).area<1e-7


def test_registration_preserves_original_axes_units_and_true_unknown_dimensions():
    e=read('envelope.json');s=read('surfaces.json')
    assert e['floor_ids']==['floor_1','floor_2'] and not e['extra_floors_created']
    assert e['origin_wcs_mm']==s['floors']['floor_2']['registration']['origin_wcs_mm']
    assert e['cad_unit']=='mm' and e['display_unit']=='m'
    assert all(v is None for v in e['real_dimensions'].values())
    assert e['display_parameters']['input_origin']=='SIMULATED' and read('site.json')['status']=='SIMULATED'
    for fid,data in s['floors'].items():
        model=json.loads((ROOT/('space_intelligence/data/'+fid+'_model.json')).read_text(encoding='utf-8'))
        assert data['registration']==model['registration']
        assert all(data['vertical_reference'][k] is None for k in ['floor_elevation_mm','floor_to_floor_height_mm','clear_height_mm'])


def test_roof_pieces_cover_only_original_plan_envelope_and_have_no_new_storeys():
    e=read('envelope.json');outer=Polygon(e['outline_local_xy_m']);pieces=unary_union([Polygon(p['outer']) for p in e['roof_sections']])
    assert outer.is_valid and pieces.symmetric_difference(outer).area<.002
    assert all(p['input_origin']=='SIMULATED' for p in e['roof_sections'])


def test_preparation_is_deterministic_and_does_not_modify_input():
    paths=list(NEW.glob('*.json'));before={p.name:p.read_bytes() for p in paths}
    subprocess.run([sys.executable,str(ROOT/'scripts/prepare_space_v21_data.py')],cwd=ROOT,check=True,capture_output=True)
    assert before=={p.name:p.read_bytes() for p in paths}
    test_original_cad_and_models_unchanged()

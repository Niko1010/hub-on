"""Reproducible extraction of the supplied Guanqian DXF, without editing it.

Floor membership is an explicit, source-specific manifest, checked against
original title handles and INSERTs. Curves are tessellated only for display;
the original entity tags, OCS, bulges and INSERT matrices are kept in JSON.
"""
from __future__ import annotations

import argparse
from collections import Counter, defaultdict
import hashlib
import html
import json
import math
from pathlib import Path

import ezdxf
from ezdxf import bbox, path as cad_path
from ezdxf.lldxf.tagwriter import TagCollector
from ezdxf.math import Matrix44, Vec3

ROOT = Path(__file__).resolve().parents[2]
MODULE = ROOT / 'space_intelligence'
BUILDING_ID = 'guanqian-1'
SOURCE_SHA256 = '7843ed6b0ba393213ddcd2bb54187acd9f41cec346702a0e6f32717c0f6b8b48'
TOLERANCE_MM = 2.0
FLOORS = [
    {'floor_id': 'floor_1', 'name': '一层', 'level': 1,
     'root_handle': '2991', 'block_name': 'A$C0ae5c80e',
     'title_handle': '50A5', 'title_text': '一层平面图',
     'window': [-10000, -451500, 165000, -380000],
     'excluded_crossing_handles': ['833', '4E29', '4E2A'],
     'pdf_validation': 'MATCHED_BUILDING_GEOMETRY_WITH_ANNOTATION_DIFFERENCES'},
    {'floor_id': 'floor_2', 'name': '二层', 'level': 2,
     'root_handle': '84F', 'block_name': 'A$C6a5ca085',
     'title_handle': '501A', 'title_text': '二层平面图',
     'window': [300000, -451500, 470000, -380000],
     'excluded_crossing_handles': ['833', '4E2B', '4E2C', '4E2D', '4E2E'],
     'pdf_validation': 'PENDING_CORRECT_SECOND_FLOOR_PDF'},
]


def clean(value):
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    if isinstance(value, dict):
        return {str(k): clean(v) for k, v in value.items()}
    try:
        return [clean(v) for v in value]
    except TypeError:
        return str(value)


def source_entity(entity):
    collector = TagCollector(dxfversion='AC1027')
    entity.export_dxf(collector)
    return {'dxf_type': entity.dxftype(), 'dxf': clean(entity.dxfattribs()),
            'tags': [[t.code, clean(t.value)] for t in collector.tags]}


def category(layer):
    # Display categories are a view over layers, never a layer merge or a BIM claim.
    if any(v in layer for v in ['门', '窗', '幕墙', 'WINDOW', 'GLASS']):
        return 'door_window'
    if any(v in layer for v in ['墙', 'WALL']):
        return 'wall_column'
    if any(v in layer for v in ['楼梯', '扶梯', '栏杆', 'BAR']):
        return 'stair_railing'
    if any(v in layer for v in ['文字', '名称', 'TEXT', 'TEXT', 'TITLE', 'SYMB', 'DIM', 'AXIS', 'DOTE']):
        return 'annotation'
    return 'other'


def transformed_geometry(entity, matrix):
    kind = entity.dxftype()
    if kind in ('TEXT', 'MTEXT', 'ATTRIB', 'ATTDEF'):
        # Attributes without values are definitions, not invented label values.
        text = entity.plain_text() if hasattr(entity, 'plain_text') else entity.dxf.get('text', '')
        p = matrix.transform(entity.ocs().to_wcs(entity.dxf.insert)) if kind != 'MTEXT' else matrix.transform(entity.dxf.insert)
        angle = math.radians(entity.dxf.get('rotation', 0))
        direction = entity.dxf.get('text_direction', None) if kind == 'MTEXT' else None
        if direction is None:
            direction = Vec3(math.cos(angle), math.sin(angle), 0)
        else:
            direction = Vec3(direction)
        direction = matrix.transform_direction(direction)
        y_axis = matrix.transform_direction(Vec3(0, 1, 0)).magnitude
        return {'kind': 'text', 'position': list(p), 'text': text,
                'height': (entity.dxf.char_height if kind == 'MTEXT' else entity.dxf.height) * y_axis,
                'rotation': math.degrees(math.atan2(direction.y, direction.x)),
                'alignment': {'halign': entity.dxf.get('halign', 0) if kind != 'MTEXT' else None,
                              'valign': entity.dxf.get('valign', 0) if kind != 'MTEXT' else None},
                'render_note': 'Readable Unicode label; CAD SHX font metrics are not reproduced.'}
    if kind == 'POINT':
        return {'kind': 'point', 'position': list(matrix.transform(entity.dxf.location))}
    if kind == 'HATCH':
        paths = list(cad_path.from_hatch(entity))
    elif kind in ('SOLID', 'TRACE', '3DFACE'):
        verts = list(entity.wcs_vertices()) if hasattr(entity, 'wcs_vertices') else [entity.dxf.get(f'vtx{i}') for i in range(4)]
        points = [list(matrix.transform(Vec3(v))) for v in verts]
        return {'kind': 'paths', 'paths': [points + [points[0]]], 'filled': True}
    else:
        paths = [cad_path.make_path(entity)]
    result = []
    for p in paths:
        # Flatten AFTER the full affine transform, so the tolerance is in WCS mm.
        p = p.transform(matrix)
        points = [list(v) for v in p.flattening(TOLERANCE_MM, segments=4)]
        if points:
            result.append(points)
    return {'kind': 'paths', 'paths': result, 'filled': kind == 'HATCH',
            'display_tolerance_mm': TOLERANCE_MM}


def geom_bounds(geometry):
    if geometry['kind'] in ('point', 'text'):
        x, y, _ = geometry['position']
        h = geometry.get('height', 0)
        w = h * max(1, len(geometry.get('text', '')))  # Only a picking/display box.
        return [x, y, x + w, y + h]
    pts = [p for line in geometry['paths'] for p in line]
    if not pts:
        return None
    return [min(p[0] for p in pts), min(p[1] for p in pts), max(p[0] for p in pts), max(p[1] for p in pts)]


def expand_floor(doc, spec, cache):
    root, title = doc.entitydb[spec['root_handle']], doc.entitydb[spec['title_handle']]
    if root.dxftype() != 'INSERT' or root.dxf.name != spec['block_name'] or title.dxf.text != spec['title_text']:
        raise ValueError('Floor manifest does not match the original DXF; manual review required.')
    win = spec['window']
    selected, crossing = [], []
    for entity in doc.modelspace():
        b = bbox.extents([entity], fast=True, cache=cache)
        if not b.has_data:
            continue
        inside = win[0] <= b.extmin.x and b.extmax.x <= win[2] and win[1] <= b.extmin.y and b.extmax.y <= win[3]
        intersects = b.extmax.x >= win[0] and b.extmin.x <= win[2] and b.extmax.y >= win[1] and b.extmin.y <= win[3]
        if inside:
            selected.append(entity)
        elif intersects:
            crossing.append(entity.dxf.handle)
    if root not in selected or title not in selected or set(crossing) != set(spec['excluded_crossing_handles']):
        raise ValueError(f"Ambiguous floor selection {spec['floor_id']}: {crossing}")
    floor_id = spec['floor_id']
    entities, containers, unsupported = [], [], []

    def visit(entity, matrix, chain, inherited_layer='0', ancestors=(), part=None):
        original = getattr(entity, 'source_of_copy', None) or entity
        handle = original.dxf.get('handle') or entity.dxf.get('handle')
        token = handle or f'virtual-{part}'
        address = [v['instance_token'] for v in chain] + [token]
        if part is not None:
            address.append(str(part))
        eid = BUILDING_ID + ':' + floor_id + ':cad-' + hashlib.sha256('/'.join(address).encode()).hexdigest()[:20]
        layer = original.dxf.get('layer', entity.dxf.get('layer', '0'))
        effective = inherited_layer if layer == '0' else layer
        if handle:
            source_cache.setdefault(handle, source_entity(original))
        kind = entity.dxftype()
        base = {'entity_id': eid, 'building_id': BUILDING_ID, 'floor_id': floor_id,
                'source_handle': handle, 'source_layer': layer, 'effective_layer': effective,
                'source_dxf_type': original.dxftype(), 'derived_part_index': part,
                'dxf_type': kind, 'source_block': ancestors[-1] if ancestors else '*Model_Space',
                'parent_entity_id': chain[-1]['entity_id'] if chain else None,
                'insert_chain': [v['entity_id'] for v in chain],
                'world_matrix44': list(matrix), 'category': category(effective),
                'spatial_id': eid, 'zone_id': None,
                'geometry_coordinate_system': 'guanqian-dxf-wcs',
                'dimensions_3d': {'base_elevation_mm': None, 'height_mm': None,
                                  'extrusion_mm': None, 'status': 'NOT_SURVEYED'},
                'semantic_status': 'CAD_LAYER_ONLY',
                'simulated': False, 'processing_method': 'RULE_BASED', 'input_origin': 'USER_PROVIDED_CAD'}
        if kind == 'INSERT':
            name = entity.dxf.name
            if name in ancestors:
                raise ValueError(f'Cyclic INSERT {name}')
            m = entity.matrix44() @ matrix
            containers.append({**base, 'block_name': name, 'block_to_wcs_matrix44': list(m),
                               'attributes': [source_entity(a) for a in entity.attribs]})
            next_chain = chain + [{'entity_id': eid, 'instance_token': token}]
            for child in doc.blocks[name]:
                visit(child, m, next_chain, effective, ancestors + (name,))
            for i, child in enumerate(entity.attribs):
                visit(child, matrix, next_chain, effective, ancestors, i)
        elif kind in ('DIMENSION', 'MLINE'):
            containers.append({**base, 'geometry_block': entity.dxf.get('geometry', None) if kind == 'DIMENSION' else None})
            try:
                for i, child in enumerate(entity.virtual_entities()):
                    visit(child, matrix, chain + [{'entity_id': eid, 'instance_token': token}], effective, ancestors, i)
            except (AttributeError, NotImplementedError) as exc:
                unsupported.append({**base, 'reason': type(exc).__name__})
        else:
            try:
                geometry = transformed_geometry(entity, matrix)
                bounds = geom_bounds(geometry)
                if bounds:
                    entities.append({**base, 'geometry': geometry, 'bounds': bounds})
                else:
                    unsupported.append({**base, 'reason': 'Empty display geometry; original retained'})
            except (TypeError, AttributeError, NotImplementedError, ValueError) as exc:
                unsupported.append({**base, 'reason': type(exc).__name__})

    source_cache = {}
    for entity in selected:
        visit(entity, Matrix44(), [])
    bounds3 = bbox.extents(selected, fast=True, cache=cache)
    bounds = [bounds3.extmin.x, bounds3.extmin.y, bounds3.extmax.x, bounds3.extmax.y]
    width, height = bounds[2] - bounds[0], bounds[3] - bounds[1]
    pad = max(width, height) * .025
    svg_box = [bounds[0] - pad, -bounds[3] - pad, width + 2 * pad, height + 2 * pad]
    layers = []
    counts = Counter(e['source_layer'] for e in entities)
    for layer in doc.layers:
        if layer.dxf.name in counts:
            layers.append({'name': layer.dxf.name, 'count': counts[layer.dxf.name],
                           'color_index': layer.dxf.color, 'linetype': layer.dxf.linetype,
                           'off': layer.is_off(), 'frozen': layer.is_frozen()})
    origin = list(root.dxf.insert)
    return {'schema_version': '0.2.0', **{k: v for k, v in spec.items() if k != 'window'},
            'spatial_id': BUILDING_ID + ':' + floor_id,
            'building_id': BUILDING_ID, 'data_status': 'CAD_SOURCE', 'simulated': False,
            'vertical_reference': {'floor_elevation_mm': None, 'floor_to_floor_height_mm': None,
                                   'clear_height_mm': None, 'slab_thickness_mm': None,
                                   'status': 'NOT_SURVEYED'},
            'crs': {'id': 'guanqian-dxf-wcs', 'unit': 'mm', 'insunits': 4,
                    'axes': 'Original DXF WCS X/Y/Z; Z is drawing geometry, not floor elevation',
                    'floor_elevation_mm': None, 'svg_matrix': [1, 0, 0, -1, 0, 0],
                    'svg_formula': 'svg_x = cad_x; svg_y = -cad_y',
                    'meters_formula': 'meters = millimeters / 1000',
                    'cross_floor_registration': 'NOT_SURVEYED; sheet placements are not physical floor alignment'},
            'render_frames': {'cad_wcs_to_building_matrix44': None,
                              'building_registration_status': 'NOT_SURVEYED',
                              'floating_origin_wcs_mm': origin,
                              'threejs_local_meters_formula': {
                                  'x': '(cad_x - origin_x) / 1000',
                                  'y': '(cad_z - origin_z) / 1000',
                                  'z': '-(cad_y - origin_y) / 1000'},
                              'note': 'Rendering-only floating origin, not a surveyed floor alignment or elevation.'},
            'selection': {'method': 'EXPLICIT_TITLE_AND_INSERT_WITH_NONCLIPPING_ANNOTATION_WINDOW',
                          'annotation_window_wcs_mm': win, 'modelspace_handles': [e.dxf.handle for e in selected],
                          'crossing_handles': crossing},
            'bounds_wcs_mm': bounds, 'z_range_mm': [bounds3.extmin.z, bounds3.extmax.z],
            'svg_view_box': svg_box, 'layers': layers,
            'entity_count': len(entities), 'container_count': len(containers),
            'category_counts': dict(Counter(e['category'] for e in entities)),
            'entities': entities, 'containers': containers, 'unsupported': unsupported,
            'source_entities': source_cache,
            'zone_status': 'NOT_CONNECTED', 'zones': [],
            'notes': ['Closed CAD outlines are not automatically treated as business zones or rooms.',
                      'Original CAD layers are retained independently. Display categories are RULE_BASED.',
                      'Curves are approximated for SVG/picking only. Exact DXF tags are retained in source_entities.']}


def svg_string(floor):
    esc = lambda value: html.escape(str(value), quote=True)
    fmt = lambda v: f'{v:.4f}'.rstrip('0').rstrip('.') if v else '0'
    colors = {'wall_column': '#355578', 'door_window': '#88a7c8', 'stair_railing': '#6c8baa',
              'annotation': '#93a6bc', 'other': '#9bacc0'}
    groups = defaultdict(list)
    for obj in floor['entities']:
        g = obj['geometry']
        attrs = f'data-entity-id="{esc(obj["entity_id"])}" data-category="{obj["category"]}" data-source-handle="{esc(obj["source_handle"])}"'
        title = f'<title>{esc(obj["source_layer"])} · {esc(obj["dxf_type"])} · {esc(obj["source_handle"])}</title>'
        color = colors[obj['category']]
        if g['kind'] == 'text':
            x, y, _ = g['position']
            # Text remains upright despite the CAD Y-up to SVG Y-down transform.
            node = f'<text {attrs} x="0" y="0" transform="translate({fmt(x)} {fmt(-y)}) rotate({fmt(-g["rotation"])})" font-size="{fmt(g["height"])}" fill="{color}" stroke="none">{title}{esc(g["text"])}</text>'
        elif g['kind'] == 'point':
            x, y, _ = g['position']
            node = f'<circle {attrs} cx="{fmt(x)}" cy="{fmt(-y)}" r="12" fill="{color}">{title}</circle>'
        else:
            d = ' '.join('M' + ' L'.join(f'{fmt(p[0])},{fmt(-p[1])}' for p in line) for line in g['paths'] if line)
            fill = color if g['filled'] else 'none'
            node = f'<path {attrs} d="{d}" fill="{fill}" fill-opacity="{.42 if g["filled"] else 1}" fill-rule="evenodd" stroke="{color}" stroke-width="{.3 if g["filled"] else .75}" vector-effect="non-scaling-stroke">{title}</path>'
        groups[obj['source_layer']].append(node)
    vb = ' '.join(fmt(v) for v in floor['svg_view_box'])
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{esc(floor["name"])}原始 CAD 空间地图" data-floor-id="{floor["floor_id"]}" font-family="Roboto, Noto Sans CJK SC, Microsoft YaHei, sans-serif">',
             '<desc>Original DXF geometry. Units mm. SVG X=CAD X, SVG Y=-CAD Y. Business zones and devices are not connected.</desc>']
    for layer, nodes in groups.items():
        parts.append(f'<g data-cad-layer="{esc(layer)}">' + ''.join(nodes) + '</g>')
    parts.append('</svg>')
    return '\n'.join(parts)


def extract(source, output):
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    if digest != SOURCE_SHA256:
        raise ValueError('This floor manifest is only approved for the supplied DXF hash. Review the new file first.')
    doc = ezdxf.readfile(source)
    if doc.units != 4:
        raise ValueError('Unexpected coordinate units; do not guess.')
    audit = doc.audit()
    if audit.errors or audit.fixes:
        raise ValueError('DXF audit requires review; extraction will not silently repair the source.')
    output.mkdir(parents=True, exist_ok=True)
    cache = bbox.Cache()
    floors = [expand_floor(doc, spec, cache) for spec in FLOORS]
    all_bounds = bbox.extents(doc.modelspace(), fast=True, cache=cache)
    inventory = {'dxf_version': doc.dxfversion, 'encoding': doc.encoding, 'insunits': doc.units,
                 'measurement': doc.header.get('$MEASUREMENT'), 'insbase': clean(doc.header.get('$INSBASE')),
                 'header_extmin': clean(doc.header.get('$EXTMIN')), 'header_extmax': clean(doc.header.get('$EXTMAX')),
                 'computed_model_bounds': [list(all_bounds.extmin), list(all_bounds.extmax)],
                 'audit_errors': len(audit.errors), 'audit_fixes': len(audit.fixes),
                 'modelspace_types': dict(Counter(e.dxftype() for e in doc.modelspace())),
                 'layouts': [{'name': l.name, 'block_record_handle': l.block_record_handle,
                              'types': dict(Counter(e.dxftype() for e in l))} for l in doc.layouts],
                 'layers': [{'name': l.dxf.name, 'handle': l.dxf.handle, 'color': l.dxf.color,
                             'linetype': l.dxf.linetype, 'off': l.is_off(), 'frozen': l.is_frozen()}
                            for l in doc.layers],
                 'blocks': [{'name': b.name, 'base_point': list(b.base_point),
                             'types': dict(Counter(e.dxftype() for e in b))} for b in doc.blocks],
                 'modelspace_inserts': [{'handle': e.dxf.handle, 'name': e.dxf.name, 'layer': e.dxf.layer,
                                         'dxf': clean(e.dxfattribs()), 'matrix44': list(e.matrix44())}
                                        for e in doc.modelspace().query('INSERT')]}
    summaries = []
    for floor in floors:
        fid = floor['floor_id']
        floor['source'] = {'file': source.name, 'sha256': digest}
        (output / f'{fid}.json').write_text(json.dumps(floor, ensure_ascii=False, separators=(',', ':')), encoding='utf-8', newline='\n')
        (output / f'{fid}.svg').write_text(svg_string(floor), encoding='utf-8', newline='\n')
        summaries.append({k: v for k, v in floor.items() if k not in ('entities', 'containers', 'source_entities')})
    metadata = {'schema_version': '0.2.0', 'building_id': BUILDING_ID, 'name': '苏州观前街1号',
                'english_name': 'GUANQIAN STREET', 'data_status': 'CAD_SOURCE', 'simulated': False,
                'source': {'file': source.name, 'sha256': digest, 'bytes': source.stat().st_size},
                'inventory': inventory, 'floors': summaries,
                'source_assets': json.loads((source.parent / 'manifest.json').read_text(encoding='utf-8'))['files'],
                'pdf_reference': {'rendered_pages_identical': True, 'both_page_titles': '一层平面图',
                                  'render_comparison': {'tool': 'PyMuPDF 1.26.6', 'scale': 1,
                                                        'page_size_pt': [1190.550048828125, 841.8900146484375],
                                                        'both_pixel_sha256': '5b733a4b515cc765b3d981baf10089aabbc8be7886e0007cf6db57e821ce3d88',
                                                        'vector_paths_per_page': 3311},
                                  'title_verification': 'Visual inspection of supplied PDF rendered pages; not OCR',
                                  'second_floor_reference': 'PENDING_CORRECT_SECOND_FLOOR_PDF'},
                'camera_inventory_status': 'NOT_CONNECTED', 'business_zone_status': 'NOT_CONNECTED',
                'cross_floor_registration': 'NOT_SURVEYED',
                'physical_camera_count': None, 'known_camera_records': 0,
                'unassigned_modelspace_handles': [e.dxf.handle for e in doc.modelspace() if all(
                    e.dxf.handle not in f['selection']['modelspace_handles'] for f in floors)]}
    (output / 'spatial_metadata.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding='utf-8', newline='\n')
    print(json.dumps({'floors': [{k: f[k] for k in ('floor_id', 'entity_count', 'container_count', 'bounds_wcs_mm', 'unsupported')}
                                 for f in floors], 'layers': len(doc.layers), 'blocks': len(doc.blocks)}, ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', type=Path, default=MODULE / 'source' / 'guanqian-original.dxf')
    parser.add_argument('--output', type=Path, default=MODULE / 'data')
    args = parser.parse_args()
    extract(args.input, args.output)


if __name__ == '__main__':
    main()

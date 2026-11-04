"""Read prebuilt CAD assets; device fixtures are isolated from actual data."""
import json
from pathlib import Path

from pydantic import ValidationError

from space_intelligence.models import Camera, SpatialEvent, SpatialLink

DATA = Path(__file__).parent / 'data'


class SpaceRepository:
    def __init__(self, root=DATA):
        self.root = Path(root)
        self.metadata = json.loads((self.root / 'spatial_metadata.json').read_text(encoding='utf-8'))
        self.building_id = self.metadata['building_id']
        self.floors = {f['floor_id']: f for f in self.metadata['floors']}
        self._loaded = {}
        self._objects = {}

    def building(self, building_id=None):
        if building_id is not None and building_id != self.building_id:
            raise KeyError('Unknown building_id')
        return {'building_id': self.building_id, 'name': self.metadata['name'],
                'english_name': self.metadata['english_name'], 'data_status': 'CAD_SOURCE',
                'simulated': False, 'floor_ids': list(self.floors), 'unit': 'mm',
                'source_sha256': self.metadata['source']['sha256'],
                'business_zone_status': 'NOT_CONNECTED', 'camera_inventory_status': 'NOT_CONNECTED',
                'physical_camera_count': None, 'registered_real_devices': 0,
                'cross_floor_registration': 'NOT_SURVEYED',
                'pdf_warning': '两份 PDF 页面内容均为一层；二层 PDF 交叉核对待补充。'}

    def floor(self, floor_id):
        if floor_id not in self.floors:
            raise KeyError('Unknown floor_id')
        return self.floors[floor_id]

    def geometry(self, floor_id):
        self.floor(floor_id)
        if floor_id not in self._loaded:
            self._loaded[floor_id] = json.loads((self.root / f'{floor_id}.json').read_text(encoding='utf-8'))
        return self._loaded[floor_id]

    def object(self, floor_id, entity_id):
        data = self.geometry(floor_id)
        if floor_id not in self._objects:
            self._objects[floor_id] = {e['entity_id']: e for e in data['entities'] + data['containers']}
        if entity_id not in self._objects[floor_id]:
            raise KeyError('Object not in this floor')
        obj = self._objects[floor_id][entity_id]
        return {**obj, 'source_entity': data['source_entities'].get(obj['source_handle'])}

    def validate_filters(self, building_id=None, floor_id=None, zone_id=None):
        self.building(building_id)
        if floor_id:
            self.floor(floor_id)
        if zone_id:
            # No operational zones have yet been confirmed from the drawing.
            raise KeyError('No confirmed business zone has this zone_id')

    def cameras(self, include_simulated=False, floor_id=None):
        if floor_id:
            self.floor(floor_id)
        if not include_simulated:
            return []
        records = []
        for spec in self.floors.values():
            if floor_id and floor_id != spec['floor_id']:
                continue
            # These coordinates only test SVG/WCS mapping. They are NOT installation points.
            x1, y1, x2, y2 = spec['bounds_wcs_mm']
            records.append(Camera(camera_id='SIM-' + spec['floor_id'] + '-01', building_id=self.building_id,
                                  floor_id=spec['floor_id'], zone_id=None,
                                  x=(x1 + x2) / 2, y=(y1 + y2) / 2, z=None,
                                  direction=35, field_of_view=70, range_mm=9000,
                                  stream_url=None, status='not_connected', simulated=True,
                                  input_origin='SIMULATED').model_dump())
        return records

    def validate_link(self, link, simulated=False):
        link = SpatialLink.model_validate(link)
        self.validate_filters(link.building_id, link.floor_id, link.zone_id)
        if link.camera_id:
            # Only explicit simulated devices exist at this stage; never bind real events to them.
            cameras = self.cameras(include_simulated=simulated, floor_id=link.floor_id)
            if link.camera_id not in {c['camera_id'] for c in cameras}:
                raise KeyError('Camera not registered for this floor/data origin')
        return link

    def events(self, store, building_id=None, floor_id=None, zone_id=None, camera_id=None,
               session_id=None, include_simulated=False):
        self.validate_filters(building_id, floor_id, zone_id)
        if session_id:
            sessions = [store.session(session_id)]
        else:
            sessions = store.sessions()
        records, invalid = [], 0
        for session in sessions:
            for event in store.events(session['session_id']):
                meta = event.get('metadata', {})
                if 'spatial' not in meta:
                    continue
                simulated = bool(session.get('simulated') or meta.get('simulated') or meta.get('input_origin') == 'SIMULATED')
                try:
                    link = self.validate_link(meta['spatial'], simulated)
                except (KeyError, ValueError, ValidationError):
                    invalid += 1
                    continue
                if simulated and not include_simulated:
                    continue
                if floor_id and link.floor_id != floor_id:
                    continue
                if camera_id and link.camera_id != camera_id:
                    continue
                records.append(SpatialEvent(**link.model_dump(), session_id=event['session_id'],
                              event_id=event['event_id'], timestamp=event['timestamp'],
                              source=event['source'], event_type=event['event_type'], description=event['description'],
                              simulated=simulated, processing_method=meta.get('processing_method', 'UNVERIFIED'),
                              evidence=event.get('evidence', {}),
                              original_event_url=f'/api/sessions/{event["session_id"]}/events').model_dump())
        # Relative times only compare within the same session; do not claim a global timeline.
        return sorted(records, key=lambda e: (e['session_id'], e['timestamp'], e['event_id'])), invalid

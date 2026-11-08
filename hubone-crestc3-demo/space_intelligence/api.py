"""Independent /api/v1 spatial router. No CAD parsing or device I/O here."""
from pathlib import Path

from fastapi import APIRouter, Query
from fastapi.responses import FileResponse

from space_intelligence.models import CameraCollection, SpatialEventCollection, ZoneCollection
from space_intelligence.repository import SpaceRepository


def create_space_router(store):
    repo = SpaceRepository()
    router = APIRouter(prefix='/api/v1', tags=['Space Intelligence'])

    @router.get('/spaces')
    def spaces():
        return {'items': [repo.building()], 'data_status': 'CAD_SOURCE', 'simulated': False}

    @router.get('/spaces/{building_id}/metadata')
    def metadata(building_id: str):
        repo.building(building_id)
        return repo.metadata

    @router.get('/spaces/{building_id}/report.md', response_class=FileResponse)
    def report(building_id: str):
        repo.building(building_id)
        return FileResponse(Path(__file__).resolve().parents[1] / 'docs/CAD_PARSING_REPORT_V0.2.md',
                            media_type='text/markdown; charset=utf-8', filename='HUBONE-CAD-V0.2.md')

    def floor_view(f):
        prefix = f'/api/v1/floors/{f["floor_id"]}'
        return {**{k: f[k] for k in ('floor_id', 'building_id', 'name', 'level', 'data_status',
                                    'simulated', 'entity_count', 'container_count', 'bounds_wcs_mm',
                                    'z_range_mm', 'crs', 'layers', 'category_counts', 'pdf_validation', 'zone_status')},
                'spatial_id': f["spatial_id"], 'vertical_reference': f['vertical_reference'],
                'render_frames': f['render_frames'],
                'confirmed_zone_count': None, 'registered_camera_count': 0,
                'geometry_url': prefix + '/geometry', 'svg_url': prefix + '/map.svg'}

    @router.get('/floors')
    def floors(building_id: str | None = None):
        repo.building(building_id)
        return {'items': [floor_view(f) for f in repo.floors.values()], 'data_status': 'CAD_SOURCE'}

    @router.get('/floors/{floor_id}')
    def floor(floor_id: str):
        return floor_view(repo.floor(floor_id))

    @router.get('/floors/{floor_id}/geometry', response_class=FileResponse)
    def geometry(floor_id: str):
        repo.floor(floor_id)
        return FileResponse(repo.root / f'{floor_id}.json', media_type='application/json', filename=f'{floor_id}.json')

    @router.get('/floors/{floor_id}/map.svg', response_class=FileResponse)
    def svg(floor_id: str):
        repo.floor(floor_id)
        return FileResponse(repo.root / f'{floor_id}.svg', media_type='image/svg+xml')

    @router.get('/floors/{floor_id}/model', response_class=FileResponse)
    def model(floor_id: str):
        repo.floor(floor_id)
        return FileResponse(repo.root / f'{floor_id}_model.json', media_type='application/json')

    @router.get('/floors/{floor_id}/objects/{entity_id}')
    def object_detail(floor_id: str, entity_id: str):
        return repo.object(floor_id, entity_id)

    @router.get('/zones', response_model=ZoneCollection)
    def zones(building_id: str | None = None, floor_id: str | None = None):
        repo.validate_filters(building_id, floor_id)
        return {'items': [], 'data_status': 'NOT_CONNECTED', 'confirmed_zone_count': None,
                'note': 'CAD 未提供经确认的业务区域边界；封闭线条不等于房间或业务区域。'}

    @router.get('/cameras', response_model=CameraCollection)
    def cameras(building_id: str | None = None, floor_id: str | None = None,
                zone_id: str | None = None, include_simulated: bool = False):
        repo.validate_filters(building_id, floor_id, zone_id)
        return CameraCollection(items=repo.cameras(include_simulated, floor_id),
                                data_status='SIMULATED' if include_simulated else 'NOT_CONNECTED',
                                note='未接入真实设备清单；SIMULATED 位置仅用于坐标和覆盖扇形交互测试，不代表安装点或真实可视范围。')

    @router.get('/events', response_model=SpatialEventCollection)
    def events(building_id: str | None = None, floor_id: str | None = None,
               zone_id: str | None = None, camera_id: str | None = None, session_id: str | None = None,
               include_simulated: bool = False, offset: int = Query(default=0, ge=0),
               limit: int = Query(default=100, ge=1, le=1000)):
        records, invalid = repo.events(store, building_id, floor_id, zone_id, camera_id, session_id, include_simulated)
        status = 'NOT_CONNECTED' if not records else 'SIMULATED' if all(e['simulated'] for e in records) else 'LINKED_EVENTS'
        return SpatialEventCollection(items=records[offset:offset + limit], total=len(records),
                                      offset=offset, limit=limit, data_status=status, invalid_binding_count=invalid,
                                      note='仅返回 metadata.spatial 中显式且有效的关联；timestamp 保留原 Session 相对秒，不自动推断空间、身份或跨 Session 时间。')

    return router

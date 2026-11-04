"""Public contracts for future device and Crest C3 spatial association."""
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class SpatialModel(BaseModel):
    model_config = ConfigDict(extra='forbid', allow_inf_nan=False)


class SpatialLink(SpatialModel):
    building_id: str = Field(min_length=1)
    floor_id: str = Field(min_length=1)
    zone_id: str | None = None
    camera_id: str | None = None


class Camera(SpatialLink):
    camera_id: str = Field(min_length=1)
    x: float = Field(description='Original DXF WCS millimeters')
    y: float = Field(description='Original DXF WCS millimeters')
    z: float | None = Field(default=None, description='WCS mm, null until elevation is surveyed')
    direction: float = Field(ge=0, lt=360, description='Degrees counterclockwise from CAD +X')
    field_of_view: float = Field(gt=0, le=180, description='Horizontal angle in degrees')
    range_mm: float | None = Field(default=None, gt=0, description='Illustrative wedge only; no occlusion model')
    stream_url: str | None = Field(default=None, description='Reserved; no video stream is connected in V0.2')
    status: Literal['unknown', 'not_connected', 'offline', 'online'] = 'not_connected'
    simulated: bool
    input_origin: Literal['SIMULATED', 'DEVICE_REGISTRY']
    coordinate_system: Literal['guanqian-dxf-wcs'] = 'guanqian-dxf-wcs'


class Zone(SpatialLink):
    """Reserved real boundaries; no Zone instances are fabricated from CAD outlines."""
    zone_id: str
    spatial_id: str
    name: str
    boundary_entity_ids: list[str]
    footprint_wcs_xyz_mm: list[list[float]] | None = None
    base_elevation_mm: float | None = None
    height_mm: float | None = None
    verification_status: Literal['PENDING_REVIEW', 'CONFIRMED'] = 'PENDING_REVIEW'


class ZoneCollection(SpatialModel):
    items: list[Zone]
    data_status: Literal['NOT_CONNECTED'] = 'NOT_CONNECTED'
    confirmed_zone_count: int | None = None
    note: str


class CameraCollection(SpatialModel):
    items: list[Camera]
    data_status: Literal['NOT_CONNECTED', 'SIMULATED']
    registered_real_devices: int = 0
    physical_device_count: int | None = None
    online_real_devices: int | None = None
    note: str


class SpatialEvent(SpatialLink):
    session_id: str
    event_id: str
    timestamp: float = Field(ge=0, description='Seconds relative to the original Crest C3 Session start')
    timestamp_basis: Literal['SESSION_RELATIVE_SECONDS'] = 'SESSION_RELATIVE_SECONDS'
    source: str
    event_type: str
    description: str
    simulated: bool
    processing_method: str
    evidence: dict
    original_event_url: str


class SpatialEventCollection(SpatialModel):
    items: list[SpatialEvent]
    total: int
    offset: int
    limit: int
    data_status: Literal['NOT_CONNECTED', 'LINKED_EVENTS', 'SIMULATED']
    invalid_binding_count: int
    note: str

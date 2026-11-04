# Space Intelligence V0.2 API

当前服务与 Crest C3 共用一个 FastAPI 进程；空间路由独立位于 `space_intelligence/api.py`。交互文档为 `/docs`，机器 schema 为 `/openapi.json`。无摄像头联网操作、没有扫描约 3000 路设备。默认返回真实 CAD，设备和运营数据未连接。

## 接口

| GET | 参数 | 返回 |
|---|---|---|
| `/api/v1/spaces` | 无 | 建筑列表、真实 CAD 来源、设备清单状态 |
| `/api/v1/spaces/{building_id}/metadata` | `guanqian-1` | 全局 CAD 清单、楼层、坐标、来源 hash、PDF 问题 |
| `/api/v1/spaces/{building_id}/report.md` | 同上 | CAD 解析报告下载 |
| `/api/v1/floors` | 可选 building_id | 楼层摘要、几何/SVG URL、层高预留字段 |
| `/api/v1/floors/{floor_id}` | floor_1 或 floor_2 | 单层摘要 |
| `/api/v1/floors/{floor_id}/geometry` | 同上 | 完整楼层 JSON：XYZ 几何、原始参数、容器关系 |
| `/api/v1/floors/{floor_id}/map.svg` | 同上 | 原 CAD 派生二维 SVG |
| `/api/v1/floors/{floor_id}/model` | floor_1 或 floor_2 | V0.3 三维场景几何；高度仍未知，展示参数明确 SIMULATED；见 SPACE_3D_V0.3.md |
| `/api/v1/floors/{floor_id}/objects/{entity_id}` | 本楼层的实体 ID | 图元和原始 source_entity 属性/tags |
| `/api/v1/zones` | 可选 building_id、floor_id | 空列表、NOT_CONNECTED，待业务确认 |
| `/api/v1/cameras` | 可选 building_id、floor_id、zone_id、include_simulated | 设备契约；默认空；显式 include_simulated=true 才有测试点 |
| `/api/v1/events` | 可选 building_id、floor_id、zone_id、camera_id、session_id、include_simulated、offset、limit | 原 C3 中显式绑定空间的有效事件；默认排除模拟 |

未知建筑或楼层、未登记 zone 返回 404；无效布尔/分页参数返回 422。分页 offset≥0，limit 1–1000，默认 100。事件 total 为筛选后、分页前的数量。空列表不伪造运营数据。

## 示例响应

```http
GET /api/v1/spaces
```

```json
{
  "items": [{
    "building_id": "guanqian-1",
    "name": "苏州观前街1号",
    "english_name": "GUANQIAN STREET",
    "data_status": "CAD_SOURCE",
    "simulated": false,
    "floor_ids": ["floor_1", "floor_2"],
    "unit": "mm",
    "source_sha256": "7843ed6b0ba393213ddcd2bb54187acd9f41cec346702a0e6f32717c0f6b8b48",
    "business_zone_status": "NOT_CONNECTED",
    "camera_inventory_status": "NOT_CONNECTED",
    "physical_camera_count": null,
    "registered_real_devices": 0,
    "cross_floor_registration": "NOT_SURVEYED",
    "pdf_warning": "两份 PDF 页面内容均为一层；二层 PDF 交叉核对待补充。"
  }],
  "data_status": "CAD_SOURCE",
  "simulated": false
}
```

```http
GET /api/v1/cameras
```

```json
{
  "items": [],
  "data_status": "NOT_CONNECTED",
  "registered_real_devices": 0,
  "physical_device_count": null,
  "online_real_devices": null,
  "note": "未接入真实设备清单；SIMULATED 位置仅用于坐标和覆盖扇形交互测试，不代表安装点或真实可视范围。"
}
```

测试设备只在 `?floor_id=floor_1&include_simulated=true` 返回，示例单条结构（坐标实际由图纸包围框中心计算，非安装坐标）：

```json
{
  "building_id": "guanqian-1",
  "floor_id": "floor_1",
  "zone_id": null,
  "camera_id": "SIM-floor_1-01",
  "x": 78718.69839055538,
  "y": -417531.27986671554,
  "z": null,
  "direction": 35,
  "field_of_view": 70,
  "range_mm": 9000,
  "stream_url": null,
  "status": "not_connected",
  "simulated": true,
  "input_origin": "SIMULATED",
  "coordinate_system": "guanqian-dxf-wcs"
}
```

设备方向为相对于 CAD +X 的逆时针角，范围 [0,360)°；FOV 为水平视角 (0,180]°；X/Y/Z/range 使用 WCS 毫米，未知 Z 为 null。扇形不考虑墙体遮挡，不是经过验证的真实覆盖率。stream_url 是预留字段，本版 null，不建立 RTSP/WebRTC 连接。真实清单以后应由受控设备登记适配器提供，不能以测试点替代。

## 空间实体和业务 Zone

楼层 JSON 的 `entities` 是已展开的图元实例，`containers` 是 INSERT/DIMENSION/MLINE 容器，`source_entities` 按原句柄保存精确 DXF 属性/tags。实例属性包括：

```text
entity_id / spatial_id / building_id / floor_id / zone_id
source_handle / source_dxf_type / derived_part_index
source_layer / effective_layer / source_block
parent_entity_id / insert_chain / world_matrix44
geometry（WCS 三维路径或文字锚点） / bounds（二维 picking 包围框）
dimensions_3d（base_elevation_mm / height_mm / extrusion_mm 均待测量）
semantic_status=CAD_LAYER_ONLY
input_origin=USER_PROVIDED_CAD / processing_method=RULE_BASED / simulated=false
```

`category` 是图层规则形成的显示分组，原始图层没有合并。墙与柱尚未完全区分，不是已验证 BIM 对象。显示曲线的离散数据与精确 DXF 原参数同时保留。三维消费方式见 `SPATIAL_DIGITAL_TWIN.md`。

Zone 的预留契约：`building_id/floor_id/zone_id/spatial_id/name/boundary_entity_ids/footprint_wcs_xyz_mm/base_elevation_mm/height_mm/verification_status`。当前没有经过业务确认的 Zone，返回空列表与 confirmed_zone_count=null；不会从墙柱的任意闭合线条创造房间数量。

## 与 Crest C3 关联

沿用既有 Event 和 SQLite，不引入第二套 Session。事件顶层已有 `session_id/event_id/timestamp`。空间关联放在原事件的 `metadata.spatial`，例如通过**既有人工事件接口**测试：

```http
POST /api/sessions/{一个明确SIMULATED的session_id}/events
Content-Type: application/json
```

```json
{
  "timestamp": 2.5,
  "event_type": "manual_observation",
  "source": "manual",
  "description": "SIMULATED：验证空间关联；不是现场观测",
  "metadata": {
    "simulated": true,
    "spatial": {
      "building_id": "guanqian-1",
      "floor_id": "floor_1",
      "zone_id": null,
      "camera_id": "SIM-floor_1-01"
    }
  }
}
```

`GET /api/v1/events?session_id=...&include_simulated=true` 返回同一 session_id、event_id 和 2.5 秒，不创建新事件、不修改原证据。返回 `timestamp_basis=SESSION_RELATIVE_SECONDS`。不把不同 Session 的相对秒数当绝对时间合并；后续须有同步录制时钟或经确认的偏移。

没有 metadata.spatial 的历史 C3 事件不自动定位到观前街。关联检查包括建筑、楼层、zone、摄像头所属楼层和数据是否模拟。无效关联不进入空间事件列表，计入 invalid_binding_count，原始事件保留。模拟摄像头不能与真实来源事件关联。

这是一层可调用的关联契约，不声称已经完成摄像头标定、人体空间定位、区域客流统计、消费者跨镜追踪或空间坐标化语音事件。原 C3 的归一化视频区域不能直接作为 CAD zone 坐标使用。

## 实际示例文件

运行 `scripts/accept_space.py` 后，交互验证结果在 `artifacts/v0.2/browser/result.json`。`scripts/export_space_examples.py` 可从正在运行的服务导出实际响应和 OpenAPI schema 到 `docs/api-examples/`，示例不会发送到外部服务。

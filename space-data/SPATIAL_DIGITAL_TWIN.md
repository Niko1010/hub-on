# HUB ONE · 3D Spatial Digital Twin 产品与数据契约

## 产品目标

用户提供的 3D 智慧建筑 Dashboard 参考图已纳入最终产品目标：中央为**真实观前街1号、可交互的建筑模型**，左侧控制楼层及结构/摄像头/热力/动线/体验事件图层，右侧按选中对象展示空间资产、设备、区域及事件。视觉继续使用 HUB ONE VIS 的蓝白色、品牌 Logo、字体和卡片系统。参考图用于视图组织和交互方向，不提供观前街的几何、建筑高度或运营数据。

当前 V0.2 交付真实 CAD 二维视图、缩放平移、单层切换、图层开关、对象高亮与查看、临时区域框选。没有加入 Three.js、React、R3F 或虚构建筑体量。后续实现楼层独立展示、楼层分离、OrbitControls 旋转缩放、区域高亮和两侧面板联动，不交付一张静态效果图充当数字孪生。

## 当前架构是否支持后续三维

**支持作为共同空间数据底座与交互身份契约；当前数据还不具备准确完整三维建筑的全部信息。**

```text
原始 DXF（保留）
   ↓ 离线解析 / 审查 manifest
floor JSON：WCS XYZ + 原始参数 + 图层 + 变换 + 稳定 ID
   ├── 当前：SVG 派生视图 → frontend/space.js
   └── 后续：Three.js / R3F 渲染器（尚未实现）
共同：building / floor / zone / spatial_id / camera / session / event
```

解析器在 `space_intelligence/cad/`；数据在 `space_intelligence/data/`；读取与设备契约在 `repository.py/models.py`；独立 API 在 `api.py`；二维查看器在 `frontend/space.js`。没有用 SVG path 字符串作为唯一几何来源。未来渲染器直接请求 `/api/v1/floors/{floor_id}/geometry`，不必读取 SVG 或再次扫描原 CAD。

## 可直接复用的数据

| 数据 | 当前契约 | 三维用途 |
|---|---|---|
| 实例身份 | `entity_id == spatial_id`，建筑/楼层命名空间 + 句柄插入路径散列 | Mesh/Group 的 `userData.spatial_id`，与二维选择共用 |
| 楼层身份 | `building_id` + `floor_id`；全局 `spatial_id=guanqian-1:floor_1` 等 | 单层显隐、楼层 Group、逐层选择 |
| 业务区域 | 当前 `zones=[]`；Zone 契约预留 `zone_id/spatial_id/boundary_entity_ids` | 二维/三维共用同一 zone_id，不由渲染器生成另一个区域 ID |
| 几何 | WCS 三维顶点、曲线原始 tags / bulge / 参数 | LineSegments、边界、精确曲线重采样；经确认后构造面/实体 |
| CAD 来源 | 原始句柄、图层、生效图层、block、parent、insert_chain | 图层过滤、来源回溯、实例化几何、语义审查 |
| 变换 | `world_matrix44`、容器 `block_to_wcs_matrix44` | 复用完整嵌套仿射关系；不会丢掉旋转、缩放、镜像 |
| 垂直属性 | `vertical_reference` / `dimensions_3d`，未知均 null | 取得实测数据后填充，不能将 null 当默认楼高 |
| 运营关联 | Camera / SpatialLink / SpatialEvent | 设备点位、覆盖扇形、事件与 Session 联动 |

ID 基于图元插入路径，不依赖名称翻译、SVG 顺序、渲染相机、缩放或坐标舍入。相同句柄定义的多个门有不同实例 ID。相同源文件在当前相同解析环境下重建，ID 与输出一致；图纸注释显示包围框还受 CAD 字体环境影响，不是实测空间边界。修改 CAD、重新分块或句柄被重写时仍需要显式版本迁移映射，不能承诺任意 CAD 重绘后 ID 自动不变。

`floor_1/floor_2` 在当前 API 的单建筑范围内唯一；跨建筑调用须同时携带 `building_id`，统一选择状态使用全局 `spatial_id`。区域建立后 ID 由业务登记维护，不从多边形顶点序号推导。

## 坐标、单位和 Three.js 边界

1. 权威原始坐标为 `guanqian-dxf-wcs`，mm，顶点完整保存 XYZ。
2. SVG 的显示变换为 `[1,0,0,-1,0,0]`；点击时按同一变换恢复 CAD Y。
3. JSON 的 `world_matrix44` 使用 ezdxf row-major/行向量约定。Three.js 使用列向量，需要数学上的转置矩阵：`new THREE.Matrix4().fromArray(world_matrix44)` 的列主存储恰好得到所需转置，此时不要再调用 `.transpose()`。若用按行传参的 `.set()` 则需先转置排列。使用现成的 WCS 顶点时不再重复施加 `world_matrix44`。
4. 每层 `render_frames.floating_origin_wcs_mm` 仅为降低图形坐标量级。Three.js 局部米制渲染可用：

```javascript
const [ox, oy, oz] = floor.render_frames.floating_origin_wcs_mm;
const toThree = ([x, y, z]) => [
  (x - ox) / 1000,
  (z - oz) / 1000,
 -(y - oy) / 1000,
];
```

5. 上述公式保持右手坐标关系并映射 CAD Z 到 Three Y；这是渲染变换，不是地理定位、建筑实测坐标或楼层对齐。
6. 原图的楼层横向摆放，Z 还含符号偏移等数据。`cad_wcs_to_building_matrix44=null`、`floor_elevation_mm=null` 时，不能把不同层合成已测量建筑。真实配准须有控制点与复核记录。

## 后续三维实施顺序

1. 完成本版二维验收，补足二层 PDF 复核。
2. 在当前 JSON 之上人工确认墙、柱、门窗、楼梯、业务区域及结构连通关系；将结论作为按稳定 ID 关联的语义/测量数据保存，不改写源 CAD。
3. 取得标高、层高、墙高、楼板厚度及楼层配准。未知字段保持 null。现有二维建筑线条不自动等于封闭实体或合法拉伸轮廓。
4. 接入 Three.js 或 R3F 作为第二渲染器，使用相同数据、API、ID 和侧栏选择状态。先单层线框/经确认结构，再组合楼层。
5. 增加旋转、单层、楼层分离和区域高亮。楼层分离的显示偏移须与真实标高分开保存，明确为展示操作。
6. 按真实设备清单与标定结果接入摄像头及行为事件，再加入有证据的热力、动线和产品研究关联。

三维阶段的验收是可选择、可过滤、可旋转、可追溯的空间对象与真实数据联动。没有真实数据的运营图层继续显示 NOT CONNECTED，测试数据始终 SIMULATED。

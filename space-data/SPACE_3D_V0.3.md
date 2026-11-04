# HUB ONE V0.3 · 可交互 3D Space Intelligence

用户提供的智慧建筑参考图是本版主要视觉方向：中央正交等轴测模型、左侧楼层/资产/运营图层、右侧选中空间信息；保持 HUB ONE 蓝白品牌，使用蓝、青、紫半透明空间材质与演示热力。模型来自观前街1号现有一、二层 CAD 数据，不复制参考图中的建筑布局，也没有添加其他真实楼层。

## 已实现的交互

- 默认 3D，保留 2D / 3D 切换与模式记忆；原始二维 SVG、CAD 图层、对象查看和下载继续可用。
- Three.js r180 / WebGL 2 实时渲染，使用正交相机的等轴测初始方向，非静态图片。
- 鼠标左键旋转、右键平移、滚轮缩放，工具栏复位和 90° 旋转；触屏使用 OrbitControls 手势。
- 一层、二层独立显示、两层总览、楼层爆炸视图及可调展示间距。爆炸偏移与建筑标高分别存储。
- 墙体平面、柱体、半透明门窗/幕墙、楼梯平面、示意楼板分别可开关。
- 射线点击 CAD 空间候选区域，高亮同一空间并联动右侧区域信息、摄像头、人数、停留、事件及反馈。实际未连接指标显示 NOT CONNECTED。
- CAD 区域具有半透明三维展示体块，候选边界来自 CAD，体块高度使用明确 SIMULATED 展示参数，不是实测空间高度。
- 选中区域可在 2D 中定位，再切回 3D；两个视图使用相同 `spatial_id` 和来源实体 ID。
- 明确开启 SIMULATED 演示后，可分别显示消费者活动、热力、动线、产品体验区/演示展台、互动事件、摄像头与视野扇形。关闭演示会同时移除模拟指标和图层。
- 生产摄像头清单、业务 Zone 与空间事件 API 继续为空，不将前端示例写入实际 Session 或研究证据。

## 真实数据与演示的边界

| 项目 | 来源与当前状态 |
|---|---|
| 建筑层数 | DXF 明确的一层、二层，只有这两层 |
| 墙柱/门窗/楼梯平面位置 | 现有 CAD WCS 几何；保留实体 ID、原始图层和来源关联 |
| 柱体轮廓 | CAD 墙柱填充轮廓，按图层/长宽比规则分类为候选，尚非逐对象确认 BIM |
| 墙体 | 使用真实 CAD 线面与填充；缺失可靠厚度的线按边界平面表示，不虚构实际厚度 |
| 原始 CAD Z | 保留于权威 JSON；绘图偏移不解释成建筑标高 |
| 楼层对齐 | 两层共享 `A$C138296ba` 轴网图块的原始实例变换，属于 CAD 轴网推导，**NOT_SURVEYED** |
| 实际高度/标高 | 原数据中保持 null，未测量 |
| 展示高度 | **SIMULATED**：墙 3.2m、柱 3.6m、玻璃 3.1m、展示层距 4.2m、支撑板厚 0.24m；不写回权威尺寸 |
| 支撑楼板 | **SIMULATED_RECONSTRUCTION**：CAD 线网按 50mm 栅格、1m 闭合半径推导的展示支撑面。不是经确认楼板边界、孔洞、挑空或建筑面积 |
| 楼梯三维剖面 | 未提供真实踏步高度/坡度，展示原平面踏步线，不伪造真实楼梯剖面 |
| CAD 区域 | 闭合线网/原始填充推导候选；可能重叠，阴影不等于业务区或可用区，业务 `zone_id` 仍为 null |
| 家具/展台 | 不增加假定真实家具。演示体验展台仅在 SIMULATED 产品体验图层开启时出现 |
| 摄像头/视野 | 仅显式 SIMULATED 测试设备，2D/3D 同 ID、同 XY；安装高度仅展示用，真实 Z 与视频流均未知 |
| 热力/动线/人数/停留/事件/反馈 | 显式 SIMULATED，非现场数据。热力颜色是合成强度，不是实测人数/平方米；轨迹不保证真实可通行性 |
| C3 示例原话 | 示例使用用户提供的产品体验语句，始终标为 SIMULATED，不当作本建筑现场证据 |

本版交付可操作的建筑空间展示和数据联动原型；不能声称是已测量、已核验、可用于施工的完整 BIM。准确物理模型仍需标高/高度、墙柱语义、楼板孔洞、二层 PDF 复核与现场控制点。

## 数据与渲染分离

```text
原有 floor_1.json / floor_2.json（保持不变）
  ↓ space_intelligence/modeling/build.py 离线处理
floor_1_model.json / floor_2_model.json / model_manifest.json
  ├─ /api/v1/floors/{floor_id}/model
  ├─ frontend/three/scene.js → 本地 Three.js bundle → WebGL
  └─ CAD 区域候选 → 原二维 SVG 上的轻量选择图层
```

没有重新解析 DXF。模型 JSON 保留 WCS 毫米，渲染时相对原轴网转换成局部米制，再将 CAD Y 映射到 Three Z。CAD 实体沿用既有 `spatial_id`；区域候选 ID 从规范化几何确定，2D/3D 共用。区域包含 `source_entity_ids`，可回到既有对象 API 和源图层。

新增 API 为 `GET /api/v1/floors/floor_1/model`、`.../floor_2/model`。不存在的第三层返回 404；`/zones`、`/cameras`、`/events` 不因演示自动生成真实记录。

Three.js 和 OrbitControls 已打包为本站文件，浏览器不依赖外部 CDN；保留 MIT 许可。原生前端继续使用现有页面与状态管理，无需为此重写成 React。

## 启动与重建

正常使用不需要 npm：随项目提供模型 JSON 和已编译的 WebGL 模块，继续运行 `START_WINDOWS.cmd` 或原 Uvicorn 命令。进入 `/#space` 即可选择三维模式。浏览器需要 WebGL 2；不可用时页面提供 2D 入口。

修改离线转换逻辑后：

```bash
.venv/bin/python -m space_intelligence.modeling.build
```

修改 Three.js 源码后，安装 Node.js 20+：

```bash
npm ci
npm run build:3d
```

Windows 使用 `.venv\Scripts\python`，其余命令相同。模型预处理使用原有 Python 的 OpenCV、NumPy、Shapely，不需要 GPU；浏览器负责 WebGL 绘制。

## 验收与线上预览

```bash
.venv/bin/python -m pytest -q --junitxml=artifacts/v0.3/pytest.xml
python scripts/accept_spatial_3d.py --url http://127.0.0.1:8015/#space --chromium /usr/bin/chromium
```

云端浏览器可使用 SwiftShader 软件 WebGL；测试实际检查绘制三角面、指针旋转/平移/缩放、楼层实体偏移、射线选中与右侧 ID、一致的 2D/3D 定位、资产开关、七种模拟图层、模拟关闭后的空指标、响应式和离开页面后的资源释放。

原有 `accept_space.py` 与 `accept_pages_preview.py` 进入 2D 模式继续执行原地图/C3 回归。结果与截图在 `artifacts/v0.3/`。

更新 Pages 仍仅发布授权的 CAD 派生查看数据和前端文件，不上传原始 DXF/PDF、DXF tags、Python 后端、运行数据库或凭据。入口：https://niko1010.github.io/hub-on/#space 。实际部署状态见 GitHub Actions，本机访问与正式站点部署分开记录。

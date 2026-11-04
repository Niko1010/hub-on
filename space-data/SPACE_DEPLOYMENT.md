# HUB ONE V0.2 · 本地运行与部署

本版在原 V0.1 单进程 FastAPI + SQLite + 原生 HTML/CSS/JavaScript 基础上增加独立 Space Intelligence 页面。**无需 npm 构建，无需 GPU；空间页不加载 YOLO/ASR 权重，不需要开启摄像头。** 已生成的 CAD JSON/SVG 随项目提供，不必每次启动重新解析。

V0.3 已增加可交互 Three.js 视图，默认进入 3D，保留 2D 切换。部署包同时包含 `floor_1_model.json`、`floor_2_model.json` 和编译好的 `frontend/space-3d.bundle.js`，正常运行仍不需要 Node/npm；修改三维源码时才运行 `npm ci && npm run build:3d`。浏览器需支持 WebGL 2，云端已使用软件 WebGL 验证。三维高度与支撑楼板的示意边界见 SPACE_3D_V0.3.md。

## 1. 已有 V0.1 环境升级

保留完整项目和原 runtime 数据。新增目录 `space_intelligence/` 必须一起复制，包含 `source/` 与 `data/`；更新 frontend、backend/main.py、requirements.txt、scripts 和 docs。无需迁移或清空原 SQLite Session 数据。

Windows PowerShell，在项目根目录：

```powershell
.\.venv\Scripts\python -m pip install ezdxf==1.4.4
.\START_WINDOWS.cmd
```

服务就绪后，在**运行服务的这台 Windows** 浏览器打开 `http://127.0.0.1:8000/#space`，或在左侧点击“空间智能”。START_WINDOWS 的终端要保持开启。127.0.0.1 指当前浏览器所在电脑，不能直接访问云端工作区。

## 2. Windows 10/11 全新安装

解压 `hubone-space-v0.2.zip` 到例如 `D:\Projects`，进入其中的 `hubone-crestc3-demo`。需要 Python 3.12 x64。不要复制云端 Linux `.venv`，不要双击 frontend/index.html。

```powershell
cd D:\Projects\hubone-crestc3-demo
py -3.12 -m venv .venv
.\.venv\Scripts\python -m pip install torch==2.7.1 torchvision==0.22.1 --index-url https://download.pytorch.org/whl/cpu
.\.venv\Scripts\python -m pip install -r requirements.txt
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
.\START_WINDOWS.cmd
```

安装 CPU Torch 是为了保持原 C3 依赖一致；空间渲染本身不调用 Torch。只查看空间地图时可省略模型下载与 ffmpeg。完整 C3 视频/音频演示还需 ffmpeg、模型和样本，参见原 `WINDOWS_DEPLOYMENT_V0.1.md`。`INSTALL_WINDOWS.cmd` 是原有完整 C3 安装方式，会检查 ffmpeg 并准备模型，不是只看空间页的最快方式。

端口冲突时：

```powershell
.\START_WINDOWS.cmd --port 8001
```

然后在本机访问 `http://127.0.0.1:8001/#space`。启动器先验证健康接口和本应用 OpenAPI title，避免把其他占用端口的服务当作启动成功。

## 3. Linux / Codex 工作区

在已有 Python 3.12 虚拟环境中：

```bash
.venv/bin/python -m pip install ezdxf==1.4.4
.venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

在可访问该服务的浏览器进入 `/#space`。本地 `127.0.0.1` 只对同机浏览器有效；远程访问使用你的实际服务器域名/平台端口转发。GitHub Pages 现提供真实 CAD 地图交互和 C3 SIMULATED REPLAY，入口 https://niko1010.github.io/hub-on/#space ；在线版不托管上传、设备接入和推理后端，详见 GITHUB_PAGES.md。

如部署到服务器，反向代理需要同时转发根页面、`/static/`、`/api/`、`/docs`、`/openapi.json`；原 C3 实时事件使用 WebSocket，也须支持 Upgrade。当前按域名根路径部署，子路径部署未验收。空间业务仍是一个进程，不需要拆分服务或新数据库。

## 4. 空间演示流程

1. 进入“空间智能”：顶部为 HUB ONE / SPACE INTELLIGENCE / GUANQIAN STREET，数据状态 `CAD SOURCE`。
2. 选择 01F / 02F。两层应显示不同的真实 CAD 主平面，分别为 5,842 / 6,722 个图元。二层明确提示 PDF 待补充。
3. 将鼠标移到图上滚轮缩放、拖动平移；工具栏 ＋/−/适配地图。键盘方向键平移、+/− 缩放、0 复位。
4. 点击墙柱、门窗、文字或图线：右侧显示原始句柄、图层、来源块、WCS 坐标和变换。展开原始属性或通过实体 API 查看精确数据。
5. 使用“区域框选”拖出矩形，查看完整落在框内的可见对象集合。它是临时选择，不会生成未经确认的业务 zone。
6. 关闭/打开“建筑空间结构”；展开“CAD 原始图层”，逐层切换，不合并图层。块内 0 图层遵循 INSERT 图层继承；关闭父 INSERT 所在图层也会隐藏对应子图元。
7. 摄像头与覆盖范围默认无数据。显式勾选“测试设备 SIMULATED”，再打开位置/覆盖层，可以看到测试点和扇形；点击后仍标为 SIMULATED、无视频流。关闭测试设备后测试图元全部移除。
8. 右侧真实摄像头登记数为 0，实际设备数量与在线数量未知。区域客流、停留时长、互动事件均为 NOT CONNECTED。
9. 下载实际 SVG/JSON，打开 CAD 解析报告。切回 Crest C3 各页面，原 Session 与分析接口继续使用。

## 5. API 与自动验收

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/v1/spaces
Invoke-RestMethod http://127.0.0.1:8000/api/v1/floors
Invoke-RestMethod http://127.0.0.1:8000/api/v1/cameras
.\.venv\Scripts\python -m pytest -q
```

浏览器验收（服务保持运行；会在选择的验收数据库中新建一个明确 SIMULATED 的 C3 文本回归 Session）：

```powershell
.\.venv\Scripts\python -m pip install -r requirements-browser.txt
.\.venv\Scripts\python -m playwright install chromium
.\.venv\Scripts\python scripts\accept_space.py --base-url http://127.0.0.1:8000
.\.venv\Scripts\python scripts\export_space_examples.py --base-url http://127.0.0.1:8000
```

Linux 云端已安装系统 Chromium 时可加 `--chromium /usr/bin/chromium`。浏览器截图、交互记录和下载验证输出在 `artifacts/v0.2/browser/`；API 实际响应输出在 `docs/api-examples/`。

本次云端测试命令和结果见 `V0.2_ACCEPTANCE_REPORT.md`。Windows 命令经过路径与依赖检查，**Windows/RTX 5070 实机未在云端执行**。RTX 5070 对本版二维地图没有必要；未来 Three.js 使用浏览器图形能力，C3 CUDA 推理的单独安装边界仍见 V0.1 Windows 文档。

## 6. CAD 重建与故障排查

```powershell
.\.venv\Scripts\python -m space_intelligence.cad.extract
```

仅在修改解析代码后重建，或审核过新的源 CAD 后更新 manifest。原始 hash、单位、楼层标题和图块不匹配会报错，不能为了“让图显示出来”跳过验证。

- 空间页 404 / NOT FOUND：确认更新后端，重启服务；检查 `/docs` 中是否有 Space Intelligence 路由。
- 几何加载失败：检查 `space_intelligence/data/spatial_metadata.json`、两层 JSON/SVG 是否都复制到了本机。
- 页面只有文字或布局错乱：F12 Network 检查 `style.css`、`brand.css`、`space.css`、`app.js`、`space.js` 和 Logo 字体是否 200，Ctrl+F5 清缓存。
- 设备列表为空：本版正常默认行为，不是接入失败。未提供真实清单；仅在明确勾选 SIMULATED 后显示测试设备。
- 地图无业务区域数量/层高：当前未知，等待建筑与运营负责人确认；不是从图纸闭合线条或 Z 范围自动填数。
- 二层参考提示：上传的两份 PDF 显示相同一层内容，需要正确二层 PDF，不应把提示隐藏当作修复。

后续三维方向、数据接口和所需实测信息见 `SPATIAL_DIGITAL_TWIN.md`。

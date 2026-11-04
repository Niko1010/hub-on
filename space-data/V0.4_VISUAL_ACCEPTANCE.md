# HUB ONE Space Intelligence · V0.4 视觉验收

验收日期（北京时间）：2026-11-04

本轮为现有前端渐进升级。Three.js 继续为 r180；不训练模型、不修改空间解析器，不新增建筑层数、墙柱、门窗或家具。

## 实际交互与前后截图

- [在线 V0.4 可交互空间页](https://niko1010.github.io/hub-on/?v=0.4#space)
- [五种分辨率前后截图对比](https://niko1010.github.io/hub-on/visual-review/)
- 工作区：`artifacts/v0.4/visual-review/index.html`；离线包 `artifacts/hubone-v0.4-visual-review.zip`。
- 截图来自实际 Chromium WebGL；没有使用生成式建筑图片。修改前保存完整滚动页面，对比页按同一视口展示截面，原图可单独打开。

## 五种分辨率

表中尺寸是本地后端的实际 CSS 像素。旧地图部分超出首屏，所以同时记录旧页面总高；新版地图完整位于屏幕内。静态站另有一行来源脚注，已独立执行相同 71 项检查。

| 视口 | 修改前地图 W×H / 顶部 Y | V0.4 地图 W×H / 顶部 Y | 原页面总高 → 新页面总高 | 验收 |
| --- | --- | --- | --- | --- |
| 2048×972 | 908×690 / 419 | 1222×618 / 219 | 1347 → 972 | PASS |
| 1920×1080 | 908×690 / 419 | 1094×726 / 219 | 1347 → 1080 | PASS |
| 1440×900 | 664×610 / 419 | 702×548 / 217 | 1267 → 900 | PASS |
| 1024×768 | 576×600 / 419 | 914×354 / 217 | 1870 → 768 | PASS |
| 390×844 | 293×440 / 496 | 312×376 / 274 | 2752 → 844 | PASS |

2048px 桌面地图宽度由 908px 增至 1222px，顶部由约 419px 提前到 219px。五种尺寸均无页面横向溢出和外层纵向滚动，主标题为 24–28px。

## 布局与字体系统

- 固定品牌导航；空间页使用满宽、满高 Grid 工作台，标题与模式栏共用一行，模型标题作为视窗 HUD。移除原空间页的大型蓝色横幅。
- 桌面左控制栏约 208–232px，右 Inspector 约 268–300px，中间占用剩余空间。两个侧栏各只有一个主要滚动容器，页面外层不滚动。
- 1199px 及以下使用可关闭的楼层/图层抽屉与折叠 Inspector；1279px 及以下品牌导航收为图标轨。390px 时保留 56px 固定导航。Inspector 开合不改变 Canvas 高度。
- 抽屉支持按钮、背景和 Escape 关闭、Tab 焦点约束及关闭后返回触发按钮；Inspector 在小屏支持折叠、Escape 关闭和选中后的自动联动。
- `design-tokens.css` 统一字体、字号、字重、行高、文本颜色、间距、圆角和焦点样式，作用于 Space 与 C3 全站。

| 类型 | 规范 |
| --- | --- |
| 英文 / 数字 | 本地 Inter Variable；不依赖外部字体 CDN |
| 中文 | PingFang SC → Microsoft YaHei UI → Noto Sans SC → Noto Sans CJK SC → sans-serif |
| 主标题 | 24–28px / 600 |
| 模块标题 | 17–20px / 600 |
| 正文 / 控件 | 14–15px / 400–500 |
| 辅助说明 | 12–13px / 400–600 |
| 文本颜色 | primary #24354b、secondary #4d6178、muted #5d6f85 |

实际可见的 Space DOM 辅助文字不小于 12px；三个文本 Token 在白色与页面背景上的计算对比度均至少 4.5:1。3D 叠加标签使用 Inter，按 13px 屏幕字号生成。CAD 自身文字与源 SVG 不重排。

## 3D 材质、光照与交互

- 暖白墙面 `#f1eee7`、灰白柱体 `#d9d6cf`、淡青玻璃 `#91c6d1`（透明度 0.36）、柔灰楼板 `#dfe1df`。
- 程序化 RoomEnvironment、环境/半球/方向灯、ACES 色调映射和 2048 软阴影。摄影棚环境只提供照明，没有把环境中的物体加入建筑场景。
- 桌面使用 16 样本 SSAO，遮蔽缓冲为渲染尺寸的 65%。按正交相机正确反投影，并排除透明玻璃、空间高亮层、标签及模拟运营对象，避免它们伪造建筑遮挡。
- 区域默认弱色透明，选中时使用蓝色高亮及轻量轮廓；没有给整栋建筑加重描边。
- 保留正交建筑轴测、旋转、右键平移、滚轮缩放、复位、两层总览、独立楼层、爆炸视图、2D/3D 切换和柱体隐藏。
- Inspector 增加选中区域聚焦：约 420ms 过渡，可由用户操作中断；尊重 reduced-motion。Fit to View 回到全建筑，并保留安全留白；实际投影边界在各视口中完整可见。
- 摄像头、覆盖范围、活动、轨迹、热力、体验区和事件接口/开关继续保留，未接入时显示 NOT CONNECTED，测试图层必须显式 SIMULATED。

## 已运行的检查

| 检查 | 实际结果 | 记录 |
| --- | --- | --- |
| V0.4 后端页面专项 | 71 项通过，五种视口 | `artifacts/v0.4/final/acceptance.json` |
| V0.4 纯静态发布包专项 | 71 项通过，五种视口 | `artifacts/v0.4/static/acceptance.json` |
| 软件 / API 回归 | 84 passed；1 个真实模型 integration 用例排除 | `artifacts/v0.4/pytest.xml` |
| GitHub 干净源码包 | 79 passed、5 skipped（需私有原始 CAD）、1 deselected | `artifacts/v0.4/public-source-pytest.xml` |
| 截图对比页 | 5 种尺寸切换、原图、验收报告通过 | `artifacts/v0.4/gallery-validation.json` |
| 既有三维回归 | 29 项通过 | `artifacts/v0.4/legacy-3d/result.json` |
| 既有二维 / C3 回归 | 38 项通过 | `artifacts/v0.4/legacy-2d/result.json` |
| 静态二维 / C3 回放 | 29 项通过 | `artifacts/v0.2/pages/result.json` |
| C3 决策报告界面 | 23 项通过 | `artifacts/v0.4/c3-browser/result.json` |
| 静态 Mock 决策报告 | 24 项通过 | `artifacts/decision/pages/result.json` |
| CAD / 空间数据与后端完整性 | 12 个数据文件 SHA-256 一致；27 个后端模块与已发布 803a8b5 一致 | `artifacts/v0.4/integrity.json` |

浏览器专项、三维及静态报告检查均无 JavaScript / HTTP / WebGL 错误。Python 有 1 条既有 anyio BlockingPortal 弃用提示，没有增加运行依赖。

## 修改文件清单

以下为本轮前端、资源、构建、验收及文档改动；不把此前已有的决策报告后端改动算入 V0.4：

- `frontend/design-tokens.css`
- `frontend/space-v04.css`
- `frontend/index.html`
- `frontend/app.js`
- `frontend/space.js`
- `frontend/three/scene.js`
- `frontend/space-3d.bundle.js`
- `frontend/assets/inter-variable.woff2`
- `frontend/assets/INTER-OFL.txt`
- `frontend/assets/inter-manifest.json`
- `frontend/assets/README.md`
- `package.json`
- `package-lock.json`
- `scripts/accept_space_v04.py`
- `scripts/build_v04_review.py`
- `scripts/build_online_preview.py`
- `scripts/build_space_preview.py`
- `scripts/package_ui_template.py`
- `THIRD_PARTY_NOTICES.md`
- `README.md`
- `docs/V0.4_VISUAL_ACCEPTANCE.md`
- `docs/validation/spatial-v04-validation.json`

原 `style.css`、`brand.css`、`space.css` 与 `space-3d.css` 保留，通过新增 Token 和 V0.4 样式层渐进覆盖。Three.js / esbuild 依赖版本不变，重新生成已提交的 bundle 后，运行仍不要求 Node。

## 尚未解决 / 尚未验证

- 当前资料为二维 CAD，真实层高、墙厚、楼板和物理配准仍未测量；沿用已有明确 SIMULATED 的垂向与支撑板参数。本次没有把示意模型升级成已测绘 BIM。二层 PDF 核对待补充的提示继续保留。
- 视窗宽度小于 520 CSS px 时主动关闭 SSAO；浮点颜色缓冲不受支持时降级为普通 Three.js 渲染，保留环境照明与软阴影。
- 验证使用 Chromium / SwiftShader，没有测试真实 RTX 5070 帧率、显存、Safari/iOS 或 Android/Windows 实机；中文系统字体外观仍会因设备略有差异。
- 真实摄像头、客流、业务区域和体验数据仍未连接，本轮没有生成真实设备坐标或消费者统计。

## 本地复现

```bash
npm run build:3d
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8018
# 另一终端，需要 Playwright 和 Chromium：
python scripts/accept_space_v04.py --url http://127.0.0.1:8018/#space
python scripts/build_v04_review.py
```

在 Windows 用现有 START_WINDOWS.cmd 启动后打开 /#space 即可，已编译的 bundle 和本地字体随项目提供；只有修改 3D 源码时需要 Node 重建。

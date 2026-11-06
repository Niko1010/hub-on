# Hub One Space V2 — 阶段一验收

本轮仅为建筑外观及内部空间的基础视觉升级。阶段一等待用户验收；阶段二至四未开始。旧版继续保留为默认入口。

日期：2026-11-06（Asia/Shanghai）。

- V2 独立预览：<https://niko1010.github.io/hub-on/demos/etd-1-1-20261104/space-v2.html?v=stage1-20261106#space>。
- 原版入口：<https://niko1010.github.io/hub-on/demos/etd-1-1-20261104/?v=20261105-integrated#space>。
- 新旧对比、Git Diff 与检查结果：<https://niko1010.github.io/hub-on/demos/etd-1-1-20261104/space-v2-review/>。
- 独立源码分支：`space-v2-stage1`；不替换 `main` 中的原版空间模块。

## 基线及模块依赖

- 应用源码基线：`8787a90f7e3bd90fa3974934c71bb1c1552b418e`。
- 用户指定的集成演示基线：`fbe789484ef9fcecb4b115f44f30d59ee25825cc`，目录 `demos/etd-1-1-20261104/`。
- 现有导航与路由：`app.js`；空间页面、楼层及 Inspector：`space.js`；三维渲染：`frontend/three/scene.js` / `space-3d.bundle.js`。
- 地图数据：`space-data/floor_1/2.json`、SVG、`floor_1/2_model.json`；只读 API 适配：`space-preview.js`。
- 样式：既有 `style.css`、`brand.css`、`space.css`、`space-3d.css`、`design-tokens.css` 和 `space-v04.css`。
- Crest C3 1.1：集成演示自己的 `app.js`、`preview-api.js`、`preview-data.js`、报告、事件及媒体；完整复用现有文件，不从旧版应用源码重新生成研究报告页面。
- 技术栈保持原生 JavaScript + Three.js r180 + esbuild；无新增应用运行依赖。

## 本次授权范围

仅新增：

1. `frontend/space-v2.html`：现有页面结构的独立预览入口。
2. `frontend/space-v2.js`：复用原 SpaceView 的预览包装器、阶段标识及旧版返回链接。
3. `frontend/space-v2.css`：全部选择器限定在 `.space-v2-stage1` 根节点内。
4. `frontend/three/scene-v2.js`：复用原引擎的视觉适配层。
5. `frontend/space-v2.bundle.js` 与许可侧文件：生成产物。
6. `scripts/build_space_v2_preview.py`、`scripts/accept_space_v2.py`：本阶段专用构建及验收。
7. 本报告及 `artifacts/space-v2-stage1/` 中的截图、检查结果和 Git Diff。

不修改既有导航、菜单、HTML 入口、公共组件、全局 CSS、业务页面、后端/API、原引擎、包依赖和 CAD 数据。只有新预览文档使用 import map，把已有动态模块导入定向到 V2；旧文档不加载这张映射。

## 实现内容及资料边界

- 暖白/浅灰墙体，柔灰楼板，低饱和淡青玻璃，较清晰的光影和接触遮蔽。
- 直接从现有幕墙网格派生石墨色细边，不新增门窗、竖梃位置、框架截面或物理厚度。该细边是渲染辅助线，不能视为已测量金属构件。
- 中性空间候选区域；点击后使用红色高亮，并明确说明红色代表用户选择，不是消费者活动或真实热力。
- 保留原有正交轴测、旋转、平移、缩放、Fit、楼层切换、楼层分离、2D/3D、区域选择/聚焦、柱体隐藏和移动端抽屉/Inspector。
- 新旧版复用相同 WCS 坐标、单位、ID、楼层及模型数据；未重新解析或调整 CAD。
- 原有高度、支撑楼板和跨层展示间距仍为 **SIMULATED**，未转为真实测绘结论。
- 现有附件主要为平面资料，不足以验证完整外立面、金属框架和建筑高度。两份现有 PDF 均对应一层，二层独立 PDF 核对继续待补充。
- 真实摄像头、客流与业务区域仍为 **NOT CONNECTED**。本轮没有扩展摄像头、体验区、路线、人群或热力数据；原有可选 SIMULATED 图层仅做回归检查。

## 构建与本地预览

源码位于独立分支。先保存本地修改，再在仓库目录执行 `git fetch origin space-v2-stage1`、`git switch --track origin/space-v2-stage1`。本轮没有迁移或重建 Crest C3 1.1 后端；在线集成 Demo 继续直接使用原有 1.1 回放文件。

在 `hubone-crestc3-demo/` 执行：

```powershell
npm.cmd ci
npx.cmd --no-install esbuild frontend/three/scene-v2.js --bundle --format=esm --minify --target=es2020 --outfile=frontend/space-v2.bundle.js --legal-comments=linked
.venv\Scripts\python.exe scripts/build_space_v2_preview.py
.\START_WINDOWS.cmd
```

- 原版：`http://127.0.0.1:8000/#space`。
- V2 阶段一：`http://127.0.0.1:8000/static/space-v2.html#space`。
- 新预览页内仍可通过现有导航进入 Crest C3；返回旧版按钮使用既有原版页面。

向已有只读集成演示目录添加预览文件：

```text
python scripts/build_space_v2_preview.py --site PATH/TO/demos/etd-1-1-20261104
python scripts/accept_space_v2.py --url http://127.0.0.1:8046/hub-on/demos/etd-1-1-20261104/
python scripts/build_space_v2_preview.py --site PATH/TO/demos/etd-1-1-20261104 --review
```

该构建器只写入新 V2 文件；先后校验既有文件 SHA-256。如旧应用模块导入方式改变，会停止构建，要求核对，不会静默改写旧入口。

## 验收结果

已完成实际运行，结果如下：

| 检查 | 结果 |
| --- | --- |
| esbuild 构建 | 成功，V2 ESM 包约 611.5 KiB；既有包不重建、不替换 |
| JavaScript 语法 / Python 编译 | 通过 |
| 手写源码 Git Diff 空白检查 | 通过；生成包保留 Three.js GLSL 模板中的 5 处行尾空白，不改写上游着色器 |
| 新旧版浏览器验收 | **126 项通过**；JavaScript、HTTP、WebGL console 错误均为 0 |
| FastAPI 本地入口 | **7 项通过**；原版默认入口与 `/static/space-v2.html#space` 均实际加载 |
| 既有单元测试 | **79 passed, 5 skipped, 1 deselected**；1 项既有 anyio 弃用警告 |
| 旧应用源码文件 | **184 个原有文件逐字节一致**，包含原引擎、公共样式、后端与 API |
| 指定集成 Demo | **54 个原有文件 SHA-256 一致**，包含研究报告、证据媒体、地图和全局样式 |
| 建筑几何 | 新旧建筑网格的各属性缓冲、索引及局部矩阵一致；楼层偏移和 Fit 包围范围一致 |
| 布局与导航 | 五种尺寸下新旧视窗位置/尺寸、导航文字及字体一致 |
| Crest C3 1.1 | 14 个报告章节、事实/推断/证据不足、引用有效性、音视频证据定位、Markdown/JSON 导出、页面往返均通过 |
| 研究页面视觉 | 新旧报告页面截图逐像素一致；离开空间页后 V2 根样式和 WebGL 实例已清理 |

5 项跳过均为公开源码不包含原始、完整 CAD 标签而无法进行的无损 CAD 检查；1 项真实模型集成测试未运行。没有把这些项目记为通过。

| 验收尺寸 | 地图视窗尺寸（px，约值） | 外层溢出 / Fit | 光照与交互 |
| --- | --- | --- | --- |
| 2048 × 972 | 1222 × 589 | 无溢出，完整居中 | SSAO / 保留 |
| 1920 × 1080 | 1094 × 697 | 无溢出，完整居中 | SSAO / 保留 |
| 1440 × 900 | 702 × 519 | 无溢出，完整居中 | SSAO / 保留 |
| 1024 × 768 | 914 × 325 | 无溢出，完整居中 | SSAO / 抽屉 |
| 390 × 844 | 312 × 351 | 无溢出，完整居中 | 紧凑模式关闭 SSAO / 触摸旋转、抽屉及折叠 Inspector |

额外实际验证：旋转、右键平移、滚轮缩放、轴测复位、楼层分离、一/二层切换、柱体隐藏/恢复、真实 raycast 选区、红色高亮、Inspector、镜头聚焦、2D/3D 同一 ID、原二层 6722 个图元、原有 SIMULATED 图层启停、返回旧版，以及时间线/反馈/洞察/采集页面导航。

初次截图对比捕获到导航图标的 275 个像素差异，主内容没有差异。统一鼠标位置并等待原有导航过渡结束后，全页像素一致。本次没有为消除截图差异修改任何业务代码。初次结果保留在 `acceptance-first-run.json`，最终结果在 `acceptance.json`。

## 修改文件与 Git Diff

应用源码共 **9 个新增文件，0 个既有文件修改，0 个删除**：

| 文件 | 用途 |
| --- | --- |
| `frontend/space-v2.html` | 本地独立预览文档；结构来自既有入口 |
| `frontend/space-v2.js` | 复用原空间模块的预览包装器 |
| `frontend/space-v2.css` | V2 根节点内的局部样式 |
| `frontend/three/scene-v2.js` | 原 Three.js 引擎的视觉适配层 |
| `frontend/space-v2.bundle.js` | V2 生成包 |
| `frontend/space-v2.bundle.js.LEGAL.txt` | 生成包许可证链接 |
| `scripts/build_space_v2_preview.py` | 添加独立预览和验收对比，不重建旧版 |
| `scripts/accept_space_v2.py` | 新旧版浏览器及证据链回归 |
| `docs/SPACE_V2_STAGE1_ACCEPTANCE.md` | 本报告、边界与运行说明 |

构建站点仅在原 Demo 目录新增这 5 个预览文件：`space-v2.html`、`space-v2.js`、`space-v2.css`、V2 bundle 及许可；另增加 `space-v2-review/` 验收材料目录。原入口和所有原有文件保持不变。

- Git Diff：对比 `main...space-v2-stage1`，或下载对比页的 `source.patch`。
- 浏览器结果：`artifacts/space-v2-stage1/acceptance.json`。
- 本地入口结果：`native-acceptance.json`。
- 单元测试：`pytest.xml`。
- 数据/源码保护：`build-integrity.json`、`integrity.json`。
- 截图：`original/` 与 `v2/`，包含五种分辨率、区域选择、楼层分离、柱体隐藏、2D 和报告。

## 验收边界

物理 Windows/GPU、Safari/真实手机兼容性和现场设备尚未验证。本轮使用云端 Chromium / SwiftShader 验证可交互渲染，不作为显卡性能测试。没有运行 Ollama 或真实设备推理。

阶段一完成后等待用户视觉验收；不得自动进入阶段二、三、四，也不自动替换默认空间模块。

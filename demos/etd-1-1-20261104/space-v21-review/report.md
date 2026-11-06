# Hub One Space V2.1 — 第一阶段交付与验收

日期：2026-11-06（Asia/Shanghai）。状态：软件验收通过，等待用户视觉与建筑内容验收。第二阶段未开始。

- 交互预览：<https://niko1010.github.io/hub-on/demos/etd-1-1-20261104/space-v21.html?v=stage1-20261106#space>
- 总览、拆解、内部及洞口截图、Git Diff、检查结果：<https://niko1010.github.io/hub-on/demos/etd-1-1-20261104/space-v21-review/>
- 源码分支：`space-v21-stage1`；Diff 基线为 `space-v2-stage1`，不合并或替换 `main`。
- 原版与 V2 保留：同目录 `index.html#space`、`space-v2.html#space`。

## 1. 范围和依赖

沿用现有 Hub One Demo 的页面框架、品牌导航、三栏布局、字体、Crest C3 1.1 回放与证据链。继续使用原生 JavaScript、Three.js r180、OrbitControls 和原 esbuild，不引入新的应用运行依赖。

源码基线：`7004890e128341ed2e241376b7257040a534a56f`。在线演示基线：`47edf36dc1cebf597d970f7fb4d8630054b6cce3`。

新文档通过 import map 启用 V2.1 包装器及渲染协调层。现有 `app.js`、`space.js`、`three/scene.js`、V2、所有全局 CSS、后端/API、报告和证据媒体均保持原样。没有重新开发产品外壳。

本轮仅实现：建筑外观参考重建、场地、CAD 内部、1F/2F 显隐与拆解、坐标配准和光影。V2.1 强制关闭已有模拟运营图层，不提供摄像头、热力、路线、体验区等分析功能。原版/V2 原有演示功能继续保留。

## 2. 建筑外观与资料边界

使用用户 PDF 全部五页中的白色山墙、黑色框架、玻璃转角、沿街店面/招牌带和坡屋面特征。新增实际三维框架、玻璃、外墙、屋面与山墙几何；既有 CAD 内部模型位于同一建筑根节点，透过玻璃可见。

PDF SHA-256：`874fe76b49369c9bd8bd87e0a4f78f9b2b1b1ffa0d2873cc5a69f23981c671ea`。原始 PDF 和 DXF 不随本轮公开预览上传。

**外观是 PDF 参考重建，不能当作竣工 BIM。** PDF 没有标高及立面尺寸；框架模数/截面、山墙高度、屋面分段与坡度、外观细节位置均为 **SIMULATED**。铺装、树木、花池及周边地面也是 **SIMULATED**，不是实际资产清单。未生成消费者人物或运营数据。商业门面不登记虚构真实商户。

各项实测尺寸字段保持 `null`。当前展示参数（含内部层距）仅用于可视化，JSON 与页面同时保留说明。只建立 CAD 提供的 1F、2F 内部；屋面和山墙不解释成额外真实楼层。

外壳平面轮廓来自既有 CAD 线网推导支撑面的简化轮廓，不是已核验的外墙测量线；简化与外观表达属于独立展示数据，原 CAD 几何不变。

## 3. CAD、配准和洞口核对

- 直接复用既有 `floor_1/2.json`、模型 JSON、SVG、源实体 ID、原始图层和句柄。不重新解析或修改原始 DXF。
- 沿用共享轴网图块 `A$C138296ba` 的配准信息。各层转换为局部米制：`X=(cad_x-origin_x)/1000`、`Z=-(cad_y-origin_y)/1000`。
- 外观记录参考楼层、轴网原点、单位和变换公式；内部根节点没有额外 X/Z 平移或缩放。配准属于 **CAD 轴网推导 / NOT_SURVEYED**，不是实测控制点校准。
- 爆炸展示偏移独立于实际标高字段，不写回 CAD，也不称为真实层高。默认拆解下两层的屏幕投影不重叠，标签与配准引线可见。

### 二层中空

| 项目 | 结果 |
| --- | --- |
| 孔符号 | 二层原始句柄 `189F`，原始图层 `建-孔` |
| 源实体 ID | `guanqian-1:floor_2:cad-27530b85128aec50291c` |
| 原符号性质 | 开放折线，未将其强行闭合成三角形洞口 |
| 边界依据 | 与孔符号相邻的两块 CAD 闭合线网面；来源含完成面、扶梯及幕墙线 |
| 边界区域 ID | `guanqian-1:floor_2:region-029b102738577cb2bb`、`guanqian-1:floor_2:region-c907c77718b70765cd` |
| 图面推导面积 | 约 **187.1917㎡**，非实测面积 |
| 展示楼板 | 已扣除该区域，交集面积为 0 |
| 辅助选取面 | 同样扣除洞口，不能通过辅助区域把洞口重新填满 |
| 三维验证 | 竖向射线在洞口处不命中二层楼板，在邻近正常楼板处可以命中 |

另有 **4 块闭合楼梯平面保留区**，均有原 CAD 楼梯线及“上/下”标注支持，不生成普通平面；不把这些保留区全部宣称为已确认的竖向洞口。保留原始楼梯线，不伪造踏步高度。

一层句柄 `274E` 位于 `建-上部洞口`，目标楼板未确认，因此没有直接切穿一层。未能确认的楼板孔洞仍需工程复核。所有展示地面均不作可通行性认证，`walking_surface_verified=false`。

细节见 `space-v21-data/surfaces.json` 与验收页 `void-audit.json`。二层独立 PDF 平面复核仍待补充，原有提示保留。

## 4. 实际交互

- 建筑总览 / 内部空间 / 楼层拆解，切换复用同一 WebGL 场景。
- 1F、2F 独立显隐，原有单层按钮、2D/3D、空间选择与 Inspector 保留。
- 轴测复位、Fit、旋转、平移、滚轮缩放、移动端触摸旋转。
- 屋顶和示意场地开关；场地仅在总览中显示，不遮盖内部洞口。
- 自适应展示分离距离、楼层标签与配准引线。
- “核对二层中空”定位与放大；柱体隐藏/恢复。
- 原框架中的移动抽屉、折叠 Inspector、返回 V2/原版、切换 Crest C3 后资源及局部样式清理。

## 5. 构建和实际测试结果

| 项目 | 实际结果 |
| --- | --- |
| esbuild | 成功，独立 ESM 包约 770.7 KiB；原包不替换 |
| 浏览器验收 | **73 项通过**，JS / HTTP / WebGL console 错误均为 0 |
| 本地入口与补充交互 | **10 项通过**，含实际触摸输入、分组无横向平移/缩放、原版/V2 保留 |
| 单元及既有业务回归 | **87 passed, 5 skipped, 1 deselected**；其中新增 8 项几何/配准/保真测试 |
| 原 CAD 模型 | 墙柱、门窗等原网格缓冲与 V2 一致；改变的是独立展示楼板及辅助选取面的孔洞扣除 |
| 研究报告 | Crest C3 1.1 的 14 个章节、引用有效性、音视频证据定位、Markdown/JSON 导出通过 |
| 研究页面外观 | 新旧报告截图逐像素一致 |
| 数据生成 | 新展示 JSON 可确定性重建；原数据 SHA-256 不变 |

5 项跳过均涉及公开仓库不包含的原始/完整 CAD 数据，1 项真实模型集成测试未运行，没有记作通过。有 1 项既有 anyio 弃用警告。

| 分辨率 | 地图可用尺寸（px，约值） | 结果 |
| --- | --- | --- |
| 2048 × 972 | 1222 × 589 | 无外层溢出，主体完整 Fit |
| 1920 × 1080 | 1094 × 697 | 无外层溢出，主体完整 Fit |
| 1440 × 900 | 702 × 519 | 无外层溢出，主体完整 Fit |
| 1024 × 768 | 914 × 325 | 无外层溢出，抽屉控制 |
| 390 × 844 | 312 × 351 | 无外层溢出，触摸旋转、抽屉与折叠 Inspector |

截图均来自实际 Chromium / SwiftShader 渲染。未做实体 Windows、GPU 性能、真实摄像头/麦克风或现场模型精度验证，未运行 LLM。

检查中发现并已修复：初始屋面表现过于整片、拆解投影重叠/主体过小，以及局部状态属性与按钮选择器重名导致视图重置的冲突。修正均局限于本轮新增文件。

## 6. 修改文件与 Diff

只新增下列 16 个应用源码/数据/验收文件，既有源码无修改、无删除：

| 文件 | 用途 |
| --- | --- |
| `frontend/space-v21.html` | 原页面框架中的新预览文档 |
| `frontend/space-v21.js` | 空间局部视图控制和准确性说明 |
| `frontend/space-v21.css` | 全部限定在 `.space-v21-stage1` 的样式 |
| `frontend/three/scene-v21.js` | 原引擎的场景协调层 |
| `frontend/three/building-envelope-v21.js` | PDF 参考外观、山墙、屋顶、框架和门面 |
| `frontend/three/site-context-v21.js` | 明确 SIMULATED 的场地 |
| `frontend/space-v21-data/envelope.json` | 外观参数、坐标变换、来源与未知尺寸 |
| `frontend/space-v21-data/site.json` | 示意场地数据 |
| `frontend/space-v21-data/surfaces.json` | 洞口扣除面、来源记录和辅助选取面 |
| `frontend/space-v21.bundle.js` | 生成包 |
| `frontend/space-v21.bundle.js.LEGAL.txt` | 生成包许可 |
| `scripts/prepare_space_v21_data.py` | 只读 CAD JSON，生成独立展示数据 |
| `scripts/build_space_v21_preview.py` | 增加新预览，不重建旧 Demo |
| `scripts/accept_space_v21.py` | 浏览器与证据链回归 |
| `tests/test_space_v21.py` | 洞口、配准和保真测试 |
| `docs/SPACE_V21_STAGE1_ACCEPTANCE.md` | 本报告 |

构建器对既有集成 Demo 的 **91 个文件**逐一校验字节 SHA-256（包含原版和 V2）；源码基线的 **193 个文件**保持原样。测试材料位于 `artifacts/space-v21-stage1/`，公开验收页提供 Diff、截图、洞口记录和 JSON/XML 测试结果。

## 7. Windows 本地运行

先保存本地修改。在 `D:\Projects\hub-on` 获取独立分支：

```powershell
git fetch origin space-v21-stage1
git switch --track origin/space-v21-stage1
cd .\hubone-crestc3-demo
.\START_WINDOWS.cmd
```

使用既有 Windows 安装环境，无需激活 Linux 虚拟环境。安装未完成时按原有 `INSTALL_WINDOWS.cmd` 说明完成 Python 3.12、FFmpeg 和依赖安装。

- 新预览：`http://127.0.0.1:8000/static/space-v21.html#space`。
- V2：`http://127.0.0.1:8000/static/space-v2.html#space`。
- 原版：`http://127.0.0.1:8000/#space`。

已经提供编译包，正常查看不需要 npm。修改本轮源码后重建：

```powershell
.venv\Scripts\python.exe scripts/prepare_space_v21_data.py
npm.cmd ci
npx.cmd --no-install esbuild frontend/three/scene-v21.js --bundle --format=esm --minify --target=es2020 --outfile=frontend/space-v21.bundle.js --legal-comments=linked
.venv\Scripts\python.exe scripts/build_space_v21_preview.py
```

浏览器 Ctrl+F5。`npm.cmd` 可避免 PowerShell 拦截 `npm.ps1`。新数据生成器不依赖公开仓库之外的原始 PDF/DXF 文件，不改写权威 CAD JSON。

## 8. 验收边界与下一步

仍需人工/工程确认：实测高度与标高、PDF 外观版本和 CAD 立面对应、外墙/屋顶详细尺寸、未确认的楼板孔洞，以及正确二层 PDF。当前结果是来源可追溯的展示重建，不能当作施工或通行依据。

本轮等待第一阶段验收。摄像头覆盖、体验区域、人群/热力、游览路线及实验区均不进入本轮，不自动启动第二阶段，也不自动替换默认入口。

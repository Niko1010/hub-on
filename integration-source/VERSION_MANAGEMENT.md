# Hub One 空间模块与集成版版本管理

更新日期：2026-11-07。

## 本轮追加：Integrated Demo 1.3 产品整合与 Visitor Flow

本轮在已保存的 319 文件空间整合基线上追加产品模块与客流引擎。空间管理、运营分析和设备管理复用同一个 SpaceView / Three.js 场景；Crest C3、Evidence-to-Decision 1.1、API、Session、Event 和原业务页面保持原实现。新增 UI 仅通过产品适配器及局部 CSS 接线。

当前状态为 **LOCAL_ACCEPTANCE_PENDING / PARTIAL_ROUTE_SIMULATION**，不是完整真实通行路线已验收。用户已批准入口在原标注位置附近通过既有右侧缺口接入，并允许已核对片段播放、未确认连接单独标记。四个楼层片段标为 CONFIRMED（仅指 CAD 墙、柱、玻璃投影净距及展示楼板约束检查通过）；全部客流仍是 SIMULATED。两组楼梯连接标为 SIMULATED / UNVERIFIED，出口保留原位置并标为 ROUTE_PENDING。待核连接只显示端点，不生成穿墙粒子或暗示已通行的连线。

数值时钟在待核连接阶段继续推进，当前隐藏在待核片段的代表粒子另计；这用于局部演示和运营参数验证，不是完整行程已验证。真实楼梯高度、通行开口、业务体验边界及现场流量仍待核。1F 返回段首腿沿原楼梯平面中心线，CAD 投影检查同样不证明真实踏步通行。

- 新构建入口：`three/scene-integrated-product.js`，继续输出唯一 `space-3d.bundle.js`，无第二套 Renderer。
- 路径来源：`visitor-flow-data/route-network.json`，原楼层 CAD WCS mm；图片仅决定拓扑和方向，不用于运行像素坐标。
- 运营模型：`operations/visitor-simulation.js`，保留用户给定的每日人数及平均在场估算，区分当前批次人数与可见粒子。
- 新分析展示：蓝紫热力、轻量路线参考、SIMULATED 重点区；体验区和摄像头沿用 V2.2 / V2.3。
- 本轮回退快照：`work/integrated-1.3-flow/baseline/`；文件 SHA、增量 Diff、测试和浏览器截图：`outputs/integrated-1.3-flow/`。
- 不提交、不推送、不合并、不部署。下文保留上一轮空间整合的历史记录。

独立空间模块的最新功能版本为 **V2.3**，最终集成交付目标为 **Integrated Demo 1.3**。用户已明确授权直接完成 V2.1 底座、V2.2 体验区、V2.3 摄像头与原业务模块的统一整合，并统一验收。此授权取代此前“等待 1.2 单独验收后再启动 1.3”的阶段安排。1.2 仅为已保存的中间整合与回退基线，不是最终交付版本。

## 版本与状态

| 版本 | 范围 | 当前状态 |
| --- | --- | --- |
| 2026-11-05 Integrated Demo | 原集成入口 `demos/etd-1-1-20261104/`，空间、Crest C3、Evidence-to-Decision 1.1 及既有业务框架 | 保留为原集成版回滚基线 |
| 独立空间 V2.1 与 Phase 1.1 | 建筑外观、外部金属框架、CAD 空间、二层中空、楼梯、连续滑轨及已验收材质 | 1.2 的空间底座来源 |
| 独立空间 V2.2 | 青色体验区域、总开关与分层开关、楼层联动 | 已有实现已增量接入 1.3，独立源码与验证记录保留 |
| 独立空间 V2.3 | 继承 V2.2；新增摄像头点位、安装方向、视场覆盖及设备 Inspector | 最新独立功能与视觉参考；已有工程验证记录，不能据此推定集成版验收通过 |
| Integrated Demo 1.2 | B 方案：在原集成业务框架内升级至 V2.1 空间底座及 Phase 1.1 材质 | 中间整合基线；完整保存 307 个文件，不作为最终交付 |
| Integrated Demo 1.3 | 基于 1.2 增量接入已有 V2.2 与 V2.3，保留全部原集成业务功能 | 已完成本地代码整合与回归，等待统一人工验收；未提交、推送、合并或部署 |

独立参考工作树仍名为 `hub-on-space-v21-aesthetic`，当前分支仍名为 `space-v22-experience`。这些是历史目录和分支名称，不能据此将最新功能版本记为 V2.1 或 V2.2。V2.3 源码、资源和验收记录均已存在，后续复用这些实现。

## 基线与回滚记录

- 当前集成工作树：`work/hub-on-integrated-1.2`；HEAD 为 `3fd5336fb8f9a9623e56c0832fa4413a85925542`，处于 detached HEAD，既有未提交修改保持原状。
- 独立参考工作树：`work/hub-on-space-v21-aesthetic`；HEAD 为 `24b2410e9c8c11f5a29705c00d4f72ca14bad457`。最新独立实现包含未提交及未跟踪文件，不能只按该 Commit 取源码。
- 1.2 本地交付记录：`outputs/Hub-One-Integrated-1.2-Review.md`；B 方案依赖映射：`outputs/integrated-1.2/B-dependency-map.md`。
- 1.2 文件基线：`outputs/integrated-1.2/baseline-B-after.json`；验收快照：`outputs/integrated-1.2/SPATIAL-ACCEPTANCE-BASELINE.json`，当前状态为 `LOCAL_ACCEPTANCE_PENDING`，未记录人工验收。
- 原集成版回滚包：`outputs/integrated-1.2/Integrated-1.1-Rollback.zip`；1.2 本地交付包：`outputs/integrated-1.2/Integrated-Demo-1.2-Local.zip`。现有 Diff、截图、报告和归档保持不变，本记录作为后续规划补充。
- 1.3 修改前的 307 个文件完整副本：`work/integrated-1.3/baseline/`；哈希与授权变更记录：`outputs/integrated-1.3/baseline-before.json`。此前 1.2 验收快照继续保留历史状态，不将其改写为已通过人工验收。
- 1.3 交付与验证记录：`outputs/Hub-One-Integrated-1.3-Review.md`、`outputs/integrated-1.3/`。本次最终验收覆盖建筑、图层、交互、Crest C3 与 Evidence-to-Decision 1.1，不能以工程回归通过代替人工验收。

上述 `work/`、`outputs/` 路径以本次任务目录为根：`D:/codex/2026-11-07/hub-one-d-projects-hub-on`。

## 已整合范围与核对表

| 能力 | Integrated Demo 1.2 | Integrated Demo 1.3 整合结果 |
| --- | --- | --- |
| 建筑外观、金属框架、CAD、中空与楼梯 | 已接入 V2.1 底座 | 完整保留，不重新建模 |
| Phase 1.1 材质 | 已应用于实际 CAD Mesh | 保留实际材质赋值、光照与渲染基线，不再反复调整美学 |
| 连续滑轨及最大行程 | 已接入并回归 | 原变换与行程保持，所有新增图层继承所属 floorGroup |
| 青色体验区域 | 未接入独立 V2.2 实现 | 已复用体验区模块、独立模拟数据、总开关和分层开关；实际三角面校验不覆盖中空与楼梯保留区（浮点容差 0.001㎡） |
| 摄像头点位与安装方向 | 未接入独立 V2.3 实现 | 已复用 6 个模拟设备配置、点位及方向表达；默认关闭、每层 3 个 |
| 摄像头视场 | 未接入独立 V2.3 实现 | 已复用覆盖几何与独立开关；继承 floorGroup 变换，完成 0%/50%/100%/归零验证 |
| 设备 Inspector | 未接入独立 V2.3 详情 | 已复用真实射线拾取与现有详情容器，完成两层设备点击及隐藏后的选择清理验证 |
| Crest C3、Evidence-to-Decision 1.1、API、Session、Event、导航与 2D | 已保留原集成行为 | 保持接口、数据契约和既有功能，完成增量回归 |

1.2 保留的历史摄像头/SIM 演示不等同于独立 V2.3 摄像头图层，不能据此将 V2.3 标为已集成。

1.3 已按两项独立增量接入 V2.2 体验区、V2.3 摄像头与设备详情。图层管理、体验区渲染、摄像头渲染、三份模拟数据和两份局部 CSS 均为已有独立实现的逐字节副本；仅适配场景调用链、集成控制器入口和版本标识。未新增其他分析图层或真实设备接入。

## 现有实现来源

以下路径相对于独立参考工作树中的 `hubone-crestc3-demo/`。

| 内容 | 已有源码或记录 |
| --- | --- |
| 最新独立入口与构建资源 | `frontend/space-v23.html`、`frontend/space-v23.js`、`frontend/space-v23.css`、`frontend/space-v23.bundle.js`、`scripts/build_space_v23_preview.py` |
| 场景适配链 | `frontend/three/scene-v23.js` → `scene-v22.js` → `scene-v21-aesthetic.js` |
| V2.2 图层管理与体验区域 | `frontend/three/spatial-layer-manager-v22.js`、`frontend/three/experience-area-overlay-v22.js`、`frontend/space-v22-data/experience-areas.json` |
| V2.3 摄像头与覆盖 | `frontend/three/camera-layer-v23.js`、`frontend/space-v23-data/cameras.json`、`frontend/space-v23-data/camera-coverage.json` |
| 独立实现验证依据 | `docs/SPACE_V22_EXPERIENCE_ACCEPTANCE.md`、`docs/SPACE_V23_CAMERA_ACCEPTANCE.md`、`tests/test_space_v22.py`、`tests/test_space_v23.py` |

上述适配层与集成版场景接口已核对兼容。独立图层接入 1.2 已有 Renderer、Camera、OrbitControls、floorGroup、拾取链和 Inspector。上一轮以 `three/scene-integrated-1.3.js` 为入口，本轮在其外增加 `three/scene-integrated-product.js`；仍生成原有唯一空间 bundle，构建图仅含一份 Three.js core。集成 HTML 的 body 保持逐字节一致。

集成场景调用链为 `scene-integrated-1.3.js → scene-v22.js → scene-integrated-1.2.js → scene-v21.js`。独立 V2.3 用于功能与视觉核对，未替换 1.2 建筑底座；建筑材质、光照、场景核心、CAD 数据契约及受保护业务模块均保持原样。

## 数据边界与保护要求

- 摄像头点位、安装高度、方向、FOV 和覆盖距离均为 **SIMULATED**，保持 `source`、`simulated`、`verified: false` 等来源信息；不得描述为真实安装设备、现场标定结果或真实监控覆盖率。
- 体验区业务边界同为 SIMULATED。复用 CAD 配准与现有扣洞展示楼板约束，不将全部楼板认定为真实消费者体验区域，也不宣称约束面已经验证可通行。
- 保留原 CAD 数据、模型 JSON、稳定 ID、坐标、法线、UV、中空、楼梯、连续滑轨与最大行程；维持 1.2 中间基线的建筑材质、光照、阴影与渲染表现。
- 保留 Crest C3、Evidence-to-Decision 1.1、API、Session、Event、导航、页面框架、全局 CSS 和公共组件；不覆盖原 main 或独立参考工作树中的未提交及未跟踪文件。
- 不自动提交、推送、合并或部署。1.3 完成后仍停在本地验收状态。

## Integrated Demo 1.3 统一验收

工程回归及真实浏览器核验已完成，人工验收待用户确认：

1. 对照独立 V2.3 逐项核对体验区、点位、安装方向、覆盖及设备 Inspector；确认各开关和分层控制、默认状态、关闭后的恢复行为。
2. 验证一层、二层、两层聚合及滑轨 `0% → 50% → 100% → 0%`；区域、设备、方向与覆盖均继承所属楼层，不漂移、错层、残留或覆盖中空。
3. 核对真实 CAD 构件、材质、灯光及原有交互保持 1.2 中间基线；验证重载、退出重入、2D/3D 切换与 CAD/设备 Inspector。
4. 回归集成首页、导航、Crest C3、Evidence-to-Decision 1.1 和既有 API、Session、Event 契约；确认只复用一套 Three.js 场景及渲染基础设施。
5. 实际浏览器截图、错误日志、测试结果、完整 Git Diff 和修改前后文件基线均保存到 1.3 交付目录。本轮停在 Integrated Demo 1.3 本地统一验收，不以独立预览入口或 1.2 代替最终交付。

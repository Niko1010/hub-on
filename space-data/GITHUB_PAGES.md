# GitHub Pages 在线交互预览

入口：**https://niko1010.github.io/hub-on/#space**

本次新增报告入口：**https://niko1010.github.io/hub-on/?v=decision-1#report**。回放本轮已保存的 Evidence-to-Decision **MOCK / SIMULATED** 决策报告，可点击事件证据、播放合成素材并导出 Markdown/JSON；网页不调用模型或设备。

V0.3 默认进入 Space Intelligence 三维视图，保留 2D 切换。使用 Three.js 实时绘制 CAD 衍生的一、二层，支持旋转、缩放、平移、等轴测复位、单层/总览/爆炸视图、CAD 区域高亮与右侧数据联动。缺失的高度和支撑楼板为明确 SIMULATED 展示，完整边界说明见 SPACE_3D_V0.3.md。

在线版直接读取静态空间 JSON/SVG，保留 CAD 原始坐标、XYZ、句柄、图层和稳定空间 ID，不依赖 FastAPI 常驻。摄像头、客流、停留时长、动线和事件保持 NOT CONNECTED；只有显式勾选后才显示 SIMULATED 测试设备及扇形。二层 PDF 待补充的提示继续保留。

左侧 Crest C3 五个页面回放本轮 MOCK / SIMULATED 资料，可播放已保存素材、浏览反馈、查看证据和决策报告。GitHub Pages 不提供上传、现场采集、ASR、视觉推理或大模型分析服务；这些使用 main 中可本地部署的完整 Python 后端。

## 分支与更新

- `main`：应用源码、统一 Provider、决策报告、Windows 说明和已确认可公开的衍生空间数据。原始 DXF/PDF、无损 tags/属性和运行资料不包含在公开源码中，详见 PUBLIC_EXPORT.md。
- `gh-pages`：已经构建的网页及资源，作为 Pages 的发布来源。原空间交互保持，C3 更新为本轮 Mock 决策报告。
- Pages 设置：Deploy from a branch → `gh-pages` → `/ (root)`。当前仓库已启用该配置；推送后 GitHub 自动运行 `pages build and deployment`。

构建脚本：

```bash
python scripts/build_space_preview.py --replay-source artifacts/decision --runtime-root runtime
```

脚本复用已保存的 SIMULATED 研究记录，再加入真实空间数据、只读浏览器适配器和 Space 页面。本次输入为 `scripts/accept_decision.py` 导出的 `artifacts/decision/`，`--runtime-root` 须指向该 Session 的真实后端数据目录。省略参数仍支持既有 `artifacts/online-preview-run/` 和 `runtime/online-preview/`。运行数据库不提交到 main。已有成品网页可直接检出 gh-pages 分支使用，不需重新跑模型。

`build_online_preview.py` 仍单独生成 C3-only 预览，供原离线 UI 模板打包；真实 CAD 的发布通过明确的 `build_space_preview.py` 完成。

## 静态环境验收

使用纯静态 HTTP 服务、真实 `/hub-on/` 项目路径执行：

```bash
python scripts/accept_pages_preview.py --url http://127.0.0.1:8021/hub-on/ --chromium /usr/bin/chromium
```

29 项浏览器检查通过：真实两层图元数、XYZ/标高边界、鼠标交互、框选、图层、摄像头来源隔离、实体/楼层 JSON/SVG/报告/API 说明下载、1440/1024/768/390px 布局，以及原 C3 五页回放与素材加载。没有 JavaScript 错误或资源 HTTP 失败。预览分支保存 `validation-result.json`；云工作区原始结果位于 `artifacts/v0.2/pages/result.json`。

在线 JSON 仅含交互所需几何与来源摘要，不含原始 DXF tags；原始 DXF/PDF、完整解析源码、数据库和凭据不上传至预览分支。工作区内无损数据不受影响。

GitHub Actions 的实际部署状态：
https://github.com/Niko1010/hub-on/actions

当前 Codex 网络不允许直接访问 `niko1010.github.io` 和 GitHub Pages REST API；部署状态通过允许访问的 GitHub Actions 网页核对。静态交互在本地浏览器使用同一构建文件验证。

本次 Mock 决策报告另外通过 24 项静态交互检查，包括视频第 1 秒、合成语音第 5 秒定位和两种导出。运行 `python scripts/accept_decision_pages.py --url http://127.0.0.1:8032/hub-on/` 时，文件服务必须支持 HTTP Range，才能准确验证视频跳转；例如使用 Starlette StaticFiles 映射 `/hub-on` 到 `preview-site/`。本次完整源码包通过 79 项软件测试，另 5 项需私有 CAD 源数据而明确跳过。记录见 docs/validation/decision-publication-validation.json。

V0.3 三维额外完成 29 项真实 WebGL 交互检查（后端与纯静态各通过），机器记录公开为 validation-3d.json；二维与 C3 的 29 项静态检查继续通过。未知高度、区域显示体块和支撑板均为明确演示参数。

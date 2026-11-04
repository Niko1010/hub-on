# HUBONE 品牌 UI 模板

依据用户提供的《HUB ONE VIS.pdf》和 Logo 图片，将现有五页 Dashboard 统一为 HUBONE 品牌样式。只改展示层，Session、分析、来源标签和证据链保持原有语义。

## 品牌依据

- PDF 第 5 页：提取与用户图片一致的竖式 `hubone` 矢量组合。保留图形、文字轮廓、间距和比例，没有重新绘制或用字体替代 Logo。
- 第 11–12 页：采用深蓝、浅蓝和辅助黄色。PDF 给出 CMYK，网页色值取自 PDF 内嵌矢量的 RGB 表示，供屏幕显示，不作为新的印刷色标准。
- 第 14–15 页：正文使用 Roboto / 思源黑体系列字栈；中文在本机回退到 Noto Sans CJK SC、苹方或微软雅黑。Roboto 从官方 Google Fonts 仓库下载，许可证随包提供。
- 第 30–31 页：借鉴蓝白底、清晰留白与放大圆弧辅助图形。网页 Hero、项目卡片和研究报告据此统一。
- PDF 中的示例公司地址、联系人、电话和邮箱没有作为应用数据使用。完整 VIS 文档没有发布到线上预览。

## 设计变量

| 变量 | 值 | 使用 |
|---|---|---|
| `--brand` | `#23518B` | 主按钮、选中导航、页头、报告封面 |
| `--sky` | `#659BD3` | 图标、趋势/主题条、辅助强调 |
| `--yellow` | `#F6CE5C` | 少量强调、混合倾向；模拟状态仍独立明确标注 |
| `--paper` | `#F4F7FB` | 工作区背景 |
| `--soft` | `#EDF4FC` | 辅助卡片和引用背景 |
| `--ink` | `#1D3048` | 正文层级 |
| `--line` | `#E3EAF3` | 分隔与卡片边线 |
| `--sidebar-size` | `240px` | 标准桌面侧栏 |
| `--page-gutter` | `40px` | 标准桌面页边距 |
| `--radius-card` | `12px` | 卡片 |
| `--radius-control` | `8px` | 控件基准 |

## 可复用文件

```text
frontend/index.html                 工作台模板骨架
frontend/style.css                  原有布局与组件基础
frontend/brand.css                  HUBONE 字体、配色与品牌覆盖层
frontend/assets/hubone-logo.svg      官方竖式组合
frontend/assets/hubone-symbol.svg    官方独立图形，用于小屏与辅助背景
frontend/assets/hubone-wordmark.svg  官方标准字轮廓
frontend/assets/roboto-variable.ttf  本地 Roboto 字体
frontend/assets/ROBOTO-OFL.txt       字体许可证
frontend/app.js                     原有交互和统一 SVG 图标
```

复用时先加载 `style.css`，再加载 `brand.css`，并保留 `assets/` 的相对路径。品牌组件以 `.page-heading`、`.card`、`.stats`、`.nav-link`、`.button`、`.pill`、`.insight` 和 `.report-paper` 为主。主图标均使用同一套线条 SVG。

Logo 在桌面使用完整竖式组合并留出边距；手机窄侧栏使用独立图形，避免挤压完整字标。未使用字体滤镜、拉伸或重新配色处理 Logo。

## 五页表现

1. 采集：品牌页头、Session 栏、统计卡、真实媒体播放器和上传控件。
2. 时间轴：统一事件节点、清晰的来源标签和可点击证据。
3. 反馈：蓝色关键词、倾向条、主题组和消费者原话。
4. 洞察：优先级卡片、浅蓝建议区域、实验与原始证据。
5. 报告：品牌蓝报告封面、清晰的章节排版和 Markdown 下载。

`SIMULATED`、`RULE_BASED`、`REAL_MODEL`、`MANUAL` 标记保留，不因换肤而混同。在线静态版仍是 `REPLAY` 回放，不会把禁用的模型/上传能力伪装成运行中。

## 预览与验证

`python scripts/build_online_preview.py` 会把相同品牌层和资源复制到静态预览；动态服务和 GitHub Pages 使用同一套界面。桌面与手机截图保存在 `artifacts/brand-ui/`。

可在已运行的服务上执行 `scripts/accept_dashboard.py`，检查五页 × 四种宽度 × 两类 Session 共 40 个布局场景、CSS/JS/SVG、媒体证据和报告下载。GitHub Pages 的真实可达性仍取决于仓库 Pages 设置和云环境网络策略，不以本地截图替代线上访问验证。

`python scripts/package_ui_template.py` 另生成 `artifacts/hubone-ui-template.html` 和模板 ZIP。HTML 自包含样例媒体、字体与界面，可供本地独立查看，仍明确标为 SIMULATED / REPLAY。已用单文件 HTTP 入口验证五页、媒体、证据、下载及无额外资源请求；云端浏览器管理策略阻止 `file://`，Windows 双击路径尚未实机验证。

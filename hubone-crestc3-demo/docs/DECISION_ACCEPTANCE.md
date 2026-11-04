# Evidence-to-Decision 云端软件验收

日期：2026-11-04。环境：Codex Cloud，Python 3.12，FastAPI/SQLite，真实 Chromium 浏览器。测试目的为软件完整性，**没有调用真实 Ollama/OpenAI/Anthropic 服务，没有访问 Windows 本地设备，也没有运行 GPU 性能测试**。

## 已完成

- Session 研究问题、目标、计划任务、待支持决定和音视频采集关系的创建/编辑；变更后报告与派生分析失效。
- 决策型结构化报告，包含行为记录、原始转录、时间关联、判断、诊断及替代解释、产品选项、实验和当前决定。
- FACT / INFERENCE / INSUFFICIENT_EVIDENCE 区分；FACT 仅表示原文记录存在，不表示产品缺陷或行为已被证实。
- Ollama、OpenAI、Anthropic 和自定义 OpenAI-compatible 共用 Provider 接口；没有模型比较页面。
- 严格 Schema、当前 Session 引用枚举、原话一致性、时间/资产归属、分析 ID 与诊断→选项→实验的完整性校验。
- 原始媒体/事件/时间/SHA-256 索引、可点击证据、Markdown/JSON 导出、Prompt 与生成信息 hash。
- 显式 Mock 演示入口。全部输入 SIMULATED，处理标 MOCK，`model_inference_executed=false`；不会把离线模板标成真实模型。
- 修复既有分析下拉框的错误 `</option value="llm">` 标签，LLM 选项现在可被实际选择。
- 2D/3D 空间渲染代码、模型与 CAD 数据保持不变，经 Git 差异检查确认。

## 实际结果

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 全部非硬件 Python 回归 | **84 passed，1 deselected** | `artifacts/decision/pytest.xml` |
| 新决策/Provider 软件单元与接口测试 | 上述 84 中有 **29 项** | `tests/test_decision.py` |
| Mock Provider 的 Prompt/Schema 检查 | **passed_software_mock** | `artifacts/decision/provider-check.json` |
| Mock HTTP 端到端 | **51 项通过** | `artifacts/decision/acceptance-result.json` |
| Chromium 交互与布局 | **23 项通过** | `artifacts/decision/browser/result.json` |
| 浏览器 JavaScript / HTTP 错误 | **0 / 0** | 同上 |

执行命令：

```bash
python -m pytest -q -m "not integration" --junitxml=artifacts/decision/pytest.xml
python scripts/check_provider.py --provider mock
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
# 另一终端：
python scripts/accept_decision.py
python scripts/accept_decision_ui.py --chromium /usr/bin/chromium
```

被排除的 1 项是既有真实 CPU 视觉/ASR integration 测试，本轮没有重新运行。测试框架有 1 条既有 anyio BlockingPortal 弃用提示，不影响本轮通过结果。

其中包含“没有任何模型和样例媒体文件”的 API 演示测试，确认软件链路仍完成、媒体 URL 保留空值，并明确显示没有关联媒体资产。

HTTP 验收建立 **8 条模拟原始事件**（视频 2、语音 4、人工 2）并派生报告，逐项核对同 Session、方法标签、引用、时间换算、媒体资产 hash 和附件导出。可选播放素材是既有 SIMULATED 照片视频与 TTS 文件，不是消费者录像或模型输出。

浏览器实际执行：UI 新建 Mock 演示、三种判断标签、有效的 LLM/Mock/规则选择、点击原始证据、音频文件定位到第 5 秒、两种报告下载、修改问题后失效/重新生成、1440/1024/768/390 宽度无横向溢出，以及真实 Session 不显示 Mock 选项。没有申请摄像头/麦克风权限。

## 未验证 / 留待本地

| 项目 | 当前结论 |
| --- | --- |
| Windows Ollama 的真实请求、模型输出质量 | 未验证；按本地说明运行 `check_provider.py --provider ollama` |
| OpenAI、Anthropic、自定义供应商真实调用 | 未验证；MockTransport 只验证请求/响应协议 |
| RTX 5070 显存、吞吐、延迟、加速支持 | 未验证 |
| Windows 实体摄像头/麦克风采集与权限 | 未验证 |
| 真实 Crest C3 同次音视频 → 识别/转录 → 模型 → 决策报告 | 未验证；等待本地录制、模型配置和研究员复核 |
| 自动确认身份、因果、专属穿戴动作或真实产品缺陷 | 未实现；本轮没有将其包装成已完成能力 |
| 多模型对比系统 | 按优先级暂停，不在本轮范围 |

Schema/引用校验通过不等于语义被证据支持。Mock 中的改进选项及示例阈值是固定演示计划，不构成真实研究发现或已经通过的实验。

## 交付与运行

GitHub 干净源码包单独执行软件回归：**79 passed，5 skipped，1 deselected**。5 项跳过属于原始 CAD / 无损属性重建检查，未计为通过；完整工作区的 84 项结果保留。发布前另外通过 **24 项纯静态 Mock 报告检查**、29 项二维/C3 静态回归和 29 项三维 WebGL 回归，浏览器无 JS/HTTP 错误。静态媒体定位使用支持 HTTP Range 的文件服务核对；普通 `http.server` 在当前浏览器中不能正确支持视频跳转，不能仅凭能播放就判定定位通过。

- 可读样例报告：`artifacts/decision/report.md`；完整 JSON/事件/Session/引用审计同目录。
- UI 截图：`artifacts/decision/browser/report-1440.png`、`report-390.png`、`evidence-dialog.png`。
- [报告引擎和 API](EVIDENCE_TO_DECISION.md)。
- [Windows / Ollama / 实体设备操作](WINDOWS_EVIDENCE_TO_DECISION.md)。
- GitHub Pages 保留空间展示，C3 更新为本次 Mock 决策报告回放；Python 后端和真实模型推理不部署到 Pages。

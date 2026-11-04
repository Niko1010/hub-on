# Evidence-to-Decision 决策研究链路

本轮范围：报告引擎、统一 Provider、结构化输出与证据校验、Mock 软件验收及 Windows 操作说明。**3D 模块和 CAD 数据保持不变；不开发模型比较页面。**

## 当前验证边界

| 项目 | 本轮状态 |
| --- | --- |
| 决策型报告、Session 关联、证据索引、Markdown/JSON 导出 | 已实现并进行软件验收 |
| Mock Provider + 模拟视频/语音/人工事件 | 已运行；SIMULATED + MOCK，不调用模型 |
| Ollama、OpenAI、Anthropic、自定义接口 | 已实现统一接口；仅通过 Mock HTTP 协议测试 |
| 真实 Ollama 推理和模型分析质量 | 未验证，回家后在 Windows 执行 |
| 真实摄像头/麦克风、RTX 5070 性能 | 未验证 |
| 真实 Crest C3 同步消费者实测 | 当前没有此类输入；不得输出已验证的产品结论 |

SIMULATED 是**输入性质**；MOCK、RULE_BASED、REAL_MODEL、MANUAL 是**处理方式**。两者独立。例如未来可以用真实 LLM 分析模拟资料，但输入仍为 SIMULATED。本轮新报告是 MOCK，`model_inference_executed=false`。既有真实模型测试不计入本轮软件验收。

## 明天的演示入口

1. 从项目目录启动现有 FastAPI：`python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000`。
2. 在**运行后端的同一台电脑**打开 `http://127.0.0.1:8000/#report`。
3. 点击“运行软件流程演示 · SIMULATED + MOCK”。它建立独立模拟 Session，不调用 YOLO、ASR、Ollama 或任何外部模型。
4. 按研究问题阅读：行为记录 → 原话 → 多模态时间关联 → 判断/替代解释 → 改进选项 → 下一轮实验 → 当前决定。
5. 点击 `↗ E:...` 回到原始事件；若附有素材则播放视频/合成语音并定位到文件时间。导出 Markdown 和 JSON。

模拟事件在 `sample_data/decision_session.example.json`。如果本机已有 `generate_samples.py` 生成的样例媒体，演示附加该 SIMULATED 视频和 TTS 音频；没有这些文件也能运行文本与事件软件链路，报告会明确“没有关联媒体资产”。视频是参考照片生成的测试片段，不是参与者动作录像；不得据此证明脚本行为。

**GitHub Pages 是原有静态回放与空间预览，不能运行这个 Python 报告引擎，也不能访问你家 Ollama。本轮未把后端部署到 GitHub Pages。**

## 报告数据与职责

```text
Session.research：问题、目标、计划任务、待支持的决定、音视频采集关系
原始 Session/Event/Asset → evidence_snapshot → observations / quotes / evidence_index
                         → Prompt + 当前事件引用枚举 + JSON Schema
                         → LLMProvider.generate(GenerationRequest)
                         → Schema/原话/引用/诊断-选项-实验校验
                         → decision_analysis + generation + 完整事件快照
                         → Dashboard / Markdown / JSON
```

- `backend/models.py`：ResearchBrief，沿用原有 Session/Event；SQLite 的 JSON payload 增加字段，无需重建数据库。旧 Session 有默认研究问题。
- `adapters/providers.py`：统一 `GenerationRequest → GenerationResponse` 接口。Ollama/OpenAI/custom 走 Chat Completions；Anthropic 走 Messages + 强制结构化 tool output。没有 Agent 工具执行。
- `adapters/mock_provider.py`：固定软件夹具。只接受显式模拟 Session，从不自动接管失败的模型请求。
- `analysis/decision_schema.py` 和 `analysis/schemas/evidence_to_decision.schema.json`：同一契约的代码与 JSON 版。
- `analysis/prompts/evidence_to_decision.txt`：可审查的中文 Prompt，声明资料不可信、身份/时间/因果限制及证据不足分支。
- `analysis/decision.py`：证据准备、引用校验、规则基线与既有洞察页的兼容投影。
- `analysis/report.py`、`decision_render.py`：报告快照、标签、章节及原始证据索引。

输出包含 `claims`、`diagnoses`、`options`、`experiments`、`decision`。所有判断区分：

| 标签 | 允许表达 | 限制 |
| --- | --- | --- |
| FACT | 原始记录里存在某段内容 | statement 必须逐字匹配被引事件的 description/raw_text；不证明 ASR、行为规则或反馈内容客观正确 |
| INFERENCE | 研究解释、建议、优先级和计划实验 | 必须有原始引用；诊断要有替代解释与证据缺口 |
| INSUFFICIENT_EVIDENCE | 当前无法回答/确认 | 允许无引用，但必须说明理由；不能强造诊断或产品修改 |

研究任务始终是 PLAN，不作为已完成行为。实验的指标/成功标准是待执行计划，不是测试结果。无相关产品证据时允许 diagnoses/options/experiments 为空。

## 校验和可追溯性

保存前检查：严格 Schema、唯一分析 ID、当前 Session 原始事件 ID、禁止派生分析充当原始证据、FACT 逐字匹配、诊断/选项/实验引用完整、每个选项有验证实验、资产归属/类型、原话一致性、`session timestamp = file time + offset`、语音结束时间和证据帧名称。

`evidence_index` 保留原始全文、来源/处理标签、Session 时间、文件时间、偏移、资产 ID/SHA-256、媒体 URL、证据帧 URL、说话人状态；这些链接由服务器构造，不允许模型编造。`generation` 保存 Prompt/Schema/输入/模型响应 hash、请求模型/服务返回模型、耗时和引用校验状态。原事件快照独立保留。

这些检查保证结构和引用完整性，**不能自动验证解释是否被原话语义支持，不能建立说话人身份、因果关系或同步采集真实性**。`semantic_truth_verified=false`，需要研究员复核。不做静默 JSON 修复、静默截断或 LLM→规则/Mock 自动降级。

## API

| 方法和地址 | 用途 |
| --- | --- |
| POST `/api/sessions` | 建立 Session，可附 `research` |
| PATCH `/api/sessions/{sid}/research` | 更新研究问题等设置；旧报告及派生分析失效 |
| GET `/api/research/schema` | 完整结构化输出 Schema |
| POST `/api/research/demo` | 显式 SIMULATED + MOCK 软件链路，返回 Session 和异步 job |
| POST `/api/sessions/{sid}/analyze` | `{"provider":"llm"}`、`mock` 或 `rules`；mock 只允许模拟 Session |
| GET `/api/sessions/{sid}/jobs/{jid}` | 任务状态及失败原因 |
| GET `/api/sessions/{sid}/report` | 完整 JSON 报告 |
| GET `/api/sessions/{sid}/report.md` / `report.json` | 附件导出 |
| GET `/api/sessions/{sid}/assets/{aid}` | 同 Session 原始媒体 |

`llm` 选择服务器 `.env` 中唯一的 `LLM_PROVIDER`，前端不发送 API Key，没有本轮不需要的多模型比较功能。云服务报错、超时、拒绝、截断、非 JSON 或非法证据会使 job 失败，不创建替代报告。此前有效快照不会被伪装成此次模型成功。

## 软件验收

已有依赖环境中：

```bash
python -m pytest -q -m "not integration" --junitxml=artifacts/decision/pytest.xml
python scripts/check_provider.py --provider mock
# 另一个窗口启动后端，再执行：
python scripts/accept_decision.py
# 可选浏览器验收，需要 requirements-browser.txt 和 Chromium：
python scripts/accept_decision_ui.py --chromium /path/to/chromium
```

`artifacts/decision/` 生成可读报告、JSON、Session/事件、引用审计和验收记录。`tests/test_decision.py` 的 Provider HTTP 测试使用 MockTransport，**不等于调用供应商服务**。

Windows 真实采集与 Ollama 的下一步操作见 [本地连接说明](WINDOWS_EVIDENCE_TO_DECISION.md)。本轮结果见 [软件验收记录](DECISION_ACCEPTANCE.md)。

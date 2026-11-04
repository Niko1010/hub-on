# Windows 本地：Ollama 与真实消费者采集

状态：以下是**待你回家后执行**的操作。Codex Cloud 没有连接你的 Windows、RTX 5070、摄像头或麦克风，本轮未验证真实模型质量或 GPU 性能。

## 1. 启动自己的本地后端

把完整项目放在 `D:\Projects\hubone-crestc3-demo`。不要复制 Linux `.venv`。已有本地环境直接更新项目；首次安装 Python 3.12 x64、ffmpeg 后双击 `INSTALL_WINDOWS.cmd`。详细依赖安装见 [既有 Windows 安装说明](WINDOWS_DEPLOYMENT_V0.1.md)。3D 已附构建产物，运行不要求 Node。

在项目根目录 PowerShell 中先验证纯软件链路：

```powershell
cd D:\Projects\hubone-crestc3-demo
.\.venv\Scripts\python.exe scripts\check_provider.py --provider mock
.\START_WINDOWS.cmd
```

保持启动窗口打开，浏览器应在后端就绪后打开。访问本机 `http://127.0.0.1:8000/#report`，点击“运行软件流程演示 · SIMULATED + MOCK”。如 8000 被占用，用 `START_WINDOWS.cmd --port 8001`。

Mock 软件链路不要求 Ollama、视觉/ASR 模型文件；如果没有样例媒体，证据仅能追溯到测试事件/文本，界面不会假装有真实录像。

`127.0.0.1` 永远指当前访问的那台电脑。直接在 Windows 浏览器打开云端/Pages 地址不能连接 Windows 本地后端。此阶段不要求暴露 Ollama 到公网。

## 2. 在同一台 Windows 安装与检查 Ollama

从 `https://ollama.com/download/windows` 安装官方 Ollama。重新打开 PowerShell：

```powershell
ollama --version
ollama pull qwen2.5:7b
ollama list
Invoke-RestMethod http://127.0.0.1:11434/api/tags
```

模型示例为 `qwen2.5:7b`，不是本轮经过质量验收的推荐结论。也可以选择自己已有、支持指令和 JSON Schema 的模型，名称要与 `ollama list` 完全一致。若服务未运行，启动 Ollama 应用；只有确认没有现存服务时才另开终端运行 `ollama serve`。

服务仅在本机监听即可。若后端在 Docker/WSL 内运行，`127.0.0.1` 的含义会改变；为减少展示风险，本次先直接在 Windows Python 环境启动后端。

## 3. 配置并验证结构化模型请求

若还没有 `.env`，复制 `.env.example`；有文件时编辑对应字段，保留自己的其他配置。设置：

```dotenv
ANALYSIS_PROVIDER=llm
LLM_PROVIDER=ollama
LLM_BASE_URL=http://127.0.0.1:11434/v1
LLM_MODEL=qwen2.5:7b
LLM_API_KEY=
LLM_TIMEOUT_SECONDS=600
LLM_MAX_OUTPUT_TOKENS=6000
VISION_DEVICE=cpu
ASR_PROVIDER=sherpa
```

修改 `.env` 后在原后端窗口按 Ctrl+C，再执行 `START_WINDOWS.cmd`。否则启动脚本可能打开仍运行旧配置的实例。

先在另一个 PowerShell 检查同一套 Prompt、Schema 和证据校验：

```powershell
.\.venv\Scripts\python.exe scripts\check_provider.py --provider ollama --base-url http://127.0.0.1:11434/v1 --model qwen2.5:7b --output artifacts\local-ollama-check.json
```

只有本机请求和校验成功才会输出 `passed_live_provider_request` 和 `model_inference_executed=true`。这仍然只是**真实模型调用 + 模拟输入**的结构验证；不证明模型研究质量、真实产品结论或 GPU 表现。失败时返回非零退出码和原因，不切换成 Mock。

常见问题：连接失败检查 `/api/tags`；404 检查 base URL 和模型名；400 检查模型/服务是否支持 `response_format: json_schema`；截断增大输出上限或改用更适合的模型；超时先确认模型能在本机完成短请求。不得把失败的实际请求记为已完成。

## 4. 真实视频/语音 → 同一个 Session → 决策报告

首次使用本地模型前运行 `python scripts/download_models.py` 准备已有视觉与 SenseVoice 模型。无需为本轮研究先修改 CUDA；视觉和 ASR 默认 CPU。Ollama 如何分配 GPU、RTX 5070 的显存和推理速度均需本机另外记录，不能由当前云端结果推断。

1. 在“实时采集”新建 Session，**不要勾选“新体验为模拟资料”**。
2. 在“研究问题 → 验证决定”编辑问题、目标、计划任务、待支持决定。仅在确实同次采集时选择“同一次采集”，该声明仍需核验。
3. 首选上传同次真实体验的 MP4 和 WAV/MP3。填写各文件相对 Session 起点的真实偏移；同起点才都为 0。先分别执行视频分析和音频转录，确认任务完成。
4. 查看时间轴：检测事件 REAL_MODEL、基础行为规则 RULE_BASED、ASR REAL_MODEL。原始素材来自用户时仍标 USER_PROVIDED，不自动当成已核验实录。穿戴/调整腰带/上坡目前需要人工标注，不能声称模型已经识别。
5. 回听并核对语音内容和段级时间。SenseVoice 时间来自 VAD 分段，不是逐字强制对齐；说话人分离不默认可用。
6. 选择 `ollama · 配置模型生成`，点击“生成决策型报告”。等待真正完成，查看 `generation.provider=ollama`、`processing_method=REAL_MODEL`、`model_inference_executed=true`。
7. 逐条点击证据，检查原话、画面、文件时间和资产；复核诊断是否考虑替代解释。导出 Markdown/JSON，记录模型名称、耗时与人工复核意见。

如果报告缺少行为或语音证据，必须作为缺口保留；不通过补充虚构事件来完成演示。

## 5. 真实摄像头与麦克风

使用 Windows Chrome/Edge，打开本机 `http://127.0.0.1:8000`；在 Windows 隐私设置允许桌面应用使用摄像头/麦克风，并在浏览器允许权限。

- “开启摄像头预览”：仅本机预览，不自动分析。
- “录制体验”：录制视频及麦克风，停止后上传到当前 Session；同一录制文件分别形成视频/音频资产并按相同起点处理。
- “录制麦克风”：独立录音，停止后上传与转录；需记录其实际 Session 偏移。

**现有流程为录制后批处理，不是实时逐帧行为分析。** 本轮浏览器验收仅播放 SIMULATED 文件，没有申请实际设备权限。

如没有设备可先上传已有 MP4/WAV；如 ASR 不可用，人工文本保留 MANUAL，不能作为“真实 ASR 已完成”。

## 6. 其他 Provider 配置预留

以下接口仅通过软件协议测试，本轮没有真实网络调用：

| LLM_PROVIDER | LLM_BASE_URL | 模型/鉴权 |
| --- | --- | --- |
| openai | `https://api.openai.com/v1` | 账号可用模型；LLM_API_KEY 或官方主机上的 OPENAI_API_KEY |
| anthropic | `https://api.anthropic.com/v1` | 账号可用 Claude 模型；LLM_API_KEY 或官方主机上的 ANTHROPIC_API_KEY |
| custom | 自定义 OpenAI-compatible 地址（保留 `/v1` 或服务前缀） | 显式 LLM_MODEL 和 LLM_API_KEY；本机服务可无 Key |

每次切换同时修改 provider/base/model/key 并重启后端。OpenAI 全局 Key 不会被自动转发给自定义服务，Anthropic Key 同理。密钥仅放后端 `.env`，不要提交 GitHub 或填到前端。

Ollama/custom/OpenAI 使用 JSON Schema 响应格式；Anthropic 使用强制工具返回结构化 JSON，服务器**不会执行模型生成的工具代码**。本轮没有多个模型对比页面。

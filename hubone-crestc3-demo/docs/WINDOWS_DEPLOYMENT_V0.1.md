# V0.1 本地 Windows 部署与验收说明

适用：Windows 10/11 x64、Python 3.12、可选 RTX 5070。云端已验证 CPU 流程；下列 Windows、实体设备、RTX 5070 与本地真实 LLM 仍需要在你的机器执行验收。

## 1. 准备文件和工具

将完整的 `hubone-crestc3-demo` 文件夹复制到本地，例如 `D:\Projects\hubone-crestc3-demo`。保留 `third_party/`、`frontend/`、`sample_data/` 和 `scripts/`；不要只复制 backend 或双击 index.html。此服务从 FastAPI 提供页面和静态资源，没有 npm 构建步骤。

不要复用云端 Linux 的 `.venv`；在 Windows 重新创建虚拟环境。`models/` 可保留已校验的模型文件，或由下载器重新准备。

安装 Python 3.12 x64 和 ffmpeg。可用 PowerShell：

```powershell
winget install --id Python.Python.3.12 -e
winget install --id Gyan.FFmpeg -e
# 安装完成后新开 PowerShell
py -3.12 --version
ffmpeg -version
ffprobe -version
cd D:\Projects\hubone-crestc3-demo
py -3.12 -m venv .venv
```

全程可直接调用虚拟环境中的 python，无需修改 PowerShell 执行策略。

## 2. 先验证 CPU 环境

```powershell
.\.venv\Scripts\python -m pip install torch==2.7.1 torchvision==0.22.1 --index-url https://download.pytorch.org/whl/cpu
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python scripts\download_models.py
.\.venv\Scripts\python scripts\generate_samples.py
.\.venv\Scripts\python scripts\prepare_acceptance_media.py
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
$env:VISION_DEVICE="cpu"
$env:ASR_PROVIDER="sherpa"
.\.venv\Scripts\python -m pytest -q
.\.venv\Scripts\python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

`generate_samples.py` 生成 SIMULATED 演示资料；`prepare_acceptance_media.py` 准备独立的真实录制参考资料。两类资料不会混称。下载器使用官方 HTTPS 和固定模型 hash，不应为解决下载错误而关闭 TLS 或改掉期望 hash。

保持第一个窗口中的服务运行，浏览器打开 `http://127.0.0.1:8000`。另开 PowerShell，在项目根目录执行：

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health
.\.venv\Scripts\python scripts\accept_v01.py
```

健康接口应返回 status=ok，真实媒体脚本必须返回 status=passed；不能只凭端口已打开判断成功。脚本默认分别上传 `sample_data\acceptance\real-video.mp4` 与 `real-speech.wav`，验证模型、事件、偏移、Session、时间关联和证据引用。

也可指定自己的文件：

```powershell
.\.venv\Scripts\python scripts\accept_v01.py --video D:\Recordings\experience.mp4 --audio D:\Recordings\feedback.wav --output artifacts\my-media
```

该验收脚本只验证共同时间轴的计算，并不能证明两份输入来自同一人。默认使用视频 2.5 秒、音频 1.25 秒的测试偏移；真正研究请在 Dashboard 按实际录制关系填写偏移。短到没有人体/可转录语音的文件会验收失败，不会补造事件。

## 3. 确认完整 Dashboard

依次查看实时采集、体验时间轴、消费者反馈、产品洞察和研究报告。页面应具有左侧 HUB ONE 蓝白色导航、卡片、统计、视频/音频播放器、反馈图表和主题组、洞察卡片、报告排版。

静态资源排障：

1. 必须通过后端地址访问，不要用 `file://` 或直接双击 `frontend/index.html`。
2. F12 → Network 检查 `/static/style.css`、`brand.css`、`app.js` 和 `assets/hubone-logo.svg` 返回 200 或有效缓存响应；CSS Content-Type 应为 text/css，不能是 HTML 错误页。URL 的版本查询参数随发布更新。
3. 改过文件后按 Ctrl+F5。确认启动目录是项目根目录，且浏览器端口与 Uvicorn 一致。
4. 根路径部署是 V0.1 支持方式；在反向代理子路径下部署尚未验证。

可自动验收五页和响应式布局：

```powershell
.\.venv\Scripts\python -m pip install -r requirements-browser.txt
.\.venv\Scripts\python -m playwright install chromium
.\.venv\Scripts\python scripts\accept_dashboard.py
```

先完成 `accept_v01.py`，其生成的 Session ID 才能被界面验收读取。产物位于 `artifacts\v0.1\dashboard`，包括 1440/390px 截图和 40 个布局检查结果。

## 4. Ollama：无需远程 API Key

安装并启动本机 Ollama。若桌面安装已在后台运行，不要重复启动同一端口的服务。

```powershell
winget install --id Ollama.Ollama -e
# 安装完成后新开窗口；必要时另开窗口运行 ollama serve
ollama pull qwen2.5:1.5b
ollama list
Invoke-RestMethod http://127.0.0.1:11434/api/version
```

在启动 Demo 的同一个 PowerShell 窗口设置：

```powershell
$env:LLM_PROVIDER="ollama"
$env:LLM_BASE_URL="http://127.0.0.1:11434/v1"
$env:LLM_MODEL="qwen2.5:1.5b"
$env:LLM_API_KEY=""
.\.venv\Scripts\python scripts\check_llm.py --output artifacts\v0.1\ollama-local.json
```

本 Adapter 使用 Ollama 的 **OpenAI-compatible `/v1/chat/completions`**，不是 `/api/chat`。设置裸地址 `http://127.0.0.1:11434` 时，ollama 模式会补 `/v1`。本机免密请求不强制要求 Key，也不把全局 OPENAI_API_KEY 转发给本机 Ollama。

只有 `check_llm.py` 返回 `status=passed`、`response_origin=REAL_MODEL` 且有合法 evidence_ids，才算本地真实模型验收通过。HTTP 协议 mock 测试、`ollama list`、`api/version` 或端口可连接都不能替代这一步。模型名必须和 list 中完全一致，且模型必须能输出符合 Schema 的 JSON。

设置完后重启 Demo 服务，使新的环境变量生效；在“生成研究分析”下拉框选择“大模型 API”。最终洞察标为 REAL_MODEL，情感/关键词/主题预分类仍是 RULE_BASED，资料若是模拟输入仍显示 SIMULATED。

## 5. OpenAI 与其他兼容服务

远程 OpenAI：在本地 `.env` 中配置，密钥不要提交 Git 或填写到前端：

```dotenv
LLM_PROVIDER=openai
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
LLM_API_KEY=填写你自己的密钥
```

若前一节设置过 PowerShell 的 LLM 环境变量，它们优先于 `.env`；请在新窗口运行，或先清除对应的旧变量。随后：

```powershell
.\.venv\Scripts\python scripts\check_llm.py --output artifacts\v0.1\openai-local.json
```

其他 OpenAI-compatible 本地服务，例如 LM Studio，配置为 `LLM_PROVIDER=openai`、`LLM_BASE_URL=http://127.0.0.1:1234/v1` 和服务实际模型名。loopback 免密服务允许空 Key；远程 openai 模式仍要求有效凭据。

当前云环境没有真实 Ollama 服务或 OpenAI 密钥，因此这里只提供通过协议验收的配置与真实调用检查脚本，不宣称你的模型已运行成功。连接失败、401、缺模型、超时、非法 JSON 或虚构引用都会失败，不会自动改成规则报告冒充成功。

## 6. 可选 RTX 5070 视觉加速

先在本地安装支持 RTX 5070 的 NVIDIA 驱动，确认 `nvidia-smi` 正常。然后在虚拟环境安装 CUDA 12.8 构建：

```powershell
.\.venv\Scripts\python -m pip install --upgrade torch==2.7.1 torchvision==0.22.1 --index-url https://download.pytorch.org/whl/cu128
.\.venv\Scripts\python -c "import torch; print(torch.cuda.is_available()); print(torch.cuda.get_device_name(0))"
$env:VISION_DEVICE="cuda"
.\.venv\Scripts\python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

若检测不到 CUDA，使用 `VISION_DEVICE=cpu` 排查基础链路。SenseVoice 保持 CPU INT8，Ollama 是否使用 GPU 由 Ollama 自身负责。云端未验证你的驱动、RTX 5070 速度或显存占用。

## 7. 本地摄像头、麦克风与时间戳

Chrome/Edge 中允许摄像头和麦克风权限。录制结束后上传、分析，当前不是连续低延迟流式 ASR。没有说话人模型时标签为 null/unknown；不要把说话人文本标签当成身份验证。

USB/RTSP 接口保留：

```powershell
.\.venv\Scripts\python scripts\capture.py --source 0 --duration 15 --output runtime\usb.mp4
```

V0.1 的视频时间使用帧编号/文件 FPS。本轮真实 MP4 是恒定帧率 CFR，时间换算已验证；手机可变帧率 VFR、剪辑时间跳变和长时钟漂移没有验收。可先规范化为 CFR：

```powershell
ffmpeg -i phone.mp4 -vf fps=30 -c:v libx264 -pix_fmt yuv420p -c:a aac normalized.mp4
ffmpeg -i normalized.mp4 -vn -ac 1 -ar 16000 feedback.wav
```

从同一个 normalized.mp4 提取 WAV 时二者起点相同，偏移可都填 0。独立录制需实际对齐；仅填同一个 Session ID 不会自动校准拍摄设备的时钟。

## 8. 查看报告与验收失败排查

UI 的研究报告页下载 Markdown；脚本结果在 `artifacts\v0.1`，后台报告在 `runtime\reports\SESSION_ID`。资料更新后旧报告失效，重新分析即可。

| 现象 | 检查 |
|---|---|
| 页面只有文本/没有样式 | 后端根 URL、静态资源 200/MIME、Ctrl+F5；不要双击 HTML |
| ffmpeg/ffprobe 找不到 | 安装后新开窗口，确认 PATH 中命令可运行 |
| DLL load failed | Python 必须为 x64；检查包版本和 Visual C++ 运行库 |
| 模型 checksum 失败 | 停止使用损坏包，删除对应本地缓存后从官方地址重下；不改期望 hash |
| Ollama ConnectError | Ollama 是否运行、11434、服务地址和本机防火墙 |
| 模型不存在 | `ollama list`、pull 是否完成、LLM_MODEL 拼写 |
| HTTP 401/403 | 对应服务的密钥/授权/网络，不要将代理或错误页当成模型结果 |
| JSON/引用校验失败 | 模型未遵守响应约束；保留失败记录，选择合适模型后重新实测 |
| 没检测到人体/没转录 | 原始画面、清晰度、音量、VAD 和输入时长；不会自动补造数据 |

本地通过的 `check_llm.py` 输出、Windows 全套测试结果和真实设备样例，是关闭 V0.1 剩余验收项所需的证据。

# 四仓库源码调研与整合决策

检查时间：2026-11-04。所有结论基于实际 clone 后的源码，不只基于 README。精确提交见 `upstream-manifest.json`。

| 仓库 | 实际检查的入口与模块 | 观察与采用方式 |
|---|---|---|
| RetailVision | `pyproject.toml`、`requirements.txt`、`src/retailvision/schemas.py`、`cv/detector.py`、`cv/tracker.py`、`cv/pose.py`、`cv/activity.py`、`ingestion/video_loader.py`、`spatial/zones.py`、`pipeline/processor.py` | YOLO 只输出 person 类；IoUTracker 可在 CPU 做匈牙利匹配；pose 是 crop 内坐标；ActivityTracker 的第一帧/缺少关键点返回 UNKNOWN。直接保留必要原文件并调用，未重写检测/追踪/区域算法。 |
| Bristlenose | `bristlenose/stages/s05_transcribe.py`、`s06_merge_transcript.py`、`s09_quote_extraction.py`、`s10_quote_clustering.py`、`models.py`、`utils/text.py`、`utils/timecodes.py` | 原话保留、原文/编辑文本分开、时间定位、LLM 输出校验及引文引用。完整 pipeline 很大且 AGPL；只采用研究方法，不复制实现。自己的离线主题/情感是透明基线，不声称具备原项目完整语义能力。 |
| Store Intelligence | `app/main.py`、`app/schemas/event.py`、`app/db/models.py`、`app/api/routes/events.py`、`app/services/ingestion_service.py`、`session_service.py`、`metrics_service.py` | 原项目用店铺/访客/session 表和重复 event_id 检查。Demo 改为显式 session_id 的 SQLite 事务模型与可重跑的 asset run_key，减少运行依赖。未复制未明确许可的原代码。 |
| Seeed Retail AI | `services/voice-pipeline/src/realtime_pipeline.py`、`ws_broadcast.py`、`docs/data_interfaces.md`、`deploy/docker-compose.asr-realtime.yml`、`backend/app/voice_analysis.py` | 实际是 Silero ONNX VAD → HTTP Qwen3 ASR → VoxEdge CAM++ embedding → 临时标签/重聚类 → JSON turn。实时链路并非“pip install 后即可运行”的通用模块；复用 VAD 状态机，保留 Qwen HTTP 适配器，改用 CPU SenseVoice 为默认文件 ASR；广播由 FastAPI 实现。 |

## 不能直接搬用的部分

- RetailVision 原 requirements 包含 GPU、ReID、AWS、Streamlit 全栈。这里只安装 CPU 视觉所需依赖。保留原始接口，显式传入权重、CPU 配置，避免隐式读取整个商店配置。
- RetailVision pose 输出 crop 内坐标，直接比较移动 crop 会把画面运动消掉；薄封装将关键点恢复到全帧坐标后再交给活动规则。
- 单目视频没有地面标定，不能报告米/秒、上坡角度或外骨骼助力强度。体验区为画面归一化多边形。
- Seeed 说话人模块依赖 `voxedge.capabilities.speaker_embedding`、模型和服务。没有这些依赖时保持 `speaker=null`，不按段交替编号伪造说话人。
- Qwen3-ASR 保留 `POST /asr?language=zh` 的文件接口；未部署硬件服务，没有声称已验证真实 Qwen 服务。
- Hugging Face 的 CPU Whisper 模型地址在当前网络返回 CONNECT 403。没有关闭 TLS、绕过代理或停工；采用允许的 GitHub 官方 SenseVoice 发布包并实际转录。Whisper 适配器仍可供其他环境使用。

## 事件证据约定

媒体相对秒 `start/end` + 输入 `offset_seconds` = Session 相对秒 `timestamp/end_timestamp`。采集时间 `created_at` 是 UTC 墙钟，只用于展示，不参与模态关联。

所有 utterance 保留 `raw_text` 与原始 `quote`。规则只拆分反馈，不修改原始证据。报告中的引文 ID 必须属于当前 Session 快照。`AI_analysis` 事件是派生假设，不作为新的消费者观测再输入分析。资料变化会使旧报告和派生洞察失效。

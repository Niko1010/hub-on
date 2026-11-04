# 上游代码和模型来源

四个原仓库完整保留在当前云工作空间 `/workspace/upstream/`，没有修改其源码或 Git 状态。锁定版本见 `docs/upstream-manifest.json`。`scripts/clone_upstreams.py` 可在其他机器重建这些参考仓库；运行 Demo 不需要安装四个原项目。

## 直接复用

### RetailVision — Jay14090/retailvision

`third_party/retailvision/` 保留以下原始模块（文件未修改）：检测、IoU/ByteTrack 追踪实现、姿态估计、活动特征与规则、视频探测、区域几何、配置、数据类、日志和模型生命周期记录。实际运行采用 `YoloPersonDetector`、`IoUTracker`、`YoloPoseEstimator`、`ActivityTracker`、`ZoneMap` 和 `probe_video`，由 `adapters/vision.py` 和 `vision/pipeline.py` 薄封装。

原仓库 `pyproject.toml` 声明 MIT，原文件保存在 `third_party/retailvision-pyproject.original.toml`。该提交未提供独立 LICENSE 文件；保留所有源码原有标头和声明，未虚构版权持有人。逐文件校验清单见 `third_party/retailvision-files.sha256`。

区域几何接口本身不限定单位；本 Demo 明确传入归一化图像坐标，不宣称获得地面米制位置。原项目员工活动规则只复用基础位移/静止部分，不用于评估员工生产力。

### Seeed-Projects/Lab-Prooject-RK

Apache-2.0。`audio/seeed_vad.py` 从 `services/voice-pipeline/src/realtime_pipeline.py` 提取 `StreamingVad` 类，补齐独立导入和常量；其状态机和 ONNX 推理逻辑保持原样。完整许可证位于 `third_party/SEEED-LICENSE`。原项目的 HTTP ASR 分离、turn 的 start/end/text/speaker 结构和 JSON 广播接口是本项目适配器设计参考；未运行 VoxEdge/CAM++ 或 RK 专用服务。WebSocket 由 FastAPI 提供，未复制其低层 socket broker。

## 仅研究参考，没有复制代码

- **Bristlenose / cassiocassio/bristlenose**：AGPL-3.0-only。检查了转录合并、原话提取、情感/意图模型、quote 聚类和 timecode 处理；借鉴“原文保留 → 分句/原话 → 证据 ID → 主题 → 研究结论”的研究流程。没有复制 AGPL 源码、提示词、模板或报告样式，也没有把自己的规则分析声称为原项目完整能力。
- **Store Intelligence / ranjitcj/store-intelligence**：所检出版本未发现独立许可证或明确许可声明。检查了 FastAPI ingest、事件 Schema、事件防重、VisitorSession、数据库与 metrics 服务；仅借鉴接口分层和 Session/Event 设计。没有复制或再分发其源码。

## 运行时依赖和下载资产

- Ultralytics / YOLO：Ultralytics 的开源代码及模型涉及 AGPL-3.0 与商业许可选项；请按其条款使用。项目提供源码和来源记录，不声明整套依赖均可按 MIT 商业闭源使用。
- SenseVoice：官方 FunAudioLLM/SenseVoice 模型，经 k2-fsa/sherpa-onnx 官方发布的 INT8 ONNX 包。包中 LICENSE 指向 FunASR 模型许可说明；请查看原模型条款。模型包保留自身文件，未把权重重新许可或提交 Git。
- Sherpa-ONNX：Apache-2.0，作为 CPU ASR/TTS 推理库。
- Silero VAD v5.1.2：MIT；从官方固定 tag 下载模型。
- MeloTTS：MyShell.ai / MeloTTS，官方转换包自带 MIT LICENSE；用于生成合成示例，不是消费者录音。
- bus.jpg：来自 Ultralytics 官方 assets，仅用于模型验证。未称为 Crest C3 产品素材。图片保留在本地下载缓存，不嵌入 Git。

下载脚本保留 HTTPS/TLS 校验，并固定实际检索资产的 SHA-256；这用于重复安装的内容完整性，不是对发布者身份的额外数字签名声明。

## HUBONE UI 品牌与字体

`frontend/assets/hubone-*.svg` 来自用户提供的《HUB ONE VIS.pdf》第 5 页原始矢量路径，用于其 HUBONE 品牌界面，品牌权益归原权利人所有。标准组合、比例和图形保持原样。

Roboto 可变字体来自 Google Fonts 官方 `ofl/roboto` 包，随资源保留 `frontend/assets/ROBOTO-OFL.txt`。中文使用 VIS 所列思源黑体系列的系统字体栈及系统回退，没有分发商业字体。

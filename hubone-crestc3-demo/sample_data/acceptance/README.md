# V0.1 真实媒体验收资料

这些文件是 **REAL_RECORDING_REFERENCE**，不是 SIMULATED，也不是 Crest C3 消费者实测资料。

先运行项目的模型下载脚本，再执行：

```bash
python scripts/prepare_acceptance_media.py
```

- `real-video.mp4`：Seeed 原仓库实际摄像录像，取前 8 秒、转为 H.264 / 15fps / 360×640；只裁剪和转码，没有合成动作或替换画面。
- `real-speech.wav`：sherpa-onnx 官方 SenseVoice 模型包附带的 `test_wavs/zh.wav`，真人中文语音，5.592 秒；没有使用本项目的 TTS 或文字 sidecar。
- `manifest.json`：原始地址、固定提交、原视频 SHA-256、当前输出的 SHA-256、独立采集说明。原视频 checksum 与上游 README 记录一致。

视频和音频不是同一次采集。验收时使用视频偏移 2.5 秒、音频偏移 1.25 秒，**只检查文件时间换算、同 Session 入库及时间邻近关联**，不声称两份资料原本同步或来自同一个人。

在当前模型中，WAV 实际转录为“开放时间早上9点至下午5点。”。这不是 Crest C3 产品反馈，不能据此证明腰带、助力或重量问题。

上传 API 根据本机 manifest 中的文件 hash 标记已知参考资料；未知文件仍为 USER_PROVIDED，不自动宣称是真实录制。模型推理、规则推断另由 `processing_method` 标明。

二进制文件和生成 manifest 已忽略，不进入 Git。素材保留原来源及其许可条件，仅供本地验收，不声明你拥有原视频的人物或产品素材权益。

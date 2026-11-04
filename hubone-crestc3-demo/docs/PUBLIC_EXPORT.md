# GitHub 源码发布范围

`main` 提供可本地运行的 Hub One/Crest C3 应用源码、统一 LLM Provider、决策报告引擎、测试与 Windows 操作说明，以及已经构建的 2D/3D 空间数据和前端。`gh-pages` 提供静态交互网页。

本次公开发布不包含原始 DXF/PDF、无损 DXF tags/INSERT 属性、运行数据库、上传目录、API Key 或模型权重。工作区中的原文件保持不变。空间 XY、XYZ、对象 ID、CAD 图层/句柄、二维 SVG 和预构建三维模型继续保留；未知高度和运营演示仍明确 SIMULATED。

公开的 `floor_1.json`、`floor_2.json` 标记 `publication_scope=VIEWER_GEOMETRY_ONLY`；原始 CAD 实体字典仅保留类型、句柄与图层摘要。这些文件足以运行既有地图和后端 API，**不作为无损 CAD 归档或重建源**。若要重新解析原图或重新构建模型，需由资料持有者在本机恢复原 DXF/PDF并运行解析器；不要把缺失的源属性推测补齐。

测试中 5 个需要私有原图/无损实体属性的参数化用例，在公开数据包中明确跳过；应用、决策研究、空间 API 和预构建模型测试继续执行。工作区的完整源数据验收结果与公开包验收结果分别记录，不能将跳过项算作通过。

`sample_data/video.mp4` 和 `audio.wav` 是明确 SIMULATED 的照片测试视频与 TTS 音频，配有来源清单；不是消费者实录。Mock 演示不会运行识别或语言模型。

运行：见 [Windows 操作](WINDOWS_EVIDENCE_TO_DECISION.md)。启动后端后运行 `python scripts/accept_decision.py` 可重新生成 Mock 报告和事件快照，再执行：

```bash
python scripts/build_space_preview.py --replay-source artifacts/decision --runtime-root runtime
```

如果后端配置了其他 `HUBONE_DATA_DIR`，将 `--runtime-root` 指向该目录。构建过程只读取已保存的模拟记录，不调用模型。原始资料和运行目录无需上传 GitHub。

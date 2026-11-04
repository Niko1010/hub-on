# V0.2 实际 API 响应

由 `scripts/export_space_examples.py --base-url http://127.0.0.1:8013` 从本地验收服务导出。

- `spaces.json` / `floors.json`：真实 CAD 建筑与楼层元数据；层高、标高和配准仍未测量。
- `zones-not-connected.json` / `cameras-not-connected.json`：尚未提供真实区域/设备清单。
- `cameras-simulated-floor-1.json`：明确 SIMULATED 的可选测试位置，非安装点。
- `events.json`：默认不包含模拟数据，未显式绑定空间的 C3 事件不会出现在此。
- `openapi.json`：包含 Space Intelligence 与既有 Crest C3 API 的实际 OpenAPI schema。

该目录不内嵌全部几何。完整 JSON/SVG 在 `space_intelligence/data/`，由 geometry / map.svg 接口独立提供。

# 在你的 Windows 电脑打开 Demo

当前研究报告升级的操作顺序见 [Evidence-to-Decision 本地说明](docs/WINDOWS_EVIDENCE_TO_DECISION.md)：先运行明确标记的 Mock 软件演示，回家后再配置本机 Ollama 和实体设备。云端本轮未验证真实 Ollama 或 RTX 5070。

`127.0.0.1` 是“当前这台电脑”，不是云服务器。如果尚未在 Windows 启动服务，浏览器会显示“拒绝连接”。

1. **先把 ZIP 全部解压**，不要在压缩包里直接运行。建议路径：`D:\Projects\hubone-crestc3-demo`。
2. 安装 Python 3.12 x64（包含 py launcher）和 ffmpeg。ffmpeg 可以在终端执行 `winget install --id Gyan.FFmpeg -e` 安装；安装后新开窗口。
3. 首次双击 **INSTALL_WINDOWS.cmd**，等待依赖与官方模型下载完成。看到 `Setup completed` 后再继续；失败窗口会保留真实错误。
4. 双击 **START_WINDOWS.cmd**。它会启动后端，确认健康接口和项目身份后才打开浏览器。**保持这个终端窗口开着。**
5. 浏览器打开的是本机 `http://127.0.0.1:8000`。看到 Dashboard 后，点击“运行完整演示 SIMULATED”，或新建 Session 上传资料。

若 8000 被其他程序占用，在项目目录的终端执行 `START_WINDOWS.cmd --port 8001`。如果自己的 Demo 已经运行，启动入口会打开现有服务，不会再启动或关闭另一份实例。

本包包含项目源码、示例媒体与来源清单；不包含 Linux 虚拟环境、任何密钥或云端用户数据。首次需要联网下载 Python 依赖和模型。双击脚本只能在 Windows 执行；共享 Python 启动逻辑已在云端验证，Windows 实机仍需本地执行确认。

如果仍失败，请保留终端窗口，查看上方第一条错误；不要只重复刷新浏览器。详细安装、RTX 5070 和 Ollama 配置见 [Windows 部署说明](docs/WINDOWS_DEPLOYMENT_V0.1.md)。

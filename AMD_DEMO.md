# Hub One AMD Demo — 2026-11-09

Frozen branch: `demo/amd-2026-11-09`. Independent snapshot of Integrated Demo 1.3, Vision Intelligence 1.1, Experience Intelligence 1.2, DeepSeek/Ollama/Anthropic adapters and ACL study workflow. Does not merge or change development branches.

## Public replay
Run START_AMD_OFFLINE.cmd with Python installed. Browser: http://127.0.0.1:8016/demos/etd-1-1-20261104/?mode=replay#space
Uses the existing SIMULATED / REPLAY Crest C3 records and spatial overlays. Static hosting cannot run FastAPI, CUDA, RTSP or a cloud model. Real data is never relabeled as simulated or embedded in the public repository.

## Full local backend
PowerShell: `./START_AMD_WINDOWS.ps1 -Python "path/to/compatible/python.exe"`
Use a compatible preinstalled environment, or create an isolated .venv and install hubone-crestc3-demo/requirements.txt before going offline. CPU and CUDA baseline scripts are preserved. No dependencies are upgraded by these launchers.
Open http://127.0.0.1:8006/integrated/?mode=live#experience . Backend runtime is an independent ignored .amd-local/runtime directory. ACL workflow can be opened with study=acl; private Sessions are deliberately absent from a fresh public installation. The existing video, observation, review and report API implementations are retained.

Configure DEEPSEEK_API_KEY and optional camera credentials in a local ignored hubone-crestc3-demo/.env.local or environment. Never put credentials in a URL or public frontend. Credentials, model weights and real recordings are not distributed. Cloud inference and live capture need authorized local configuration/connectivity; an offline replay does not claim they are running.

## Deployment boundary
Existing GitHub Pages is unchanged. This branch is not configured to replace it. A static commit-addressed preview may be used separately; full backend hosting needs a separately provisioned server and private configuration. Reachability from a corporate network must be tested on that computer; local success cannot establish company firewall access.

## Sources and privacy
Public demo: explicitly SIMULATED / REPLAY. Live service: LIVE only while capture is active. Uploaded real media: REAL_RECORDING. Unconnected capabilities remain NOT CONNECTED.
No .env.local, API tokens, RTSP passwords, household frames/videos, personal ACL quotes or SQLite database is included. Private original research stays in the original Windows workspace. Original CAD and UI geometry assets are copied without regeneration.

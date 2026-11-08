param(
    [int]$Port = 8002,
    [string]$ProjectRoot = 'D:\Projects\hub-on\hubone-crestc3-demo',
    [string]$IntegratedDirectory = 'D:\codex\2026-11-07\hub-one-d-projects-hub-on\work\hub-on-integrated-1.2\demos\etd-1-1-20261104'
)
$ErrorActionPreference='Stop'
if (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) { throw "Port $Port is occupied. Existing services were not stopped." }
# The RTSP adapter reads project-local .env.local directly. This launcher never
# reads, echoes or puts credentials into process command-line arguments.
if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot '.env.local'))) { throw 'Missing project-local .env.local configuration file.' }
$env:HUBONE_INTEGRATED_DEMO_DIR=$IntegratedDirectory
$env:PYTHONUTF8='1'
$env:PYTHONDONTWRITEBYTECODE='1'
$env:PYTHONUNBUFFERED='1'
# Existing runtime data and SQL store are reused; no database/schema replacement.
$logs=Join-Path $env:LOCALAPPDATA 'HubOne\live-logs'
New-Item -ItemType Directory -Path $logs -Force | Out-Null
$stamp=Get-Date -Format 'yyyyMMdd-HHmmss'
$service=Start-Process -FilePath (Join-Path $ProjectRoot '.venv\Scripts\python.exe') -ArgumentList @('-B','-X','utf8','-m','uvicorn','backend.main:app','--host','127.0.0.1','--port',"$Port",'--no-access-log') -WorkingDirectory $ProjectRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logs "$stamp.out.log") -RedirectStandardError (Join-Path $logs "$stamp.err.log")
Write-Output "Local service PID $($service.Id). Open http://127.0.0.1:$Port/integrated/?mode=live#live"
Write-Output 'Camera capture begins only after pressing Start in the page. Fill .env.local locally first.'

param(
    [int]$Port = 8003,
    [ValidateSet('auto','cpu','cuda')][string]$Device = 'auto',
    [double]$SampleFps = 0,
    [string]$ProjectRoot = 'D:\Projects\hub-on\hubone-crestc3-demo',
    [string]$GpuEnvironment = 'D:\codex\2026-11-08\hub-one-vision-1.1\env-gpu',
    [string]$IntegratedDirectory = 'D:\codex\2026-11-07\hub-one-d-projects-hub-on\work\hub-on-integrated-1.2\demos\etd-1-1-20261104'
)
$ErrorActionPreference='Stop'
if (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) { throw "Port $Port is occupied; existing service retained." }
$gpuPython=Join-Path $GpuEnvironment 'Scripts\python.exe'
$useGpuEnvironment=$Device -ne 'cpu' -and (Test-Path -LiteralPath $gpuPython)
if ($Device -eq 'cuda' -and -not $useGpuEnvironment) { throw 'Independent CUDA environment is missing. Use -Device cpu for the preserved CPU environment.' }
if ($useGpuEnvironment) {
    if (-not (Test-Path -LiteralPath (Join-Path $GpuEnvironment 'config\app.yaml'))) { throw 'Missing isolated RetailVision GPU budget configuration.' }
    $pythonExecutable=$gpuPython
    $env:RETAILVISION_ROOT=$GpuEnvironment
    $env:YOLO_CONFIG_DIR=Join-Path $GpuEnvironment 'yolo-config'
    $env:CUDA_CACHE_PATH=Join-Path $GpuEnvironment 'cuda-cache'
} else { $pythonExecutable=Join-Path $ProjectRoot '.venv\Scripts\python.exe' }
if ($SampleFps -eq 0) { $SampleFps=if ($useGpuEnvironment) { 5 } else { 2 } }
if ($SampleFps -lt 0.2 -or $SampleFps -gt 10) { throw 'SampleFps must be between 0.2 and 10.' }
$env:VISION_DEVICE=$Device
$env:HUBONE_LIVE_SAMPLE_FPS=$SampleFps.ToString([Globalization.CultureInfo]::InvariantCulture)
$env:CPU_THREADS='2'
$env:HUBONE_INTEGRATED_DEMO_DIR=$IntegratedDirectory
$env:PYTHONUTF8='1'
$env:PYTHONDONTWRITEBYTECODE='1'
$env:PYTHONUNBUFFERED='1'
$logs=Join-Path $env:LOCALAPPDATA 'HubOne\live-logs'
New-Item -ItemType Directory -Path $logs -Force | Out-Null
$stamp=Get-Date -Format 'yyyyMMdd-HHmmss'
# Only the RTSP adapter reads project-local credentials. Nothing is passed in arguments.
$service=Start-Process -FilePath $pythonExecutable -ArgumentList @('-B','-X','utf8','-m','uvicorn','backend.main:app','--host','127.0.0.1','--port',"$Port",'--no-access-log') -WorkingDirectory $ProjectRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logs "$stamp-vision11.out.log") -RedirectStandardError (Join-Path $logs "$stamp-vision11.err.log")
Write-Output "Vision 1.1 service PID $($service.Id); requested device $Device; sample cap $SampleFps FPS."
Write-Output "Open http://127.0.0.1:$Port/integrated/?mode=live#live"
Write-Output 'Start capture in the existing page. Actual device and fallback are recorded after real inference.'

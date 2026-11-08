param([int]$Port=8006,[string]$Python="")
$ErrorActionPreference='Stop'
$amdRoot=$PSScriptRoot
if(!$Python){$Python=Join-Path $amdRoot 'hubone-crestc3-demo\.venv\Scripts\python.exe'}
if(!(Test-Path -LiteralPath $Python)){throw 'Specify -Python with an installed compatible Python environment. See AMD_DEMO.md.'}
if(Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue){throw 'Port occupied; existing service retained.'}
$env:HUBONE_INTEGRATED_DEMO_DIR=Join-Path $amdRoot 'demos\etd-1-1-20261104'
$env:HUBONE_DATA_DIR=Join-Path $amdRoot '.amd-local\runtime'
$env:PYTHONDONTWRITEBYTECODE='1'
Write-Output "AMD demo: http://127.0.0.1:$Port/integrated/?mode=replay#space"
Push-Location (Join-Path $amdRoot 'hubone-crestc3-demo')
try { & $Python -B -m uvicorn backend.main:app --host 127.0.0.1 --port $Port --no-access-log } finally { Pop-Location }

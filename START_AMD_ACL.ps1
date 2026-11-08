param([Parameter(Mandatory=$true)][string]$PrivateRoot,[string]$Python='python',[int]$Port=8008)
$ErrorActionPreference='Stop'
if(Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue){throw 'Port occupied; existing service retained.'}
& $Python -B (Join-Path $PSScriptRoot 'RUN_AMD_ACL.py') --private-root $PrivateRoot --port $Port

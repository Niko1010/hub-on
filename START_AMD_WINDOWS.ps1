param([Parameter(Mandatory=$true)][string]$PrivateRoot,[string]$Python='python',[int]$Port=8008)
& (Join-Path $PSScriptRoot 'START_AMD_ACL.ps1') -PrivateRoot $PrivateRoot -Python $Python -Port $Port
#Requires -Version 5.1
[CmdletBinding()]
param(
    [string]$ProjectRoot = 'D:\Projects\hub-on\hubone-crestc3-demo',
    [ValidateRange(1,65535)][int]$RtspPort = 554
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

# Windows DPAPI encrypts the entire payload, including username and password.
# Only this Windows account on this computer can decrypt the saved file.
function Protect-RtspPayload([string]$Json) {
    $secure = ConvertTo-SecureString -String $Json -AsPlainText -Force
    try { return ConvertFrom-SecureString -SecureString $secure }
    finally { $secure.Dispose() }
}
function Read-RtspPayload([string]$Path) {
    $secure = ConvertTo-SecureString -String (Get-Content -LiteralPath $Path -Raw)
    $pointer = [IntPtr]::Zero
    try {
        $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
        return ([Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer) | ConvertFrom-Json)
    } finally {
        if ($pointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
        $secure.Dispose()
    }
}

$project = (Resolve-Path -LiteralPath $ProjectRoot).Path
$directory = Join-Path $project '.local\rtsp'
$destination = Join-Path $directory 'camera.dpapi'
& git -C $project check-ignore -q -- '.local/rtsp/camera.dpapi'
if ($LASTEXITCODE -ne 0) { throw 'Configuration directory is not ignored by Git. No credentials were saved.' }

$previous = $null
$credential = $null
$payload = $null
$json = $null
$defaultHost = '192.168.1.108'
try {
    if (Test-Path -LiteralPath $destination) {
        try { $previous = Read-RtspPayload $destination }
        catch { throw 'Existing configuration cannot be decrypted by this Windows account. It has not been changed.' }
        $defaultHost = [string]$previous.host
        if (-not $PSBoundParameters.ContainsKey('RtspPort')) { $RtspPort = [int]$previous.port }
    }
    $cameraHost = Read-Host "Camera IPv4 address [Enter keeps $defaultHost]"
    if ([string]::IsNullOrWhiteSpace($cameraHost)) { $cameraHost = $defaultHost }
    $parsedIp = $null
    if (-not [Net.IPAddress]::TryParse($cameraHost, [ref]$parsedIp) -or $parsedIp.AddressFamily -ne [Net.Sockets.AddressFamily]::InterNetwork) {
        throw 'A valid IPv4 address is required. Configuration has not been changed.'
    }
    $credential = Get-Credential -Message 'Enter camera RTSP username and password. Saved locally with Windows DPAPI.'
    if (-not $credential -or [string]::IsNullOrWhiteSpace($credential.UserName) -or $credential.Password.Length -eq 0) {
        throw 'Credential entry cancelled or incomplete. Configuration has not been changed.'
    }
    $payload = [ordered]@{
        version = 1
        host = $cameraHost
        port = $RtspPort
        path = '/cam/realmonitor?channel=1&subtype=1'
        username = $credential.UserName
        password = $credential.GetNetworkCredential().Password
    }
    $json = $payload | ConvertTo-Json -Compress
    $encrypted = Protect-RtspPayload $json
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent().User
    $acl = New-Object Security.AccessControl.DirectorySecurity
    $acl.SetOwner($identity)
    $acl.SetAccessRuleProtection($true,$false)
    $rule = New-Object Security.AccessControl.FileSystemAccessRule($identity,'FullControl','ContainerInherit,ObjectInherit','None','Allow')
    $acl.AddAccessRule($rule)
    Set-Acl -LiteralPath $directory -AclObject $acl
    # Both paths are fixed children of the dedicated project-local directory.
    $temporary = Join-Path $directory 'camera.dpapi.new'
    [IO.File]::WriteAllText($temporary, $encrypted, [Text.Encoding]::ASCII)
    Move-Item -LiteralPath $temporary -Destination $destination -Force
    Write-Output "Encrypted configuration saved: $destination"
    Write-Output 'No service or camera was started. Run this script again to update the IP or credentials.'
} finally {
    $previous = $null
    $payload = $null
    $json = $null
    if ($credential) { $credential.Password.Dispose() }
    $credential = $null
}

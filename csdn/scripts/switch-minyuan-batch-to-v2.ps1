# Wait for current v1 book, stop batch, restart with v2
param(
  [string]$WaitSlug = 'rb',
  [int]$PollSeconds = 8
)

$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$logDir = Join-Path $root 'books\_work'
$logFile = Join-Path $logDir 'switch-to-v2.log'
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

function Log($msg) {
  $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg"
  Add-Content -Path $logFile -Value $line -Encoding utf8
  Write-Host $line
}

function Get-MinyuanChild([string]$slug) {
  $pattern = "/txt/$slug/"
  Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
    Where-Object {
      $_.CommandLine -match 'download-minyuan-book\.js' -and
      $_.CommandLine -notmatch 'download-minyuan-book-v2\.js' -and
      $_.CommandLine -like "*$pattern*"
    }
}

function Get-MinyuanBatch() {
  Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -match 'batch-download-minyuan-home\.js' }
}

Log "watching m_$WaitSlug v1 download..."

while ($true) {
  $child = Get-MinyuanChild $WaitSlug
  if (-not $child) {
    Log "m_$WaitSlug finished."
    break
  }
  $childPid = $child.ProcessId
  Log "still downloading m_$WaitSlug PID $childPid, poll in ${PollSeconds}s"
  Start-Sleep -Seconds $PollSeconds
}

$batch = Get-MinyuanBatch
if ($batch) {
  foreach ($p in $batch) {
    Log "stop v1 batch PID $($p.ProcessId)"
    Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
  }
  Start-Sleep -Seconds 2
}

Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
  Where-Object {
    $_.CommandLine -match 'download-minyuan-book\.js' -and
    $_.CommandLine -notmatch 'download-minyuan-book-v2\.js'
  } |
  ForEach-Object {
    Log "stop leftover v1 child PID $($_.ProcessId)"
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }

$batchLog = Join-Path $logDir 'batch-minyuan-home.log'
$batchScript = Join-Path $PSScriptRoot 'batch-download-minyuan-home.js'
Log "start v2 batch: $batchScript"

$cmd = "node `"$batchScript`" 2>&1 | Tee-Object -FilePath `"$batchLog`" -Append"
Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoProfile', '-Command', $cmd) -WorkingDirectory $root -WindowStyle Hidden
Log "v2 batch started, log: $batchLog"

$targetDir = "$env:LOCALAPPDATA\Programs\Git"
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
}
$zipPath = "$targetDir\mingit.zip"
Write-Host "Downloading MinGit..."
curl.exe -L -o $zipPath "https://github.com/git-for-windows/git/releases/download/v2.47.1.windows.1/MinGit-2.47.1-64-bit.zip"
Write-Host "Extracting MinGit..."
tar.exe -xf $zipPath -C $targetDir
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}
$gitCmd = "$targetDir\cmd\git.exe"
if (Test-Path $gitCmd) {
    Write-Host "MinGit successfully installed at: $gitCmd"
    & $gitCmd --version
} else {
    Write-Host "Extraction check failed"
}

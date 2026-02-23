param(
    [string]$CommitMessage = ""
)

$ErrorActionPreference = "Stop"

function Get-PagesBaseUrl {
    param(
        [Parameter(Mandatory = $true)]
        [string]$RemoteUrl
    )

    # Supports:
    # - https://github.com/owner/repo.git
    # - git@github.com:owner/repo.git
    $pattern = "github\.com[/:](?<owner>[^/]+)/(?<repo>[^/.]+)(\.git)?$"
    $match = [regex]::Match($RemoteUrl.Trim(), $pattern)
    if (-not $match.Success) {
        return $null
    }

    $owner = $match.Groups["owner"].Value
    $repo = $match.Groups["repo"].Value
    return "https://$owner.github.io/$repo/"
}

function Convert-ToUrlPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$RelativePath
    )

    if ([string]::IsNullOrWhiteSpace($RelativePath)) {
        return ""
    }

    $segments = $RelativePath -split "[/\\]+" | Where-Object { $_ -ne "" }
    $encoded = $segments | ForEach-Object { [System.Uri]::EscapeDataString($_) }
    return (($encoded -join "/").Trim("/") + "/")
}

function Invoke-CommandChecked {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Executable,
        [string[]]$Arguments = @()
    )

    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed: $Executable $($Arguments -join ' ')"
    }
}

try {
    Invoke-CommandChecked -Executable "git" -Arguments @("rev-parse", "--is-inside-work-tree") | Out-Null
}
catch {
    Write-Error "This script must be run inside a git repository."
    exit 1
}

$changes = (& git status --porcelain)
if (-not $changes) {
    Write-Host "No changes found. Nothing to deploy."
    exit 0
}

$changedPaths = @()
foreach ($line in $changes) {
    if ($line.Length -lt 4) {
        continue
    }

    $pathPart = $line.Substring(3).Trim()
    if ($pathPart -like "* -> *") {
        $pathPart = ($pathPart -split " -> ")[-1].Trim()
    }

    if (-not [string]::IsNullOrWhiteSpace($pathPart)) {
        $changedPaths += $pathPart
    }
}

if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $CommitMessage = "deploy: auto update $timestamp"
}

Write-Host "Staging all changes..."
Invoke-CommandChecked -Executable "git" -Arguments @("add", "-A")

Write-Host "Creating commit..."
Invoke-CommandChecked -Executable "git" -Arguments @("commit", "-m", $CommitMessage)

Write-Host "Pushing to remote..."
Invoke-CommandChecked -Executable "git" -Arguments @("push")

Write-Host "Deploy pipeline triggered successfully."

$remoteUrl = (& git remote get-url origin).Trim()
$baseUrl = Get-PagesBaseUrl -RemoteUrl $remoteUrl

if ($baseUrl) {
    $projectDirs = @{}
    foreach ($path in $changedPaths) {
        $dir = Split-Path -Path $path -Parent
        while ($true) {
            if ([string]::IsNullOrWhiteSpace($dir)) {
                break
            }

            $indexCandidate = Join-Path -Path $dir -ChildPath "index.html"
            if (Test-Path -Path $indexCandidate) {
                $projectDirs[$dir] = $true
                break
            }

            $parent = Split-Path -Path $dir -Parent
            if ($parent -eq $dir) {
                break
            }
            $dir = $parent
        }
    }

    Write-Host ""
    Write-Host "Site links:"
    Write-Host "  Root: $baseUrl"

    $projectLinks = @($projectDirs.Keys | Sort-Object)
    foreach ($projectDir in $projectLinks) {
        $urlPath = Convert-ToUrlPath -RelativePath $projectDir
        Write-Host "  $projectDir => $baseUrl$urlPath"
    }
}

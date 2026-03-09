param(
    [string]$CommitMessage = "",
    [string]$DeployDir = "",
    [switch]$RequireDeployDir
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

    if ([string]::IsNullOrWhiteSpace($RelativePath) -or $RelativePath -eq ".") {
        return ""
    }

    $segments = $RelativePath -split "[/\\]+" | Where-Object { $_ -ne "" -and $_ -ne "." }
    if ($segments.Count -eq 0) {
        return ""
    }

    if ($segments.Count -gt 0 -and $segments[0] -eq ".sass") {
        # Dot-prefixed folders are not published by GitHub Pages artifact upload.
        # We deploy ".sass" as public "sass" alias in Pages workflow.
        $segments[0] = "sass"
    }
    $encoded = $segments | ForEach-Object { [System.Uri]::EscapeDataString($_) }
    return (($encoded -join "/").Trim("/") + "/")
}

function Test-ProjectDirectory {
    param(
        [Parameter(Mandatory = $true)]
        [string]$DirPath
    )

    try {
        $indexFile = Get-ChildItem -LiteralPath $DirPath -File -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -ieq "index.html" } |
            Select-Object -First 1

        return ($null -ne $indexFile)
    }
    catch {
        return $false
    }
}

function Convert-ToRelativePath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$AbsolutePath
    )

    $workspaceRoot = (Get-Location).Path.TrimEnd("\")
    $absolute = [System.IO.Path]::GetFullPath($AbsolutePath).TrimEnd("\")
    if ($absolute.StartsWith($workspaceRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $absolute.Substring($workspaceRoot.Length).TrimStart("\")
    }
    return $null
}

function Convert-ToGitPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$RelativePath
    )

    if ([string]::IsNullOrWhiteSpace($RelativePath) -or $RelativePath -eq ".") {
        return "."
    }

    return $RelativePath.Replace('\', '/')
}

function Resolve-DeployProjectDir {
    param(
        [string]$InputPath
    )

    if ([string]::IsNullOrWhiteSpace($InputPath)) {
        return $null
    }

    try {
        $raw = $InputPath.Trim().Trim('"') -replace '/', '\'
        if (-not (Test-Path -LiteralPath $raw)) {
            return $null
        }

        $resolved = (Resolve-Path -LiteralPath $raw).Path
        if (Test-Path -LiteralPath $resolved -PathType Leaf) {
            $resolved = Split-Path -Path $resolved -Parent
        }

        $current = $resolved
        while (-not [string]::IsNullOrWhiteSpace($current)) {
            if (Test-ProjectDirectory -DirPath $current) {
                $relative = Convert-ToRelativePath -AbsolutePath $current
                if ([string]::IsNullOrWhiteSpace($relative)) {
                    return "."
                }
                return $relative
            }

            $parent = Split-Path -Path $current -Parent
            if ([string]::IsNullOrWhiteSpace($parent) -or $parent -eq $current) {
                break
            }
            $current = $parent
        }

        return $null
    }
    catch {
        return $null
    }
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

function Show-DeployLinks {
    param(
        [string]$RemoteUrl,
        [string[]]$ChangedPaths = @()
    )

    if ([string]::IsNullOrWhiteSpace($RemoteUrl)) {
        return
    }

    $baseUrl = Get-PagesBaseUrl -RemoteUrl $RemoteUrl

    if ($baseUrl) {
        try {
            $projectDirs = @{}
            foreach ($path in $ChangedPaths) {
                $dir = Split-Path -Path $path -Parent
                if ([string]::IsNullOrWhiteSpace($dir)) {
                    if (Test-ProjectDirectory -DirPath ".") {
                        $projectDirs["."] = $true
                    }
                    continue
                }

                while ($true) {
                    if ([string]::IsNullOrWhiteSpace($dir)) {
                        break
                    }

                    if (Test-ProjectDirectory -DirPath $dir) {
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
            if ($projectLinks.Count -eq 0) {
                $fallbackDir = $null

                $latestIndex = Get-ChildItem -Path "." -Recurse -File -ErrorAction SilentlyContinue |
                    Where-Object {
                        $_.Name -ieq "index.html" -and
                        $_.FullName -notmatch '[\\/]\.git[\\/]' -and
                        $_.FullName -notmatch '[\\/]\.github[\\/]' -and
                        $_.FullName -notmatch '[\\/]\.vscode[\\/]' -and
                        $_.FullName -notmatch '[\\/]node_modules[\\/]'
                    } |
                    Sort-Object -Property LastWriteTime -Descending |
                    Select-Object -First 1

                if ($latestIndex) {
                    $latestDir = Split-Path -Path $latestIndex.FullName -Parent
                    $fallbackDir = Convert-ToRelativePath -AbsolutePath $latestDir
                }

                if (-not [string]::IsNullOrWhiteSpace($fallbackDir)) {
                    $projectLinks = @($fallbackDir)
                }
            }

            foreach ($projectDir in $projectLinks) {
                if ($projectDir -eq ".") {
                    Write-Host "  . => $baseUrl"
                    continue
                }

                $urlPath = Convert-ToUrlPath -RelativePath $projectDir
                Write-Host "  $projectDir => $baseUrl$urlPath"
            }
        }
        catch {
            Write-Warning "Site links could not be generated: $($_.Exception.Message)"
        }
    }

    $repoMatch = [regex]::Match($RemoteUrl, "github\.com[/:](?<owner>[^/]+)/(?<repo>[^/.]+)(\.git)?$")
    if ($repoMatch.Success) {
        $owner = $repoMatch.Groups["owner"].Value
        $repo = $repoMatch.Groups["repo"].Value
        Write-Host ""
        Write-Host "Workflow links:"
        Write-Host "  Pages: https://github.com/$owner/$repo/actions/workflows/deploy-pages.yml"
    }
}

function Show-NoChangesDiagnostics {
    param(
        [Parameter(Mandatory = $true)]
        [string]$TargetProjectDir
    )

    $allChanges = @(& git status --porcelain)
    $allChanges = $allChanges | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    if ($allChanges.Count -gt 0) {
        Write-Host ""
        Write-Host "Working tree has changes, but not in selected folder:"
        $preview = @($allChanges | Select-Object -First 10)
        foreach ($line in $preview) {
            Write-Host "  $line"
        }

        if ($allChanges.Count -gt $preview.Count) {
            Write-Host "  ... and $($allChanges.Count - $preview.Count) more"
        }

        Write-Host "Tip: open a file inside '$TargetProjectDir' and rerun this task, or run deploy without -DeployDir."
        return
    }

    $targetProjectDirGit = Convert-ToGitPath -RelativePath $TargetProjectDir
    $ignoredInTarget = @(& git status --porcelain --ignored -- "$targetProjectDirGit")
    $ignoredInTarget = $ignoredInTarget | Where-Object { $_ -like "!! *" }
    if ($ignoredInTarget.Count -gt 0) {
        Write-Host ""
        Write-Host "Only ignored files changed in selected folder:"
        $preview = @($ignoredInTarget | Select-Object -First 10)
        foreach ($line in $preview) {
            Write-Host "  $line"
        }

        if ($ignoredInTarget.Count -gt $preview.Count) {
            Write-Host "  ... and $($ignoredInTarget.Count - $preview.Count) more"
        }

        Write-Host "Tip: remove or adjust .gitignore rules if these files should deploy."
        return
    }

    Write-Host "Git sees no saved file changes."
    Write-Host "Tip: save edited files and verify they are inside '$TargetProjectDir'."
}

try {
    Invoke-CommandChecked -Executable "git" -Arguments @("rev-parse", "--is-inside-work-tree") | Out-Null
}
catch {
    Write-Error "This script must be run inside a git repository."
    exit 1
}

$remoteUrl = (& git remote get-url origin 2>$null)
if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($remoteUrl)) {
    $remoteUrl = $remoteUrl.Trim()
}
else {
    $remoteUrl = ""
}

$changes = @(& git status --porcelain)
$changes = $changes | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }

$targetProjectDir = Resolve-DeployProjectDir -InputPath $DeployDir
$targetProjectDirGit = $null
if (-not [string]::IsNullOrWhiteSpace($targetProjectDir)) {
    $targetProjectDirGit = Convert-ToGitPath -RelativePath $targetProjectDir
}
if ($RequireDeployDir -and [string]::IsNullOrWhiteSpace($targetProjectDir)) {
    Write-Error "Current file folder is not deployable. Open a file inside a project folder that contains index.html."
    exit 1
}
if (-not [string]::IsNullOrWhiteSpace($DeployDir) -and [string]::IsNullOrWhiteSpace($targetProjectDir)) {
    Write-Error "DeployDir does not resolve to a folder containing index.html: $DeployDir"
    exit 1
}

if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $CommitMessage = "deploy: auto update $timestamp"
}

if (-not [string]::IsNullOrWhiteSpace($targetProjectDir)) {
    Write-Host "Deploy target folder: $targetProjectDir"
    Write-Host "Staging selected folder changes..."
    Invoke-CommandChecked -Executable "git" -Arguments @("add", "-A", "--", $targetProjectDirGit)

    $stagedChanges = @(& git diff --cached --name-only -- "$targetProjectDirGit")
    $stagedChanges = $stagedChanges | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    if ($stagedChanges.Count -eq 0) {
        Write-Host "No changes found in selected folder. Nothing to deploy."
        Show-NoChangesDiagnostics -TargetProjectDir $targetProjectDir
        $linkHint = if ($targetProjectDir -eq ".") { "index.html" } else { Join-Path -Path $targetProjectDir -ChildPath "index.html" }
        Show-DeployLinks -RemoteUrl $remoteUrl -ChangedPaths @($linkHint)
        exit 0
    }
}
else {
    if ($changes.Count -eq 0) {
        Write-Host "No changes found. Nothing to deploy."
        Show-DeployLinks -RemoteUrl $remoteUrl
        exit 0
    }

    Write-Host "Staging all changes..."
    Invoke-CommandChecked -Executable "git" -Arguments @("add", "-A")
}

Write-Host "Creating commit..."
Invoke-CommandChecked -Executable "git" -Arguments @("commit", "-m", $CommitMessage)

$createdCommit = (& git rev-parse HEAD).Trim()
$changedPaths = @(& git diff-tree --no-commit-id --name-only -r --root $createdCommit)
$changedPaths = $changedPaths | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }

Write-Host "Pushing to remote..."
Invoke-CommandChecked -Executable "git" -Arguments @("push")

Write-Host "Deploy pipeline triggered successfully."
Show-DeployLinks -RemoteUrl $remoteUrl -ChangedPaths $changedPaths

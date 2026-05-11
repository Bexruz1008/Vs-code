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

function Get-WorkflowUrl {
    param(
        [string]$RemoteUrl
    )

    if ([string]::IsNullOrWhiteSpace($RemoteUrl)) {
        return $null
    }

    $repoMatch = [regex]::Match($RemoteUrl, "github\.com[/:](?<owner>[^/]+)/(?<repo>[^/.]+)(\.git)?$")
    if (-not $repoMatch.Success) {
        return $null
    }

    $owner = $repoMatch.Groups["owner"].Value
    $repo = $repoMatch.Groups["repo"].Value
    return "https://github.com/$owner/$repo/actions/workflows/deploy-pages.yml"
}

function Get-RedeployCommitMessage {
    param(
        [string]$ProjectDir = ""
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    if ([string]::IsNullOrWhiteSpace($ProjectDir) -or $ProjectDir -eq ".") {
        return "deploy: retry pages $timestamp"
    }

    $normalizedDir = $ProjectDir.Replace('\', '/')
    return "deploy: retry $normalizedDir $timestamp"
}

function Get-DeployProjectDirs {
    param(
        [string[]]$ChangedPaths = @()
    )

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

    $projectLinks = @($projectDirs.Keys | Sort-Object)
    if ($projectLinks.Count -gt 0) {
        return $projectLinks
    }

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
        return @($fallbackDir)
    }

    return @()
}

function Get-DeployTargets {
    param(
        [string]$RemoteUrl,
        [string[]]$ChangedPaths = @()
    )

    if ([string]::IsNullOrWhiteSpace($RemoteUrl)) {
        return @()
    }

    $baseUrl = Get-PagesBaseUrl -RemoteUrl $RemoteUrl
    if ([string]::IsNullOrWhiteSpace($baseUrl)) {
        return @()
    }

    $targets = New-Object System.Collections.Generic.List[object]
    $targets.Add([PSCustomObject]@{
            Label        = "Root"
            ProjectDir   = "."
            Url          = $baseUrl
            WaitForReady = $false
        })

    foreach ($projectDir in (Get-DeployProjectDirs -ChangedPaths $ChangedPaths)) {
        $url = $baseUrl
        if ($projectDir -ne ".") {
            $urlPath = Convert-ToUrlPath -RelativePath $projectDir
            $url = "$baseUrl$urlPath"
        }

        $targets.Add([PSCustomObject]@{
                Label        = $projectDir
                ProjectDir   = $projectDir
                Url          = $url
                WaitForReady = $true
            })
    }

    return $targets.ToArray()
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

function Compile-SassIfNeeded {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ProjectDir
    )

    $compiledCss = @()
    $sassFiles = @(Get-ChildItem -LiteralPath $ProjectDir -Recurse -File -Filter "*.scss" -ErrorAction SilentlyContinue |
        Where-Object {
            $_.Name -notlike "_*" -and
            $_.FullName -notmatch '[\\/](node_modules|\.git|\.github|\.vscode)[\\/]'
        })

    if ($sassFiles.Count -eq 0) {
        return $compiledCss
    }

    $sassCmd = Get-Command -Name "sass" -ErrorAction SilentlyContinue
    if (-not $sassCmd) {
        Write-Error "Sass CLI not found. Install sass or run the 'Sass: Watch workspace' task before deploy."
        exit 1
    }

    foreach ($scss in $sassFiles) {
        $cssPath = [System.IO.Path]::ChangeExtension($scss.FullName, ".css")
        Write-Host "Compiling Sass: $($scss.FullName) -> $cssPath"
        Invoke-CommandChecked -Executable "sass" -Arguments @($scss.FullName, $cssPath)
        $compiledCss += $cssPath
    }

    return $compiledCss
}

function Update-CacheBusters {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ProjectDir,
        [string[]]$CssPaths = @()
    )

    if ($CssPaths.Count -eq 0) {
        return
    }

    $indexPath = Join-Path -Path $ProjectDir -ChildPath "index.html"
    if (-not (Test-Path -LiteralPath $indexPath)) {
        return
    }

    $content = Get-Content -LiteralPath $indexPath -Raw
    if ([string]::IsNullOrWhiteSpace($content)) {
        return
    }

    $updated = $false
    foreach ($cssPath in $CssPaths) {
        if (-not (Test-Path -LiteralPath $cssPath)) {
            continue
        }

        $cssFile = [System.IO.Path]::GetFileName($cssPath)
        $hash = (Get-FileHash -Algorithm SHA1 -LiteralPath $cssPath).Hash.Substring(0, 8).ToLowerInvariant()
        $pattern = [regex]::Escape($cssFile) + '(?!\.)' + '(\?v=[^"''\s>]*)?'
        $replacement = "${cssFile}?v=$hash"
        $newContent = [regex]::Replace($content, $pattern, $replacement)
        if ($newContent -ne $content) {
            $content = $newContent
            $updated = $true
        }
    }

    if ($updated) {
        Write-Host "Updating cache busters in $indexPath"
        Set-Content -LiteralPath $indexPath -Value $content -Encoding UTF8
    }
}

function Get-BranchSyncState {
    $result = [PSCustomObject]@{
        HasUpstream = $false
        Upstream = ""
        Ahead = 0
        Behind = 0
    }

    $upstreamRaw = (& git rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2>$null)
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($upstreamRaw)) {
        return $result
    }

    $upstream = $upstreamRaw.Trim()
    $countsRaw = (& git rev-list --left-right --count "HEAD...$upstream" 2>$null)
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($countsRaw)) {
        return $result
    }

    $parts = $countsRaw.Trim() -split "\s+"
    if ($parts.Count -lt 2) {
        return $result
    }

    $ahead = 0
    $behind = 0
    if (-not [int]::TryParse($parts[0], [ref]$ahead)) {
        $ahead = 0
    }
    if (-not [int]::TryParse($parts[1], [ref]$behind)) {
        $behind = 0
    }

    return [PSCustomObject]@{
        HasUpstream = $true
        Upstream = $upstream
        Ahead = $ahead
        Behind = $behind
    }
}

function Get-DeployUrlStatus {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Url
    )

    $result = [PSCustomObject]@{
        Url          = $Url
        Reachable    = $false
        Ready        = $false
        StatusCode   = $null
        ErrorMessage = ""
    }

    try {
        $response = Invoke-WebRequest -Uri $Url `
            -Headers @{
                "Cache-Control" = "no-cache"
                "Pragma"        = "no-cache"
            } `
            -MaximumRedirection 5 `
            -TimeoutSec 15 `
            -ErrorAction Stop

        if ($null -eq $response) {
            return $result
        }

        $result.Reachable = $true
        $statusCode = [int]$response.StatusCode
        $result.StatusCode = $statusCode
        if ($statusCode -lt 200 -or $statusCode -ge 400) {
            return $result
        }

        $content = ""
        if ($null -ne $response.Content) {
            $content = [string]$response.Content
        }

        if ($content -match '(?i)<title>\s*404\s*</title>' -or
            $content -match '(?i)file not found' -or
            $content -match '(?i)there isn''t a github pages site here') {
            return $result
        }

        $result.Ready = $true
        return $result
    }
    catch {
        $result.ErrorMessage = $_.Exception.Message

        $response = $null
        if ($_.Exception.PSObject.Properties.Name -contains "Response") {
            $response = $_.Exception.Response
        }

        if ($null -ne $response) {
            $result.Reachable = $true
            try {
                $result.StatusCode = [int]$response.StatusCode
            }
            catch {
            }
        }

        return $result
    }
}

function Test-DeployUrlReady {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Url
    )

    return (Get-DeployUrlStatus -Url $Url).Ready
}

function Get-UnreadyDeployTargets {
    param(
        [object[]]$Targets = @()
    )

    $statuses = New-Object System.Collections.Generic.List[object]
    foreach ($target in ($Targets | Where-Object { $_.WaitForReady })) {
        $urlStatus = Get-DeployUrlStatus -Url $target.Url
        if (-not $urlStatus.Ready) {
            $statuses.Add([PSCustomObject]@{
                    Target       = $target
                    Reachable    = $urlStatus.Reachable
                    StatusCode   = $urlStatus.StatusCode
                    ErrorMessage = $urlStatus.ErrorMessage
                })
        }
    }

    return $statuses.ToArray()
}

function Try-RedeployUnavailableSite {
    param(
        [object[]]$Targets = @(),
        [string]$RemoteUrl = "",
        [string]$ProjectDir = ""
    )

    $unreadyStatuses = @(Get-UnreadyDeployTargets -Targets $Targets)
    if ($unreadyStatuses.Count -eq 0) {
        return $false
    }

    $reachableFailures = @($unreadyStatuses | Where-Object { $_.Reachable })
    if ($reachableFailures.Count -eq 0) {
        Write-Warning "Could not verify GitHub Pages reachability from this machine, so no empty redeploy commit was created."
        return $false
    }

    Write-Warning "No project file changes were detected, but the published URL is still unavailable."
    foreach ($failure in $reachableFailures) {
        $details = if ($null -ne $failure.StatusCode) { "HTTP $($failure.StatusCode)" } else { "not ready" }
        Write-Warning "  $($failure.Target.Url) ($details)"
    }

    $retryMessage = Get-RedeployCommitMessage -ProjectDir $ProjectDir
    Write-Host "Creating empty redeploy commit..."
    Invoke-CommandChecked -Executable "git" -Arguments @("commit", "--allow-empty", "-m", $retryMessage)
    Write-Host "Pushing redeploy commit..."
    Invoke-CommandChecked -Executable "git" -Arguments @("push")
    Write-Host "Push completed."
    Wait-ForDeployTargets -Targets $Targets -RemoteUrl $RemoteUrl | Out-Null
    return $true
}

function Wait-ForDeployTargets {
    param(
        [object[]]$Targets = @(),
        [string]$RemoteUrl = "",
        [int]$TimeoutSeconds = 180,
        [int]$PollIntervalSeconds = 5
    )

    $readyTargets = @($Targets | Where-Object { $_.WaitForReady })
    if ($readyTargets.Count -eq 0) {
        return $true
    }

    $pending = @{}
    foreach ($target in $readyTargets) {
        if (-not $pending.ContainsKey($target.Url)) {
            $pending[$target.Url] = $target
        }
    }

    if ($pending.Count -eq 0) {
        return $true
    }

    Write-Host "Waiting for GitHub Pages to serve the updated site..."
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        $readyUrls = @()
        foreach ($url in @($pending.Keys)) {
            $target = $pending[$url]
            if (Test-DeployUrlReady -Url $url) {
                Write-Host "  Ready: $($target.Url)"
                $readyUrls += $url
            }
        }

        foreach ($url in $readyUrls) {
            $pending.Remove($url)
        }

        if ($pending.Count -eq 0) {
            Write-Host "GitHub Pages site is live."
            return $true
        }

        Start-Sleep -Seconds $PollIntervalSeconds
    }

    Write-Warning "Push finished, but GitHub Pages is still not serving these URL(s):"
    foreach ($target in $pending.Values) {
        Write-Warning "  $($target.Url)"
    }

    $workflowUrl = Get-WorkflowUrl -RemoteUrl $RemoteUrl
    if (-not [string]::IsNullOrWhiteSpace($workflowUrl)) {
        Write-Warning "Check workflow status: $workflowUrl"
    }

    return $false
}

function Try-PushPendingCommits {
    param(
        [string]$RemoteUrl,
        [string[]]$FallbackChangedPaths = @()
    )

    $result = [PSCustomObject]@{
        Pushed = $false
        Diverged = $false
        Ahead = 0
        Behind = 0
    }

    $syncState = Get-BranchSyncState
    $result.Ahead = $syncState.Ahead
    $result.Behind = $syncState.Behind

    if (-not $syncState.HasUpstream -or $syncState.Ahead -le 0) {
        return $result
    }

    if ($syncState.Behind -gt 0) {
        $result.Diverged = $true
        return $result
    }

    Write-Host "No new file changes detected, but local branch is ahead by $($syncState.Ahead) commit(s)."
    Write-Host "Pushing pending commits..."
    Invoke-CommandChecked -Executable "git" -Arguments @("push")
    Write-Host "Push completed."

    $changedPaths = @(& git diff --name-only "$($syncState.Upstream)..HEAD")
    $changedPaths = $changedPaths | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    if ($changedPaths.Count -eq 0) {
        $changedPaths = $FallbackChangedPaths
    }

    $deployTargets = Show-DeployLinks -RemoteUrl $RemoteUrl -ChangedPaths $changedPaths
    Wait-ForDeployTargets -Targets $deployTargets -RemoteUrl $RemoteUrl | Out-Null
    $result.Pushed = $true
    return $result
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
            $deployTargets = @(Get-DeployTargets -RemoteUrl $RemoteUrl -ChangedPaths $ChangedPaths)

            Write-Host ""
            Write-Host "Site links:"
            Write-Host "  Root: $baseUrl"

            foreach ($target in $deployTargets | Where-Object { $_.Label -ne "Root" }) {
                Write-Host "  $($target.Label) => $($target.Url)"
            }
            $workflowUrl = Get-WorkflowUrl -RemoteUrl $RemoteUrl
            if (-not [string]::IsNullOrWhiteSpace($workflowUrl)) {
                Write-Host ""
                Write-Host "Workflow links:"
                Write-Host "  Pages: $workflowUrl"
            }

            return $deployTargets
        }
        catch {
            Write-Warning "Site links could not be generated: $($_.Exception.Message)"
        }
    }

    $workflowUrl = Get-WorkflowUrl -RemoteUrl $RemoteUrl
    if (-not [string]::IsNullOrWhiteSpace($workflowUrl)) {
        Write-Host ""
        Write-Host "Workflow links:"
        Write-Host "  Pages: $workflowUrl"
    }

    return @()
}

function Show-NoChangesDiagnostics {
    param(
        [Parameter(Mandatory = $true)]
        [string]$TargetProjectDir,
        [switch]$DeployDirExplicit
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

        if ($DeployDirExplicit) {
            Write-Host "Tip: this task only deploys changes inside '$TargetProjectDir'. Save changes there, then rerun this deploy task."
        }
        else {
            Write-Host "Tip: open a file inside '$TargetProjectDir' and rerun this task, or run deploy without -DeployDir."
        }
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
    if ($DeployDirExplicit) {
        Write-Host "Tip: save edited files inside '$TargetProjectDir' before rerunning this deploy task."
    }
    else {
        Write-Host "Tip: save edited files and verify they are inside '$TargetProjectDir'."
    }
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
    $compiledCss = Compile-SassIfNeeded -ProjectDir $targetProjectDir
    Update-CacheBusters -ProjectDir $targetProjectDir -CssPaths $compiledCss
    Write-Host "Staging selected folder changes..."
    Invoke-CommandChecked -Executable "git" -Arguments @("add", "-A", "--", $targetProjectDirGit)

    $stagedChanges = @(& git diff --cached --name-only -- "$targetProjectDirGit")
    $stagedChanges = $stagedChanges | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    if ($stagedChanges.Count -eq 0) {
        $linkHint = if ($targetProjectDir -eq ".") { "index.html" } else { Join-Path -Path $targetProjectDir -ChildPath "index.html" }
        $pendingPush = Try-PushPendingCommits -RemoteUrl $remoteUrl -FallbackChangedPaths @($linkHint)
        if ($pendingPush.Diverged) {
            Write-Error "Branch diverged from upstream (ahead $($pendingPush.Ahead), behind $($pendingPush.Behind)). Run 'git pull --rebase' and rerun deploy."
            exit 1
        }
        if ($pendingPush.Pushed) {
            exit 0
        }

        $deployTargets = Show-DeployLinks -RemoteUrl $remoteUrl -ChangedPaths @($linkHint)
        if (Try-RedeployUnavailableSite -Targets $deployTargets -RemoteUrl $remoteUrl -ProjectDir $targetProjectDir) {
            exit 0
        }

        Write-Host "No changes found in selected folder. Nothing to deploy."
        Show-NoChangesDiagnostics -TargetProjectDir $targetProjectDir -DeployDirExplicit:(-not [string]::IsNullOrWhiteSpace($DeployDir))
        exit 0
    }
}
else {
    if ($changes.Count -eq 0) {
        $pendingPush = Try-PushPendingCommits -RemoteUrl $remoteUrl
        if ($pendingPush.Diverged) {
            Write-Error "Branch diverged from upstream (ahead $($pendingPush.Ahead), behind $($pendingPush.Behind)). Run 'git pull --rebase' and rerun deploy."
            exit 1
        }
        if ($pendingPush.Pushed) {
            exit 0
        }

        $deployTargets = Show-DeployLinks -RemoteUrl $remoteUrl
        if (Try-RedeployUnavailableSite -Targets $deployTargets -RemoteUrl $remoteUrl) {
            exit 0
        }

        Write-Host "No changes found. Nothing to deploy."
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

Write-Host "Push completed."
$deployTargets = Show-DeployLinks -RemoteUrl $remoteUrl -ChangedPaths $changedPaths
Wait-ForDeployTargets -Targets $deployTargets -RemoteUrl $remoteUrl | Out-Null

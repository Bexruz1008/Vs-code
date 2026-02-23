param(
    [string]$CommitMessage = ""
)

$ErrorActionPreference = "Stop"

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

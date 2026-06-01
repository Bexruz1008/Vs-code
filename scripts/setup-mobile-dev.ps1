param(
    [string]$FlutterDir = 'D:\src\flutter',
    [string]$AndroidSdkRoot = 'C:\Users\ASUS\AppData\Local\Android\Sdk',
    [string]$AndroidStudioJbr = 'C:\Program Files\Android\Android Studio\jbr',
    [string]$VsCodeCli = 'D:\Users\ASUS\AppData\Local\Programs\Microsoft VS Code\bin\code.cmd'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Ensure-Directory {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -ItemType Directory -Path $Path | Out-Null
    }
}

function Add-OrUpdate-Property {
    param(
        [Parameter(Mandatory = $true)]$Object,
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)]$Value
    )

    $property = $Object.PSObject.Properties.Item($Name)
    if ($null -ne $property) {
        $property.Value = $Value
    }
    else {
        $Object | Add-Member -NotePropertyName $Name -NotePropertyValue $Value
    }
}

function Add-UserPathEntry {
    param([Parameter(Mandatory = $true)][string]$Entry)

    $currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
    $parts = @()
    if ($currentPath) {
        $parts = $currentPath -split ';' | Where-Object { $_.Trim() }
    }

    if ($parts -notcontains $Entry) {
        $updated = @($parts + $Entry) -join ';'
        & setx Path $updated | Out-Null
    }

    $env:Path = "$Entry;$env:Path"
}

function Install-AndroidCommandLineTools {
    param([Parameter(Mandatory = $true)][string]$SdkRoot)

    $sdkManager = Join-Path $SdkRoot 'cmdline-tools\latest\bin\sdkmanager.bat'
    if (Test-Path -LiteralPath $sdkManager) {
        Write-Host 'Android command-line tools already installed.'
        return
    }

    $zipUrl = 'https://dl.google.com/android/repository/commandlinetools-win-14742923_latest.zip'
    $zipPath = Join-Path $env:TEMP 'commandlinetools-win-latest.zip'
    $extractRoot = Join-Path $env:TEMP 'android-cmdline-tools-extract'
    $innerRoot = Join-Path $extractRoot 'cmdline-tools'
    $targetRoot = Join-Path $SdkRoot 'cmdline-tools'
    $latestRoot = Join-Path $targetRoot 'latest'

    Write-Host 'Downloading Android command-line tools...'
    & curl.exe -L -C - $zipUrl -o $zipPath
    if ($LASTEXITCODE -ne 0) {
        throw 'Android command-line tools download failed.'
    }

    if (Test-Path -LiteralPath $extractRoot) {
        Remove-Item -LiteralPath $extractRoot -Recurse -Force
    }

    Ensure-Directory -Path $extractRoot
    Expand-Archive -Path $zipPath -DestinationPath $extractRoot -Force
    Ensure-Directory -Path $targetRoot

    if (Test-Path -LiteralPath $latestRoot) {
        Remove-Item -LiteralPath $latestRoot -Recurse -Force
    }

    Ensure-Directory -Path $latestRoot
    Get-ChildItem -LiteralPath $innerRoot | ForEach-Object {
        Move-Item -LiteralPath $_.FullName -Destination $latestRoot -Force
    }
}

function Install-FlutterSdk {
    param(
        [Parameter(Mandatory = $true)][string]$SdkPath
    )

    $flutterBat = Join-Path $SdkPath 'bin\flutter.bat'
    if (Test-Path -LiteralPath $flutterBat) {
        Write-Host 'Flutter SDK already installed.'
        return
    }

    Ensure-Directory -Path (Split-Path -Path $SdkPath -Parent)
    Write-Host "Cloning Flutter SDK into $SdkPath ..."
    & git clone https://github.com/flutter/flutter.git -b stable $SdkPath
    if ($LASTEXITCODE -ne 0) {
        throw 'Flutter SDK clone failed.'
    }
}

function Update-UserEnvironment {
    param(
        [Parameter(Mandatory = $true)][string]$FlutterRoot,
        [Parameter(Mandatory = $true)][string]$SdkRoot,
        [Parameter(Mandatory = $true)][string]$JavaRoot
    )

    foreach ($pair in @(
        @{ Name = 'FLUTTER_ROOT'; Value = $FlutterRoot },
        @{ Name = 'ANDROID_HOME'; Value = $SdkRoot },
        @{ Name = 'ANDROID_SDK_ROOT'; Value = $SdkRoot },
        @{ Name = 'JAVA_HOME'; Value = $JavaRoot }
    )) {
        & setx $pair.Name $pair.Value | Out-Null
        Set-Item -Path "Env:$($pair.Name)" -Value $pair.Value
    }

    Add-UserPathEntry -Entry (Join-Path $FlutterRoot 'bin')
    Add-UserPathEntry -Entry (Join-Path $SdkRoot 'platform-tools')
    Add-UserPathEntry -Entry (Join-Path $SdkRoot 'emulator')
    Add-UserPathEntry -Entry (Join-Path $SdkRoot 'cmdline-tools\latest\bin')
    Add-UserPathEntry -Entry (Join-Path $JavaRoot 'bin')
}

function Configure-Flutter {
    param(
        [Parameter(Mandatory = $true)][string]$FlutterRoot,
        [Parameter(Mandatory = $true)][string]$SdkRoot,
        [Parameter(Mandatory = $true)][string]$JavaRoot
    )

    $flutterBat = Join-Path $FlutterRoot 'bin\flutter.bat'

    & $flutterBat config --android-sdk $SdkRoot
    if ($LASTEXITCODE -ne 0) {
        throw 'Failed to configure Flutter Android SDK path.'
    }

    & $flutterBat config --jdk-dir $JavaRoot
    if ($LASTEXITCODE -ne 0) {
        throw 'Failed to configure Flutter JDK path.'
    }
}

function Update-VsCodeSettings {
    param(
        [Parameter(Mandatory = $true)][string]$FlutterRoot,
        [Parameter(Mandatory = $true)][string]$SdkRoot,
        [Parameter(Mandatory = $true)][string]$JavaRoot
    )

    $settingsPath = Join-Path $env:APPDATA 'Code\User\settings.json'
    Ensure-Directory -Path (Split-Path -Path $settingsPath -Parent)

    if ((Test-Path -LiteralPath $settingsPath) -and ((Get-Item -LiteralPath $settingsPath).Length -gt 0)) {
        $settings = Get-Content -LiteralPath $settingsPath -Raw | ConvertFrom-Json
    }
    else {
        $settings = [pscustomobject]@{}
    }

    Add-OrUpdate-Property -Object $settings -Name 'dart.flutterSdkPath' -Value $FlutterRoot
    Add-OrUpdate-Property -Object $settings -Name 'java.jdt.ls.java.home' -Value $JavaRoot

    $terminalEnv = if ($settings.PSObject.Properties.Name -contains 'terminal.integrated.env.windows') {
        $settings.'terminal.integrated.env.windows'
    }
    else {
        [pscustomobject]@{}
    }

    Add-OrUpdate-Property -Object $terminalEnv -Name 'FLUTTER_ROOT' -Value $FlutterRoot
    Add-OrUpdate-Property -Object $terminalEnv -Name 'ANDROID_HOME' -Value $SdkRoot
    Add-OrUpdate-Property -Object $terminalEnv -Name 'ANDROID_SDK_ROOT' -Value $SdkRoot
    Add-OrUpdate-Property -Object $terminalEnv -Name 'JAVA_HOME' -Value $JavaRoot
    Add-OrUpdate-Property -Object $settings -Name 'terminal.integrated.env.windows' -Value $terminalEnv

    $json = $settings | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText(
        $settingsPath,
        $json + [Environment]::NewLine,
        [System.Text.UTF8Encoding]::new($false)
    )
}

function Install-VsCodeExtensions {
    param([Parameter(Mandatory = $true)][string]$CliPath)

    $extensions = @(
        'Dart-Code.flutter',
        'Dart-Code.dart-code',
        'msjsdiag.vscode-react-native',
        'DiemasMichiels.emulate',
        'redhat.java',
        'vscjava.vscode-gradle',
        'esbenp.prettier-vscode',
        'usernamehw.errorlens'
    )

    foreach ($extension in $extensions) {
        Write-Host "Installing VS Code extension: $extension"
        & $CliPath --install-extension $extension --force
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Extension install failed: $extension"
        }
    }
}

if (-not (Test-Path -LiteralPath $AndroidSdkRoot)) {
    throw "Android SDK not found at $AndroidSdkRoot"
}

if (-not (Test-Path -LiteralPath $AndroidStudioJbr)) {
    throw "Android Studio JBR not found at $AndroidStudioJbr"
}

if (-not (Test-Path -LiteralPath $VsCodeCli)) {
    throw "VS Code CLI not found at $VsCodeCli"
}

Install-AndroidCommandLineTools -SdkRoot $AndroidSdkRoot
Install-FlutterSdk -SdkPath $FlutterDir
Update-UserEnvironment -FlutterRoot $FlutterDir -SdkRoot $AndroidSdkRoot -JavaRoot $AndroidStudioJbr
Configure-Flutter -FlutterRoot $FlutterDir -SdkRoot $AndroidSdkRoot -JavaRoot $AndroidStudioJbr
Update-VsCodeSettings -FlutterRoot $FlutterDir -SdkRoot $AndroidSdkRoot -JavaRoot $AndroidStudioJbr
Install-VsCodeExtensions -CliPath $VsCodeCli

Write-Host ''
Write-Host 'Mobile development setup completed.'
Write-Host "Flutter SDK: $FlutterDir"
Write-Host "Android SDK: $AndroidSdkRoot"
Write-Host "Java: $AndroidStudioJbr"
Write-Host 'Restart VS Code and PowerShell to pick up the updated user PATH.'

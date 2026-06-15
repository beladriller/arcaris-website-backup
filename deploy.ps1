<#
.SYNOPSIS
    Deployt die Arcaris-Website per FTP/SFTP/FTPS auf den Strato-Webserver.

.DESCRIPTION
    Synchronisiert nur geaenderte Dateien (Mirror-Richtung lokal -> Remote).
    Ausgenommen sind .git, preview/, Originalassets und lokale Dev-Tools.
    Credentials werden beim ersten Aufruf abgefragt und mit Windows-DPAPI
    verschluesselt unter deploy-credentials.xml gespeichert (nur fuer den
    aktuellen Windows-User entschluesselbar).

.PARAMETER DryRun
    Zeigt was hochgeladen wuerde, ohne tatsaechlich zu uebertragen.

.PARAMETER Force
    Ueberschreibt alle Dateien, ohne Zeitstempel/Groesse zu vergleichen.

.PARAMETER Backup
    Laedt vor dem Upload den aktuellen Remote-Stand als ZIP herunter.

.PARAMETER Mirror
    Loescht zusaetzlich Remote-Dateien, die lokal nicht mehr existieren.
    NUR mit Vorsicht verwenden - vorzugsweise zusammen mit -DryRun pruefen.

.PARAMETER ResetCredentials
    Verwirft gespeicherte Credentials und fragt sie neu ab.

.EXAMPLE
    .\deploy.ps1 -DryRun
    Trockenlauf - listet zu uebertragende Dateien.

.EXAMPLE
    .\deploy.ps1 -Backup
    Backup erstellen, dann hochladen.

.EXAMPLE
    .\deploy.ps1 -Mirror -DryRun
    Zeigt was geloescht und was hochgeladen wuerde.
#>
[CmdletBinding()]
param(
    [string]$ConfigPath = "$PSScriptRoot\deploy-config.ps1",
    [switch]$DryRun,
    [switch]$Force,
    [switch]$Backup,
    [switch]$Mirror,
    [switch]$ResetCredentials
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

# ---------- Konfig laden ----------
if (-not (Test-Path $ConfigPath)) {
    Write-Host ""
    Write-Host "Keine Konfiguration unter: $ConfigPath" -ForegroundColor Yellow
    Write-Host "Bitte deploy-config.example.ps1 -> deploy-config.ps1 kopieren und anpassen." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
$config = & $ConfigPath
foreach ($key in 'Protocol','HostName','Port','Username','RemotePath','LocalPath') {
    if (-not $config.ContainsKey($key)) { throw "Konfig fehlt Schluessel: $key" }
}

# ---------- WinSCP-Assembly finden ----------
$winscpDll = $null
$candidates = @(
    "${env:ProgramFiles(x86)}\WinSCP\WinSCPnet.dll",
    "${env:ProgramFiles}\WinSCP\WinSCPnet.dll",
    "$PSScriptRoot\_tools\WinSCPnet.dll",
    "$PSScriptRoot\_tools\WinSCP\WinSCPnet.dll"
)
if ($config.ContainsKey('WinScpAssembly') -and $config.WinScpAssembly) {
    $candidates = ,$config.WinScpAssembly + $candidates
}
foreach ($c in $candidates) { if (Test-Path $c) { $winscpDll = $c; break } }
if (-not $winscpDll) {
    Write-Host ""
    Write-Host "WinSCP-Assembly nicht gefunden." -ForegroundColor Red
    Write-Host ""
    Write-Host "Zwei Installations-Wege:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  a) WinSCP installieren (empfohlen, einmalig):" -ForegroundColor Cyan
    Write-Host "     https://winscp.net/eng/downloads.php" -ForegroundColor Cyan
    Write-Host "     Standard-Installer, danach erkennt das Skript es automatisch." -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  b) Standalone .NET-Assembly (ohne Installer):" -ForegroundColor Cyan
    Write-Host "     1. https://winscp.net/eng/downloads.php#additional" -ForegroundColor Cyan
    Write-Host "        -> 'WinSCP .NET Assembly / COM Library' ZIP herunterladen" -ForegroundColor DarkGray
    Write-Host "     2. ZIP entpacken, sodass folgende Datei existiert:" -ForegroundColor DarkGray
    Write-Host "        $PSScriptRoot\_tools\WinSCPnet.dll" -ForegroundColor DarkGray
    Write-Host ""
    exit 1
}
Add-Type -Path $winscpDll

# ---------- Credentials ----------
$credPath = Join-Path $PSScriptRoot 'deploy-credentials.xml'
if ($ResetCredentials -and (Test-Path $credPath)) { Remove-Item $credPath -Force }
if (Test-Path $credPath) {
    $cred = Import-Clixml $credPath
    Write-Host "Credentials geladen: $($cred.UserName)" -ForegroundColor DarkGray
} else {
    Write-Host "Passwort fuer $($config.Username) bitte eingeben:" -ForegroundColor Cyan
    $cred = Get-Credential -UserName $config.Username -Message "Passwort fuer $($config.HostName)"
    if (-not $cred) { Write-Host "Abgebrochen." -ForegroundColor Yellow; exit 1 }
    $cred | Export-Clixml $credPath
    Write-Host "Credentials verschluesselt gespeichert (DPAPI, an Windows-User gebunden)." -ForegroundColor Green
}

# ---------- Session-Optionen ----------
$opts = New-Object WinSCP.SessionOptions
switch ($config.Protocol) {
    'FTP'  { $opts.Protocol = [WinSCP.Protocol]::Ftp;  $opts.FtpSecure = [WinSCP.FtpSecure]::None }
    'FTPS' { $opts.Protocol = [WinSCP.Protocol]::Ftp;  $opts.FtpSecure = [WinSCP.FtpSecure]::Explicit }
    'SFTP' { $opts.Protocol = [WinSCP.Protocol]::Sftp }
    default { throw "Unbekanntes Protokoll: $($config.Protocol). Erlaubt: FTP, FTPS, SFTP" }
}
$opts.HostName   = $config.HostName
$opts.PortNumber = [int]$config.Port
$opts.UserName   = $cred.UserName
$opts.Password   = $cred.GetNetworkCredential().Password

if ($config.Protocol -eq 'SFTP') {
    if ($config.ContainsKey('SshHostKeyFingerprint') -and $config.SshHostKeyFingerprint) {
        $opts.SshHostKeyFingerprint = $config.SshHostKeyFingerprint
    } else {
        Write-Host "WARNUNG: kein SshHostKeyFingerprint konfiguriert." -ForegroundColor Yellow
        Write-Host "Erstverbindung akzeptiert beliebigen Key - bitte danach den Fingerprint" -ForegroundColor Yellow
        Write-Host "aus dem WinSCP-Log in deploy-config.ps1 eintragen." -ForegroundColor Yellow
        $opts.GiveUpSecurityAndAcceptAnySshHostKey = $true
    }
}

# ---------- File-Mask (Excludes) ----------
$defaultExcludes = @(
    '*/.git/*'; '*/.git'; '.gitignore'; '.gitattributes'
    '*/.claude/*'; '*/.claude'
    '*/.vscode/*'; '*/.idea/*'
    '*/preview/*'; '*/preview'
    '*/_reference/*'; '*/_reference'
    '*/Corporate design/*'; '*/Corporate design'
    '*/Logo/*'; '*/Logo'
    '*/download/*'; '*/download'
    '*/other content/*'; '*/other content'
    '*/_tools/*'; '*/_tools'
    '*.bak'; '*.tmp'; '*.swp'
    'Thumbs.db'; '.DS_Store'; 'desktop.ini'
    'serve.ps1'
    'deploy.ps1'; 'deploy-config.ps1'; 'deploy-config.example.ps1'; 'deploy-credentials.xml'
    '_deploy-backup-*.zip'
)
$excludes = $defaultExcludes
if ($config.ContainsKey('AdditionalExcludes')) { $excludes += $config.AdditionalExcludes }

$transferOpts = New-Object WinSCP.TransferOptions
$transferOpts.FileMask = '|' + ($excludes -join '; ')

# ---------- Session ----------
$session = New-Object WinSCP.Session
try {
    Write-Host ""
    Write-Host "Verbinde mit $($config.Protocol)://$($config.HostName):$($config.Port) ..." -ForegroundColor Cyan
    $session.Open($opts)
    Write-Host "Verbunden." -ForegroundColor Green

    # ---------- Backup ----------
    if ($Backup) {
        $stamp = Get-Date -Format 'yyyy-MM-dd_HHmm'
        $backupTmp = Join-Path $PSScriptRoot "_deploy-backup-tmp-$stamp"
        New-Item -ItemType Directory -Path $backupTmp -Force | Out-Null
        Write-Host ""
        Write-Host "Backup: lade Remote-Webroot $($config.RemotePath) ..." -ForegroundColor Cyan
        $remoteGlob = $config.RemotePath.TrimEnd('/') + '/*'
        $session.GetFiles($remoteGlob, "$backupTmp\*", $false).Check()
        $zipPath = Join-Path $PSScriptRoot "_deploy-backup-$stamp.zip"
        Compress-Archive -Path "$backupTmp\*" -DestinationPath $zipPath -Force
        Remove-Item $backupTmp -Recurse -Force
        Write-Host "Backup gespeichert: $zipPath" -ForegroundColor Green
    }

    # ---------- Datei-Auswahl + Vergleich (PowerShell-seitig) ----------
    # WICHTIG: WinSCPs SynchronizeDirectories() hat KEINEN Dry-Run/Preview-Parameter.
    # Der 5. Parameter ist 'mirror', NICHT 'preview'. Frueher wurde -DryRun dort
    # uebergeben -> es wurde real hochgeladen ("Dry-Run" log irrefuehrend). Deshalb
    # hier eine eigene, transparente Auswahl. -DryRun ist garantiert nur lesend
    # (nur FileExists/GetFileInfo), und die Ausschluesse greifen auch auf Root-Ebene.

    $localRoot  = (Resolve-Path $config.LocalPath).Path.TrimEnd('\')
    $remoteRoot = $config.RemotePath.TrimEnd('/')   # '/' -> '' damit "$remoteRoot/$rel" passt

    # Ausschluesse: Verzeichnis-Namen (an JEDER Stelle im Pfad) + Datei-Namen/Muster
    # Hinweis: 'download' wird NICHT ausgeschlossen - index.html verlinkt PDFs daraus
    # (download/Anfahrt.pdf, download/Arcaris_Praktikum_...pdf), muss also mit hoch.
    $exDirNames  = @('.git','.gstack','.claude','.vscode','.idea','_tools','_reference',
                     'preview','Corporate design','Logo','other content','node_modules')
    $exDirGlobs  = @('_deploy-backup-tmp-*')
    $exFileNames = @('deploy.ps1','deploy-config.ps1','deploy-config.example.ps1',
                     'deploy-credentials.xml','serve.ps1','.gitignore','.gitattributes',
                     'Thumbs.db','.DS_Store','desktop.ini','image.png','Smartphone ansicht website.png')
    $exFileGlobs = @('*.bak','*.tmp','*.swp','_deploy-backup-*.zip')

    function Test-Deployable([string]$full) {
        $rel = $full.Substring($localRoot.Length).TrimStart('\')
        $parts = $rel -split '\\'
        for ($i = 0; $i -lt $parts.Count - 1; $i++) {
            if ($exDirNames -contains $parts[$i]) { return $false }
            foreach ($g in $exDirGlobs) { if ($parts[$i] -like $g) { return $false } }
        }
        $name = $parts[$parts.Count - 1]
        if ($exFileNames -contains $name) { return $false }
        foreach ($g in $exFileGlobs) { if ($name -like $g) { return $false } }
        return $true
    }

    Write-Host ""
    Write-Host "Lokal:  $localRoot" -ForegroundColor Cyan
    Write-Host "Remote: $($config.RemotePath)" -ForegroundColor Cyan
    if ($DryRun) { Write-Host "Modus:  DRY-RUN (nur Anzeige, garantiert KEIN Upload)" -ForegroundColor Yellow }
    if ($Force)  { Write-Host "Modus:  FORCE (alle Dateien neu uebertragen)" -ForegroundColor Yellow }
    if ($Mirror) { Write-Host "Hinweis: -Mirror (Remote-Loeschen) ist in dieser Version deaktiviert." -ForegroundColor Yellow }
    Write-Host ""

    $localFiles = Get-ChildItem -LiteralPath $localRoot -Recurse -File -Force |
                  Where-Object { Test-Deployable $_.FullName }

    $uploads = New-Object System.Collections.Generic.List[object]
    foreach ($lf in $localFiles) {
        $rel = ($lf.FullName.Substring($localRoot.Length).TrimStart('\')) -replace '\\','/'
        $rp  = "$remoteRoot/$rel"
        $need = $true
        if (-not $Force -and $session.FileExists($rp)) {
            $ri = $session.GetFileInfo($rp)
            if ($ri.Length -eq $lf.Length -and $lf.LastWriteTime -le $ri.LastWriteTime.AddSeconds(2)) { $need = $false }
        }
        if ($need) { $uploads.Add([pscustomobject]@{ Local = $lf.FullName; Remote = $rp; Rel = $rel }) }
    }

    if ($uploads.Count -eq 0) {
        Write-Host "Keine Aenderungen - alles bereits aktuell." -ForegroundColor Green
    } else {
        $verb = if ($DryRun) { 'wuerden hochgeladen' } else { 'werden hochgeladen' }
        Write-Host "$($uploads.Count) Datei(en) $verb`:" -ForegroundColor Green
        foreach ($u in $uploads) { Write-Host "  + $($u.Rel)" -ForegroundColor DarkGray }
        if (-not $DryRun) {
            Write-Host ""
            $to = New-Object WinSCP.TransferOptions
            $to.TransferMode = [WinSCP.TransferMode]::Binary
            $ok = 0; $fail = 0
            foreach ($u in $uploads) {
                $rdir = $u.Remote.Substring(0, $u.Remote.LastIndexOf('/'))
                if ($rdir -eq '') { $rdir = '/' }
                try {
                    $r = $session.PutFileToDirectory($u.Local, $rdir, $false, $to)
                    $r.Check(); $ok++
                } catch { $fail++; Write-Host "  ! $($u.Rel): $($_.Exception.Message)" -ForegroundColor Red }
            }
            Write-Host ""
            Write-Host "Hochgeladen: $ok   Fehler: $fail" -ForegroundColor $(if ($fail) { 'Red' } else { 'Green' })
        }
    }
    Write-Host ""
}
finally {
    $session.Dispose()
}

# Konfiguration fuer deploy.ps1
#
# Anwendung:
#   1. Diese Datei kopieren:  deploy-config.example.ps1  ->  deploy-config.ps1
#   2. Werte unten an Strato-Zugangsdaten anpassen
#   3. deploy-config.ps1 ist via .gitignore vom Repo ausgeschlossen
#
# Strato-Hinweise (Stand 2026):
#   SFTP (empfohlen, falls verfuegbar):
#     HostName  = 'ssh.strato.de'   ODER  die Domain selbst (arcaris.de)
#     Port      = 22
#     Username  = laut Strato-Kundencenter (oft die Domain oder 'kunde@arcaris.de')
#
#   FTP (Klassik, ueberall verfuegbar):
#     HostName  = 'ftp.strato.de'   ODER  'arcaris.de'
#     Port      = 21
#     Username  = laut Strato-Kundencenter
#
#   FTPS (FTP ueber TLS, falls Strato es im Tarif freischaltet):
#     HostName  = 'ftp.strato.de'
#     Port      = 21
#     Protocol  = 'FTPS'  (Explicit-Mode)
#
#   RemotePath:
#     Bei Strato meist '/' — die Webroot-Wurzel ist direkt das FTP-Root.
#     Falls Strato einen Unterordner verlangt (z.B. /htdocs), hier eintragen.
#
#   Username-Hinweis:
#     Strato hat oft FTP-Login = Domain (z.B. 'arcaris.de') oder
#     ein zusaetzliches FTP-Konto, das im Kundencenter unter
#     "FTP-Konten" angelegt wird. Empfehlung: separates FTP-Konto
#     mit Pfad-Beschraenkung anlegen, nicht den Master-Login nutzen.

@{
    # FTP, FTPS oder SFTP
    Protocol = 'SFTP'

    # Strato-Server
    HostName = 'ssh.strato.de'
    Port     = 22

    # Login (Passwort wird beim ersten Lauf abgefragt und verschluesselt gecached)
    Username = 'arcaris.de'

    # Remote-Webroot
    RemotePath = '/'

    # Lokales Projektverzeichnis (Standard: dieser Ordner)
    LocalPath = $PSScriptRoot

    # SFTP-Hostkey-Fingerprint (nach erstem erfolgreichen Connect aus dem Log eintragen)
    # Beispiel: SshHostKeyFingerprint = 'ssh-ed25519 256 AbCdEf12...'
    # SshHostKeyFingerprint = ''

    # Optional: zusaetzliche Excludes (FileMask-Pattern, mit '/' als Separator)
    # AdditionalExcludes = @('*/temp/*', '*.log')

    # Optional: expliziter Pfad zur WinSCPnet.dll, falls nicht in Standard-Pfaden
    # WinScpAssembly = 'C:\Tools\WinSCP\WinSCPnet.dll'
}

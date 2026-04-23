param([string]$Root = $PSScriptRoot)
Add-Type -AssemblyName System.Web
$root = $Root
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()
Write-Host "Serving $root on http://localhost:8000/"

$mime = @{
    '.html'='text/html; charset=utf-8'; '.htm'='text/html; charset=utf-8';
    '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8';
    '.json'='application/json; charset=utf-8'; '.svg'='image/svg+xml';
    '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg';
    '.gif'='image/gif'; '.webp'='image/webp'; '.ico'='image/x-icon';
    '.woff'='font/woff'; '.woff2'='font/woff2'; '.ttf'='font/ttf';
    '.eot'='application/vnd.ms-fontobject'; '.mp4'='video/mp4';
    '.webm'='video/webm'; '.pdf'='application/pdf'; '.txt'='text/plain; charset=utf-8';
}

function Send-FileRange {
    param(
        [System.Net.HttpListenerResponse]$Res,
        [string]$Path,
        [string]$ContentType,
        [string]$RangeHeader
    )
    $fs = [System.IO.File]::Open($Path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::Read)
    try {
        $total = $fs.Length
        $start = 0
        $end = $total - 1
        $isPartial = $false
        if ($RangeHeader -and $RangeHeader -match 'bytes=(\d*)-(\d*)') {
            $s = $Matches[1]; $e = $Matches[2]
            if ($s -ne '') { $start = [long]$s }
            if ($e -ne '') { $end = [long]$e } else { $end = $total - 1 }
            if ($start -lt 0) { $start = 0 }
            if ($end -ge $total) { $end = $total - 1 }
            if ($start -le $end) { $isPartial = $true }
        }
        $length = $end - $start + 1
        $Res.ContentType = $ContentType
        $Res.Headers.Add('Accept-Ranges', 'bytes')
        if ($isPartial) {
            $Res.StatusCode = 206
            $Res.Headers.Add('Content-Range', "bytes $start-$end/$total")
        } else {
            $Res.StatusCode = 200
        }
        $Res.ContentLength64 = $length
        if ($start -gt 0) { [void]$fs.Seek($start, 'Begin') }
        $buf = New-Object byte[] 65536
        $remaining = $length
        while ($remaining -gt 0) {
            $toRead = [Math]::Min($buf.Length, $remaining)
            $read = $fs.Read($buf, 0, $toRead)
            if ($read -le 0) { break }
            $Res.OutputStream.Write($buf, 0, $read)
            $remaining -= $read
        }
    } finally {
        $fs.Dispose()
    }
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response
        try {
            $rel = [System.Web.HttpUtility]::UrlDecode($req.Url.AbsolutePath)
            if ($rel -eq '/' -or $rel -eq '') { $rel = '/index.html' }
            $full = Join-Path $root $rel.TrimStart('/')
            if (Test-Path $full -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($full).ToLower()
                $ct = $mime[$ext]; if (-not $ct) { $ct = 'application/octet-stream' }
                $range = $req.Headers['Range']
                Send-FileRange -Res $res -Path $full -ContentType $ct -RangeHeader $range
            } else {
                $res.StatusCode = 404
                $msg = [Text.Encoding]::UTF8.GetBytes("404 Not Found: $rel")
                $res.ContentLength64 = $msg.Length
                $res.OutputStream.Write($msg, 0, $msg.Length)
            }
        } catch {
            try { $res.StatusCode = 500 } catch {}
            Write-Host "Error serving $($req.Url): $_"
        } finally {
            try { $res.OutputStream.Close() } catch {}
        }
    }
} finally {
    $listener.Stop()
}

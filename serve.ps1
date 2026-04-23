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

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response
        $rel = [System.Web.HttpUtility]::UrlDecode($req.Url.AbsolutePath)
        if ($rel -eq '/' -or $rel -eq '') { $rel = '/index.html' }
        $full = Join-Path $root $rel.TrimStart('/')
        if (Test-Path $full -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($full)
            $ext = [System.IO.Path]::GetExtension($full).ToLower()
            $ct = $mime[$ext]; if (-not $ct) { $ct = 'application/octet-stream' }
            $res.ContentType = $ct
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $msg = [Text.Encoding]::UTF8.GetBytes("404 Not Found: $rel")
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
        $res.OutputStream.Close()
    }
} finally {
    $listener.Stop()
}

# deploy.ps1 - Windows deploy (scp + ssh, no rsync needed)
# Usage: .\deploy\deploy.ps1 irena-beauty.com

param(
  [Parameter(Mandatory=$true)]
  [string]$Domain
)

# -----------------------------------------------------------
# SETTINGS - fill in once
# -----------------------------------------------------------
$SERVER_IP   = "1.2.3.4"
$SERVER_USER = "root"
$SSH_KEY     = ""          # e.g. "C:\Users\vadim\.ssh\id_rsa"  or leave ""
$ADMIN_EMAIL = "admin@example.com"

$SITES = @{
  "maayan-cosmetics.com" = "C:\Users\vadim\Downloads\maayan\sites\maayan-cosmetics.com"
  "elibenyizhak.com"     = "C:\Users\vadim\Downloads\maayan\sites\elibenyizhak.com"
  "hofit-cosmetics.com"  = "C:\Users\vadim\Downloads\maayan\sites\hofit-cosmetics.com"
  "hofit-barbershop.com" = "C:\Users\vadim\Downloads\maayan\sites\hofit-barbershop.com"
  "irena-beauty.com"     = "C:\Users\vadim\Downloads\maayan\sites\irena-beauty.com"
}
# -----------------------------------------------------------

if (-not $SITES.ContainsKey($Domain)) {
  Write-Host "Domain '$Domain' not found. Available:" -ForegroundColor Red
  $SITES.Keys | ForEach-Object { Write-Host "  $_" }
  exit 1
}

$LocalPath   = $SITES[$Domain]
$NginxConf   = "$PSScriptRoot\nginx\sites\$Domain.conf"
$RemoteRoot  = "/var/www/$Domain"
$RemoteConn  = "$SERVER_USER@$SERVER_IP"

# Detect site type
$IsNextJs = $false
$pkgPath = Join-Path $LocalPath "package.json"
if (Test-Path $pkgPath) {
  $pkgContent = Get-Content $pkgPath -Raw -Encoding UTF8
  if ($pkgContent -match '"next"') { $IsNextJs = $true }
}

Write-Host ""
Write-Host "=== Deploy: $Domain ===" -ForegroundColor Cyan
Write-Host "    Type : $(if ($IsNextJs) { 'Next.js' } else { 'Static HTML' })" -ForegroundColor Cyan
Write-Host "    From : $LocalPath" -ForegroundColor DarkGray
Write-Host ""

# Helper: run a shell command on the remote server
function Invoke-Remote {
  param([string]$ShellCmd)
  if ($SSH_KEY) {
    ssh -i $SSH_KEY $RemoteConn bash -c "'$ShellCmd'"
  } else {
    ssh $RemoteConn bash -c "'$ShellCmd'"
  }
}

# Helper: copy a local file to the server
function Copy-File {
  param([string]$Src, [string]$Dest)
  if ($SSH_KEY) {
    scp -i $SSH_KEY -q "$Src" "${RemoteConn}:$Dest"
  } else {
    scp -q "$Src" "${RemoteConn}:$Dest"
  }
}

# -----------------------------------------------------------
# [1/4] Upload files
# -----------------------------------------------------------
Write-Host "[1/4] Uploading files..." -ForegroundColor Yellow

$excludeDirs = @("node_modules", ".next", ".git", "deploy", "nginx-config", ".claude", "_scraped_spans")

$files = Get-ChildItem $LocalPath -Recurse -File | Where-Object {
  $rel = $_.FullName.Substring($LocalPath.Length).TrimStart("\")
  $parts = $rel.Split("\")
  $skip = $false
  foreach ($ex in $excludeDirs) {
    if ($parts -contains $ex) { $skip = $true; break }
  }
  -not $skip
}

Write-Host "    Files to upload: $($files.Count)"

foreach ($file in $files) {
  $rel        = $file.FullName.Substring($LocalPath.Length).TrimStart("\").Replace("\", "/")
  $remoteFile = "$RemoteRoot/$rel"
  $remoteDir  = $remoteFile.Substring(0, $remoteFile.LastIndexOf("/"))

  Invoke-Remote "mkdir -p $remoteDir" | Out-Null
  Copy-File $file.FullName $remoteFile
}

Write-Host "    Done." -ForegroundColor Green

# -----------------------------------------------------------
# [2/4] Nginx config
# -----------------------------------------------------------
Write-Host "[2/4] Nginx config..." -ForegroundColor Yellow

Invoke-Remote "mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled"
Copy-File $NginxConf "/etc/nginx/sites-available/$Domain.conf"
Invoke-Remote "ln -sf /etc/nginx/sites-available/$Domain.conf /etc/nginx/sites-enabled/$Domain.conf"
Invoke-Remote "chown -R www-data:www-data $RemoteRoot"
Invoke-Remote "chmod -R 755 $RemoteRoot"

Write-Host "    Done." -ForegroundColor Green

# -----------------------------------------------------------
# [3/4] Build (Next.js only)
# -----------------------------------------------------------
if ($IsNextJs) {
  Write-Host "[3/4] npm install + build (2-3 min)..." -ForegroundColor Yellow

  Invoke-Remote "cd $RemoteRoot && npm install"
  Invoke-Remote "cd $RemoteRoot && npm run build"

  $pm2Running = Invoke-Remote "pm2 list 2>/dev/null | grep -c $Domain || true"
  if ([int]($pm2Running -replace '\D','') -gt 0) {
    Write-Host "    Restarting PM2 process..."
    Invoke-Remote "pm2 restart $Domain"
  } else {
    Write-Host "    Starting new PM2 process on port 3000..."
    Invoke-Remote "cd $RemoteRoot && PORT=3000 pm2 start node_modules/.bin/next --name $Domain -- start"
    Invoke-Remote "pm2 save"
  }
  Write-Host "    Done." -ForegroundColor Green
} else {
  Write-Host "[3/4] Static site - no build needed." -ForegroundColor Yellow
}

# -----------------------------------------------------------
# [4/4] SSL certificate
# -----------------------------------------------------------
Write-Host "[4/4] SSL certificate..." -ForegroundColor Yellow

$sslExists = Invoke-Remote "test -f /etc/letsencrypt/live/$Domain/fullchain.pem && echo yes || echo no"

if ($sslExists -notmatch "yes") {
  Write-Host "    Getting SSL from Let's Encrypt..."

  # Temporary plain HTTP config for certbot webroot challenge
  $tempConf = "server { listen 80; server_name $Domain www.$Domain; root $RemoteRoot; location /.well-known/acme-challenge/ { root $RemoteRoot; } }"
  Invoke-Remote "echo '$tempConf' > /etc/nginx/sites-available/$Domain-temp.conf"
  Invoke-Remote "ln -sf /etc/nginx/sites-available/$Domain-temp.conf /etc/nginx/sites-enabled/$Domain-temp.conf"
  Invoke-Remote "nginx -t && systemctl reload nginx"

  Invoke-Remote "certbot certonly --webroot -w $RemoteRoot -d $Domain -d www.$Domain --non-interactive --agree-tos -m $ADMIN_EMAIL"

  Invoke-Remote "rm -f /etc/nginx/sites-enabled/$Domain-temp.conf /etc/nginx/sites-available/$Domain-temp.conf"
} else {
  Write-Host "    SSL already exists - skipping." -ForegroundColor DarkGray
}

Invoke-Remote "nginx -t && systemctl reload nginx"

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Green
Write-Host "    https://$Domain" -ForegroundColor Green
Write-Host ""

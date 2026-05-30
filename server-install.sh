#!/bin/bash
# Запускати на Ubuntu сервері з папки проекту
# cd ~/cosmetic-websites && bash server-install.sh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITES_DIR="$PROJECT_DIR/sites"
NGINX_DIR="$PROJECT_DIR/deploy/nginx/sites"

echo "=== Installing all sites ==="
echo "    Project: $PROJECT_DIR"
echo ""

# ── 1. Встановлення пакетів ────────────────────────────────
echo "[1/6] Installing packages..."
apt-get update -q
apt-get install -y -q nginx certbot python3-certbot-nginx

# Node.js 20
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -q nodejs
fi

# PM2
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi

echo "    Done."

# ── 2. Копіюємо файли сайтів у /var/www/ ──────────────────
echo ""
echo "[2/6] Copying site files to /var/www/..."

for site_path in "$SITES_DIR"/*/; do
  domain=$(basename "$site_path")
  dest="/var/www/$domain"
  mkdir -p "$dest"
  rsync -a --exclude='.git' --exclude='node_modules' --exclude='.next' "$site_path" "$dest/"
  chown -R www-data:www-data "$dest"
  echo "    $domain -> $dest"
done

echo "    Done."

# ── 3. Nginx конфіги ───────────────────────────────────────
echo ""
echo "[3/6] Setting up nginx configs..."

rm -f /etc/nginx/sites-enabled/default

for conf in "$NGINX_DIR"/*.conf; do
  domain=$(basename "$conf" .conf)
  cp "$conf" "/etc/nginx/sites-available/$domain.conf"
  ln -sf "/etc/nginx/sites-available/$domain.conf" "/etc/nginx/sites-enabled/$domain.conf"
  echo "    $domain"
done

# ── 4. Next.js build ───────────────────────────────────────
echo ""
echo "[4/6] Building Next.js (irena-beauty.com)..."

cd /var/www/irena-beauty.com
npm install
npm run build

echo "    Done."

# ── 5. PM2 старт ──────────────────────────────────────────
echo ""
echo "[5/6] Starting PM2..."

if pm2 list | grep -q "irena-beauty"; then
  pm2 restart irena-beauty
else
  PORT=3000 pm2 start node_modules/.bin/next --name irena-beauty -- start
fi

pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash 2>/dev/null || true

echo "    Done."

# ── 6. Nginx старт ────────────────────────────────────────
echo ""
echo "[6/6] Starting nginx..."

nginx -t
systemctl enable nginx
systemctl restart nginx

# ── Firewall ──────────────────────────────────────────────
ufw allow OpenSSH 2>/dev/null || true
ufw allow 'Nginx Full' 2>/dev/null || true
ufw --force enable 2>/dev/null || true

echo ""
echo "=== DONE ==="
echo ""
echo "Sites running:"
echo "  http://$(curl -s ifconfig.me) (server IP)"
echo ""
echo "Add DNS A-records pointing to this IP:"
for site_path in "$SITES_DIR"/*/; do
  echo "  $(basename $site_path)"
done
echo ""
echo "Then run SSL setup:"
echo "  bash $PROJECT_DIR/ssl.sh"
echo ""

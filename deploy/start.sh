#!/bin/bash
# start.sh - запуск/рестарт всіх сайтів на Ubuntu сервері
# Запускати після деплою або перезавантаження сервера

set -e

echo ""
echo "=== Starting all sites ==="
echo ""

# ── Nginx ──────────────────────────────────────────────────
echo "[1/3] Nginx..."
nginx -t
systemctl enable nginx
systemctl restart nginx
echo "    OK - nginx running"

# ── PM2 (Next.js сайти) ────────────────────────────────────
echo ""
echo "[2/3] Next.js sites (PM2)..."

# irena-beauty.com
if pm2 list | grep -q "irena-beauty"; then
  pm2 restart irena-beauty
  echo "    OK - irena-beauty.com restarted"
else
  cd /var/www/irena-beauty.com
  PORT=3000 pm2 start node_modules/.bin/next --name irena-beauty -- start
  echo "    OK - irena-beauty.com started on :3000"
fi

# Збереження PM2 щоб пережив перезавантаження
pm2 save
pm2 startup | tail -1 | bash 2>/dev/null || true

# ── Static sites (nginx сам роздає) ───────────────────────
echo ""
echo "[3/3] Static sites (served by nginx)..."
echo "    maayan-cosmetics.com  -> /var/www/maayan-cosmetics.com"
echo "    hofit-barbershop.com  -> /var/www/hofit-barbershop.com"
echo "    elibenyizhak.com      -> /var/www/elibenyizhak.com"
echo "    hofit-cosmetics.com   -> /var/www/hofit-cosmetics.com"

# ── Status ─────────────────────────────────────────────────
echo ""
echo "=== STATUS ==="
echo ""
echo "Nginx:"
systemctl is-active nginx

echo ""
echo "PM2:"
pm2 list

echo ""
echo "Sites:"
echo "  https://maayan-cosmetics.com"
echo "  https://hofit-barbershop.com"
echo "  https://irena-beauty.com"
echo "  https://elibenyizhak.com"
echo "  https://hofit-cosmetics.com"
echo ""

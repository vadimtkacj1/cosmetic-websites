#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  server-init.sh — запустити ОДИН РАЗ на сервері             ║
# ║  Переносить всі сайти в /var/www і налаштовує nginx + pm2   ║
# ║  Використання: bash ~/cosmetic-websites/deploy/server-init.sh ║
# ╚══════════════════════════════════════════════════════════════╝
set -e

REPO_DIR="$HOME/cosmetic-websites"
WWW_DIR="/var/www"

echo "╔══════════════════════════════════════════╗"
echo "║  Ініціалізація сервера                   ║"
echo "╚══════════════════════════════════════════╝"

# ── 1. Статичні сайти ─────────────────────────────────────────
echo ""
echo "► [1/5] Копіюємо статичні сайти..."
for DOMAIN in maayan-cosmetics.com hofit-cosmetics.com; do
  rm -rf "$WWW_DIR/$DOMAIN"
  cp -r "$REPO_DIR/sites/$DOMAIN" "$WWW_DIR/$DOMAIN"
  echo "  ✓ $DOMAIN"
done

# ── 2. Next.js сайт ───────────────────────────────────────────
echo ""
echo "► [2/5] Копіюємо irena-beauty.com..."
rm -rf "$WWW_DIR/irena-beauty.com"
cp -r "$REPO_DIR/sites/irena-beauty.com" "$WWW_DIR/irena-beauty.com"

echo "► Встановлення залежностей..."
cd "$WWW_DIR/irena-beauty.com"
npm install

echo "► Білд Next.js..."
npm run build

# ── 3. PM2 ────────────────────────────────────────────────────
echo ""
echo "► [3/5] Налаштування PM2..."
if pm2 list | grep -q "irena-beauty.com"; then
  pm2 delete "irena-beauty.com"
fi
pm2 start node_modules/.bin/next --name "irena-beauty.com" -- start
pm2 save
pm2 startup | tail -1 | bash || true

# ── 4. Nginx конфіги ──────────────────────────────────────────
echo ""
echo "► [4/5] Налаштування Nginx..."
for DOMAIN in irena-beauty.com maayan-cosmetics.com hofit-cosmetics.com; do
  cp "$REPO_DIR/deploy/nginx/sites/$DOMAIN.conf" "/etc/nginx/sites-available/$DOMAIN.conf"
  ln -sf "/etc/nginx/sites-available/$DOMAIN.conf" "/etc/nginx/sites-enabled/$DOMAIN.conf"
  echo "  ✓ $DOMAIN"
done

# Видалити дефолтний конфіг якщо є
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx

# ── 5. Права ─────────────────────────────────────────────────
echo ""
echo "► [5/5] Виставляємо права..."
chown -R www-data:www-data "$WWW_DIR"
chmod -R 755 "$WWW_DIR"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  ✓ Готово! Сайти доступні:               ║"
echo "║    http://irena-beauty.com               ║"
echo "║    http://maayan-cosmetics.com           ║"
echo "║    http://hofit-cosmetics.com            ║"
echo "╚══════════════════════════════════════════╝"

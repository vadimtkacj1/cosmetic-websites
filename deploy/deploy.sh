#!/bin/bash
# ╔══════════════════════════════════════════════════════════╗
# ║  deploy.sh — розгортання одного сайту                    ║
# ║  Використання: bash deploy.sh maayan-cosmetics.com       ║
# ╚══════════════════════════════════════════════════════════╝
set -e

source "$(dirname "$0")/config.sh"

DOMAIN=$1

if [[ -z "$DOMAIN" ]]; then
  echo "Вкажи домен. Доступні:"
  for d in "${!SITES[@]}"; do echo "  $d"; done
  echo ""
  echo "Приклад: bash deploy.sh maayan-cosmetics.com"
  exit 1
fi

LOCAL_PATH="${SITES[$DOMAIN]}"

if [[ -z "$LOCAL_PATH" ]]; then
  echo "Домен '$DOMAIN' не знайдено в config.sh"
  exit 1
fi

NGINX_CONF="$(dirname "$0")/nginx/sites/$DOMAIN.conf"
SSH_OPTS=""
[[ -n "$SSH_KEY" ]] && SSH_OPTS="-i $SSH_KEY"

# Визначаємо тип сайту (Next.js якщо є package.json з next)
IS_NEXTJS=false
if [[ -f "$LOCAL_PATH/package.json" ]] && grep -q '"next"' "$LOCAL_PATH/package.json"; then
  IS_NEXTJS=true
fi

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║  Деплой: $DOMAIN"
[[ "$IS_NEXTJS" == true ]] && echo "║  Тип: Next.js" || echo "║  Тип: Static (HTML)"
echo "╚═══════════════════════════════════════════╝"

# ── 1. Синхронізація файлів ────────────────────────────────
echo "► [1/4] Синхронізація файлів..."
rsync -avz --progress \
  --exclude=".git" \
  --exclude="node_modules" \
  --exclude=".next" \
  --exclude="deploy" \
  --exclude="nginx-config" \
  --exclude=".claude" \
  --exclude="_scraped_spans" \
  -e "ssh $SSH_OPTS" \
  "$LOCAL_PATH/" \
  "$SERVER_USER@$SERVER_IP:/var/www/$DOMAIN/"

# ── 2. Nginx конфіг ────────────────────────────────────────
echo "► [2/4] Копіюємо nginx конфіг..."
scp $SSH_OPTS "$NGINX_CONF" "$SERVER_USER@$SERVER_IP:/etc/nginx/sites-available/$DOMAIN.conf"

ssh $SSH_OPTS $SERVER_USER@$SERVER_IP bash <<REMOTE
set -e

chown -R www-data:www-data /var/www/$DOMAIN
chmod -R 755 /var/www/$DOMAIN

ln -sf /etc/nginx/sites-available/$DOMAIN.conf /etc/nginx/sites-enabled/$DOMAIN.conf

# ── 3. Якщо Next.js — install + build ─────────────────────
if [[ "$IS_NEXTJS" == true ]]; then
  echo "► [3/4] npm install + build (Next.js)..."
  cd /var/www/$DOMAIN
  npm install --production=false
  npm run build

  echo "► Запускаємо / перезапускаємо PM2..."
  if pm2 list | grep -q "$DOMAIN"; then
    pm2 restart "$DOMAIN"
  else
    PORT=3000 pm2 start node_modules/.bin/next --name "$DOMAIN" -- start
  fi
  pm2 save
else
  echo "► [3/4] Статичний сайт — build не потрібен."
fi

# ── 4. SSL ────────────────────────────────────────────────
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  echo "► [4/4] Отримуємо SSL сертифікат..."

  cat > /etc/nginx/sites-available/${DOMAIN}-temp.conf <<EOF2
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root /var/www/$DOMAIN;
    location /.well-known/acme-challenge/ { root /var/www/$DOMAIN; }
}
EOF2
  ln -sf /etc/nginx/sites-available/${DOMAIN}-temp.conf /etc/nginx/sites-enabled/${DOMAIN}-temp.conf
  nginx -t && systemctl reload nginx

  certbot certonly --webroot -w /var/www/$DOMAIN \
    -d $DOMAIN -d www.$DOMAIN \
    --non-interactive --agree-tos -m $ADMIN_EMAIL

  rm -f /etc/nginx/sites-enabled/${DOMAIN}-temp.conf
  rm -f /etc/nginx/sites-available/${DOMAIN}-temp.conf
else
  echo "► [4/4] SSL сертифікат вже є."
fi

nginx -t && systemctl reload nginx

echo ""
echo "✓ $DOMAIN успішно задеплоєно!"
echo "  https://$DOMAIN"
REMOTE

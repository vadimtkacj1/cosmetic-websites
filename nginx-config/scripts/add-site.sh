#!/bin/bash
# ===========================================
# Скрипт добавления нового сайта на сервер
# Использование:
#   ./add-site.sh static example.com /var/www/example.com
#   ./add-site.sh nextjs example.com /var/www/example.com 3000
# ===========================================

TYPE=$1       # static | nextjs
DOMAIN=$2     # example.com
WEBROOT=$3    # /var/www/example.com
PORT=$4       # только для nextjs: 3000, 3001, ...

if [[ -z "$TYPE" || -z "$DOMAIN" || -z "$WEBROOT" ]]; then
  echo "Использование: $0 <static|nextjs> <domain> <webroot> [port]"
  exit 1
fi

SITES_AVAILABLE="/etc/nginx/sites-available"
SITES_ENABLED="/etc/nginx/sites-enabled"
CONF_FILE="$SITES_AVAILABLE/$DOMAIN.conf"

echo "► Создаём директорию $WEBROOT"
mkdir -p "$WEBROOT"
chown -R www-data:www-data "$WEBROOT"

# ── Генерируем конфиг ──────────────────────────────────────

if [[ "$TYPE" == "static" ]]; then
cat > "$CONF_FILE" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root $WEBROOT;
    index index.html;

    access_log /var/log/nginx/$DOMAIN.access.log;
    error_log  /var/log/nginx/$DOMAIN.error.log;

    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp|woff|woff2|ttf|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
}
EOF

elif [[ "$TYPE" == "nextjs" ]]; then
  if [[ -z "$PORT" ]]; then
    echo "Для nextjs нужен PORT. Пример: $0 nextjs example.com /var/www/example.com 3001"
    exit 1
  fi

cat > "$CONF_FILE" <<EOF
upstream ${DOMAIN//./_} {
    server 127.0.0.1:$PORT;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    access_log /var/log/nginx/$DOMAIN.access.log;
    error_log  /var/log/nginx/$DOMAIN.error.log;

    location /_next/static/ {
        alias $WEBROOT/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /public/ {
        alias $WEBROOT/public/;
        expires 30d;
    }

    location / {
        proxy_pass http://${DOMAIN//./_};
        proxy_http_version 1.1;
        proxy_set_header Host              \$host;
        proxy_set_header X-Real-IP         \$remote_addr;
        proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade           \$http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_read_timeout 60s;
    }

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
}
EOF
fi

# ── Включаем сайт ─────────────────────────────────────────
ln -sf "$CONF_FILE" "$SITES_ENABLED/$DOMAIN.conf"
echo "► Конфиг создан: $CONF_FILE"

# ── SSL сертификат ─────────────────────────────────────────
echo ""
echo "► Получаем SSL сертификат для $DOMAIN..."
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m admin@$DOMAIN

# ── Перезагрузка Nginx ─────────────────────────────────────
nginx -t && systemctl reload nginx

echo ""
echo "✓ Сайт $DOMAIN добавлен!"
[[ "$TYPE" == "nextjs" ]] && echo "  Не забудь добавить приложение в pm2/ecosystem.config.js (PORT: $PORT)"

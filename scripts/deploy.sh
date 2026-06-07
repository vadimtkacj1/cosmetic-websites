#!/bin/bash
# Runs on the server via GitHub Actions SSH.
# Handles everything automatically: nginx, SSL, pm2, build.
set -e

REPO_DIR="/var/www/cosmetic-websites"
SITES_DIR="$REPO_DIR/sites"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-admin@example.com}"

cd "$REPO_DIR"
git pull

# ---------------------------------------------------------------------------
detect_type() {
  local site_dir=$1
  if [ -f "$site_dir/site.config.json" ]; then
    jq -r '.type' "$site_dir/site.config.json"
  elif [ -f "$site_dir/package.json" ] && grep -q '"next"' "$site_dir/package.json"; then
    echo "nextjs"
  elif [ -f "$site_dir/package.json" ]; then
    echo "react"
  else
    echo "static"
  fi
}

get_port() {
  local site_dir=$1
  local domain=$2
  if [ -f "$site_dir/site.config.json" ]; then
    local p
    p=$(jq -r '.port // empty' "$site_dir/site.config.json")
    [ -n "$p" ] && echo "$p" && return
  fi
  # Auto-assign: hash domain to port 3100-3999
  echo $(( 3100 + $(echo "$domain" | cksum | cut -d' ' -f1) % 900 ))
}

get_webroot() {
  local site_dir=$1
  local type=$2
  if [ -f "$site_dir/site.config.json" ]; then
    local wr
    wr=$(jq -r '.webroot // empty' "$site_dir/site.config.json")
    [ -n "$wr" ] && echo "$wr" && return
  fi
  case $type in
    react) echo "dist" ;;
    *)     echo "." ;;
  esac
}

# ---------------------------------------------------------------------------
ensure_nginx() {
  local domain=$1
  local type=$2
  local port=$3
  local dest=$4
  local webroot=$5

  if [ -f "$NGINX_AVAILABLE/$domain" ]; then
    return 0
  fi

  echo "  [nginx] Створюємо конфіг для $domain (type=$type)"

  if [ "$type" = "nextjs" ]; then
    sudo tee "$NGINX_AVAILABLE/$domain" > /dev/null << EOF
server {
    listen 80;
    server_name $domain www.$domain;

    location / {
        proxy_pass http://127.0.0.1:$port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
  else
    sudo tee "$NGINX_AVAILABLE/$domain" > /dev/null << EOF
server {
    listen 80;
    server_name $domain www.$domain;
    root $dest/$webroot;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
  fi

  sudo ln -sf "$NGINX_AVAILABLE/$domain" "$NGINX_ENABLED/$domain"
  sudo nginx -t
  sudo systemctl reload nginx

  # SSL — отримуємо сертифікат
  echo "  [ssl] Отримуємо сертифікат для $domain"
  sudo certbot --nginx \
    -d "$domain" -d "www.$domain" \
    --non-interactive --agree-tos \
    -m "$CERTBOT_EMAIL" \
    --redirect || echo "  [ssl] ⚠ certbot не вдалось (DNS ще не налаштований?)"
}

# ---------------------------------------------------------------------------
deploy_static() {
  local domain=$1 site_dir=$2 dest=$3
  echo "  [html] Копіюємо файли"
  rsync -a --delete \
    --exclude='.git' \
    --exclude='site.config.json' \
    "$site_dir/" "$dest/"
}

deploy_react() {
  local domain=$1 site_dir=$2 dest=$3 webroot=$4
  echo "  [react] npm install + build"
  rsync -a --delete \
    --exclude='.git' --exclude='node_modules' --exclude='dist' \
    "$site_dir/" "$dest/"
  cd "$dest"
  npm install --legacy-peer-deps
  npm run build
  cd "$REPO_DIR"
}

deploy_nextjs() {
  local domain=$1 site_dir=$2 dest=$3 port=$4
  echo "  [next] npm install + build + pm2"
  rsync -a --delete \
    --exclude='.git' --exclude='node_modules' --exclude='.next' \
    "$site_dir/" "$dest/"
  cd "$dest"
  npm install --legacy-peer-deps
  PORT=$port npm run build
  if pm2 describe "$domain" > /dev/null 2>&1; then
    PORT=$port pm2 restart "$domain"
  else
    PORT=$port pm2 start "npm" --name "$domain" -- start
  fi
  pm2 save
  cd "$REPO_DIR"
}

# ---------------------------------------------------------------------------
for site_dir in "$SITES_DIR"/*/; do
  domain=$(basename "$site_dir")
  dest="/var/www/$domain"
  type=$(detect_type "$site_dir")
  port=$(get_port "$site_dir" "$domain")
  webroot=$(get_webroot "$site_dir" "$type")

  echo ""
  echo "▶ $domain  [$type]"
  mkdir -p "$dest"

  ensure_nginx "$domain" "$type" "$port" "$dest" "$webroot"

  case $type in
    nextjs) deploy_nextjs "$domain" "$site_dir" "$dest" "$port" ;;
    react)  deploy_react  "$domain" "$site_dir" "$dest" "$webroot" ;;
    *)      deploy_static "$domain" "$site_dir" "$dest" ;;
  esac

  echo "  ✓ $domain задеплоєно"
done

echo ""
echo "✅ Всі сайти задеплоєно"

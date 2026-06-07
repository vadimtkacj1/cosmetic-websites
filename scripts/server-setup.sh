#!/bin/bash
# Run this ONCE on the server to prepare it for auto-deployment.
# After this, you never need to SSH in again.
set -e

DEPLOY_USER="${1:-deploy}"

echo "=== Налаштування сервера для автодеплою ==="
echo "Юзер деплою: $DEPLOY_USER"

# 1. Потрібні пакети
apt-get update -y
apt-get install -y nginx certbot python3-certbot-nginx jq rsync

# 2. Node.js 20 (якщо ще не встановлено)
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# 3. PM2
npm install -g pm2
pm2 startup systemd -u "$DEPLOY_USER" --hp "/home/$DEPLOY_USER"

# 4. sudo права для деплой-юзера — тільки те що треба
cat > /etc/sudoers.d/deploy-nginx << EOF
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/tee /etc/nginx/sites-available/*
$DEPLOY_USER ALL=(ALL) NOPASSWD: /bin/ln -sf /etc/nginx/sites-available/* /etc/nginx/sites-enabled/*
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/sbin/nginx -t
$DEPLOY_USER ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/certbot --nginx *
EOF
chmod 440 /etc/sudoers.d/deploy-nginx

# 5. Папка для сайтів
mkdir -p /var/www
chown -R "$DEPLOY_USER:$DEPLOY_USER" /var/www

# 6. Клонуємо репо (якщо ще не)
REPO_URL="${REPO_URL:-https://github.com/YOUR_USER/YOUR_REPO.git}"
if [ ! -d /var/www/cosmetic-websites ]; then
  git clone "$REPO_URL" /var/www/cosmetic-websites
  chown -R "$DEPLOY_USER:$DEPLOY_USER" /var/www/cosmetic-websites
fi

# 7. Видаляємо дефолтний nginx сайт
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "✅ Сервер готовий до автодеплою"
echo ""
echo "Далі:"
echo "  1. Додай GitHub секрети: SERVER_IP, SERVER_USER, SSH_PRIVATE_KEY"
echo "  2. Для кожного нового сайту — вкажи DNS на цей сервер"
echo "  3. Push до main — система зробить все сама"

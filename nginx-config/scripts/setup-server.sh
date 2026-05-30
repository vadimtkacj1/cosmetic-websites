#!/bin/bash
# ===========================================
# Первоначальная настройка сервера
# Запускать ОДИН РАЗ после создания VPS
# ===========================================

set -e

echo "=== 1. Обновление системы ==="
apt update && apt upgrade -y

echo "=== 2. Установка Nginx ==="
apt install -y nginx
systemctl enable nginx
systemctl start nginx

echo "=== 3. Установка Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "=== 4. Установка PM2 ==="
npm install -g pm2
pm2 startup systemd -u root --hp /root

echo "=== 5. Установка Certbot (SSL) ==="
apt install -y certbot python3-certbot-nginx

echo "=== 6. Настройка Firewall ==="
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "=== 7. Создание структуры директорий ==="
mkdir -p /var/www
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled
rm -f /etc/nginx/sites-enabled/default

echo "=== 8. Копируем nginx.conf ==="
cp nginx.conf /etc/nginx/nginx.conf
nginx -t && systemctl reload nginx

echo ""
echo "✓ Сервер готов!"
echo ""
echo "Следующие шаги:"
echo "  1. Добавить сайт:  ./add-site.sh static mysite.com /var/www/mysite.com"
echo "  2. Или Next.js:    ./add-site.sh nextjs mysite.com /var/www/mysite.com 3000"
echo "  3. Запустить PM2:  pm2 start pm2/ecosystem.config.js"
echo "  4. Сохранить PM2:  pm2 save"

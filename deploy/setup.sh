#!/bin/bash
# ╔══════════════════════════════════════════════════════════╗
# ║  setup.sh — запустити ОДИН РАЗ на новому VPS             ║
# ║  Використання: bash setup.sh                             ║
# ╚══════════════════════════════════════════════════════════╝
set -e

source "$(dirname "$0")/config.sh"

SSH_CMD="ssh"
[[ -n "$SSH_KEY" ]] && SSH_CMD="ssh -i $SSH_KEY"

echo "► Підключаємось до $SERVER_USER@$SERVER_IP..."

$SSH_CMD $SERVER_USER@$SERVER_IP bash <<REMOTE
set -e

echo "=== [1/6] Оновлення системи ==="
apt update -q && apt upgrade -y -q

echo "=== [2/6] Встановлення Nginx ==="
apt install -y -q nginx
systemctl enable nginx
systemctl start nginx

echo "=== [3/6] Встановлення Certbot (SSL) ==="
apt install -y -q certbot python3-certbot-nginx

echo "=== [4/6] Налаштування Firewall ==="
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "=== [5/6] Підготовка директорій ==="
mkdir -p /var/www/maayan-cosmetics.com
mkdir -p /var/www/elibenyizhak.com
mkdir -p /var/www/hofit-cosmetics.com
mkdir -p /var/www/hofit-barbershop.com
mkdir -p /var/www/irena-beauty.com
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled
rm -f /etc/nginx/sites-enabled/default

echo "=== [6/6] Встановлення прав ==="
chown -R www-data:www-data /var/www
chmod -R 755 /var/www

echo ""
echo "✓ Сервер готовий!"
echo "  Тепер запусти: bash deploy-all.sh"
REMOTE

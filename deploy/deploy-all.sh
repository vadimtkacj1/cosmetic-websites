#!/bin/bash
# ╔══════════════════════════════════════════════════════════╗
# ║  deploy-all.sh — розгортання ВСІХ сайтів                 ║
# ║  Використання: bash deploy-all.sh                        ║
# ╚══════════════════════════════════════════════════════════╝
set -e

source "$(dirname "$0")/config.sh"

SCRIPT_DIR="$(dirname "$0")"

# Копіюємо головний nginx.conf на сервер
SSH_OPTS=""
[[ -n "$SSH_KEY" ]] && SSH_OPTS="-i $SSH_KEY"

echo "► Копіюємо nginx.conf..."
scp $SSH_OPTS "$SCRIPT_DIR/nginx/nginx.conf" "$SERVER_USER@$SERVER_IP:/etc/nginx/nginx.conf"

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║  Деплой всіх сайтів                   ║"
echo "╚═══════════════════════════════════════╝"

FAILED=()

for DOMAIN in "${!SITES[@]}"; do
  echo ""
  echo "━━━ $DOMAIN ━━━"
  if bash "$SCRIPT_DIR/deploy.sh" "$DOMAIN"; then
    echo "  ✓ OK"
  else
    echo "  ✗ ПОМИЛКА"
    FAILED+=("$DOMAIN")
  fi
done

echo ""
echo "╔═══════════════════════════════════════╗"
if [[ ${#FAILED[@]} -eq 0 ]]; then
  echo "║  ✓ Всі сайти задеплоєно успішно!      ║"
else
  echo "║  Деякі сайти не задеплоїлись:         ║"
  for f in "${FAILED[@]}"; do
    echo "║    ✗ $f"
  done
fi
echo "╚═══════════════════════════════════════╝"
echo ""
echo "Сайти:"
echo "  https://maayan-cosmetics.com"
echo "  https://elibenyizhak.com"
echo "  https://hofit-cosmetics.com"
echo "  https://hofit-barbershop.com"
echo "  https://irena-beauty.com"
echo "  https://karin-cohen.com"

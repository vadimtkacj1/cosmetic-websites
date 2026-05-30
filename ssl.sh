#!/bin/bash
# Отримання SSL сертифікатів для всіх доменів
# Запускати ПІСЛЯ того як DNS вказує на сервер
# cd ~/cosmetic-websites && bash ssl.sh

EMAIL="admin@example.com"   # ← зміни на свій email

DOMAINS=(
  "maayan-cosmetics.com"
  "hofit-barbershop.com"
  "irena-beauty.com"
  "elibenyizhak.com"
  "hofit-cosmetics.com"
)

for domain in "${DOMAINS[@]}"; do
  if [ -d "/var/www/$domain" ]; then
    echo "Getting SSL for $domain..."
    certbot --nginx -d "$domain" -d "www.$domain" \
      --non-interactive --agree-tos -m "$EMAIL" \
      --redirect || echo "  SKIP: DNS not ready for $domain"
    echo ""
  fi
done

systemctl reload nginx
echo "=== SSL setup complete ==="

#!/bin/bash
# ╔══════════════════════════════════════════╗
# ║  НАЛАШТУВАННЯ СЕРВЕРА — заповни один раз ║
# ╚══════════════════════════════════════════╝

SERVER_IP="1.2.3.4"              # IP твого VPS
SERVER_USER="root"               # SSH користувач
SSH_KEY="~/.ssh/id_rsa"          # шлях до SSH ключа (або залиш порожнім)
ADMIN_EMAIL="admin@example.com"  # email для SSL сертифікатів

# Домени та папки з сайтами на ЛОКАЛЬНОМУ комп'ютері
# Кожен домен = своя папка в sites/
declare -A SITES=(
  ["maayan-cosmetics.com"]="C:/Users/vadim/Downloads/maayan/sites/maayan-cosmetics.com"
  ["elibenyizhak.com"]="C:/Users/vadim/Downloads/maayan/sites/elibenyizhak.com"
  ["hofit-cosmetics.com"]="C:/Users/vadim/Downloads/maayan/sites/hofit-cosmetics.com"
  ["hofit-barbershop.com"]="C:/Users/vadim/Downloads/maayan/sites/hofit-barbershop.com"
  ["irena-beauty.com"]="C:/Users/vadim/Downloads/maayan/sites/irena-beauty.com"
)

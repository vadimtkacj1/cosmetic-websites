# Server & Project Structure

## Local (твій комп'ютер)

```
sites/
│
├── maayan-cosmetics.com/          ← static site (index.html)
│   ├── index.html
│   ├── css/
│   │   ├── tokens.css
│   │   └── site.css
│   └── assets/
│       ├── logo.svg
│       ├── icons/
│       ├── images/
│       └── videos/
│
├── elibenyizhak.com/              ← static site (index.html)
│   ├── index.html
│   ├── css/
│   └── assets/
│
├── hofit-cosmetics.com/           ← static site (index.html)
│   ├── index.html
│   ├── css/
│   └── assets/
│
├── irena-beauty.com/              ← static site (index.html)
│   ├── index.html
│   ├── css/
│   └── assets/
│
└── some-nextjs-site.com/          ← Next.js site
    ├── package.json
    ├── next.config.js
    ├── app/
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    ├── public/
    └── .next/                     ← після npm run build


deploy/                            ← скрипти деплою (не йдуть на сервер)
├── config.sh
├── setup.sh
├── deploy.sh
├── deploy-all.sh
└── nginx/
    ├── nginx.conf
    └── sites/
        ├── maayan-cosmetics.com.conf
        ├── elibenyizhak.com.conf
        ├── hofit-cosmetics.com.conf
        ├── irena-beauty.com.conf
        └── some-nextjs-site.com.conf
```

---

## Server (VPS /var/www/)

```
/var/www/
│
├── maayan-cosmetics.com/          ← static: rsync копіює index.html + assets
│   ├── index.html
│   ├── css/
│   └── assets/
│
├── elibenyizhak.com/
│   ├── index.html
│   ├── css/
│   └── assets/
│
├── hofit-cosmetics.com/
│   ├── index.html
│   ├── css/
│   └── assets/
│
├── irena-beauty.com/
│   ├── index.html
│   ├── css/
│   └── assets/
│
└── some-nextjs-site.com/          ← Next.js: rsync + npm install + build на сервері
    ├── package.json
    ├── .next/
    ├── app/
    └── public/


/etc/nginx/
├── nginx.conf
├── sites-available/
│   ├── maayan-cosmetics.com.conf
│   ├── elibenyizhak.com.conf
│   ├── hofit-cosmetics.com.conf
│   ├── irena-beauty.com.conf
│   └── some-nextjs-site.com.conf
└── sites-enabled/                 ← symlinks до sites-available
    └── (ті самі файли)


/etc/letsencrypt/live/             ← SSL сертифікати (Certbot)
├── maayan-cosmetics.com/
├── elibenyizhak.com/
├── hofit-cosmetics.com/
├── irena-beauty.com/
└── some-nextjs-site.com/
```

---

## Nginx — різниця між типами сайтів

### Static (index.html)
```
Браузер → Nginx → /var/www/domain/index.html
```
Nginx сам віддає файли. Node.js не потрібен.

### Next.js
```
Браузер → Nginx → PM2 (Node.js :3000) → Next.js app
```
Nginx проксіює запити до Node.js процесу керованого PM2.

---

## PM2 — тільки для Next.js сайтів

```
pm2/
└── ecosystem.config.js

# Кожен Next.js сайт — окремий процес на своєму порту:
# some-nextjs-site.com  →  PORT 3000
# another-nextjs.com    →  PORT 3001
# crm.example.com       →  PORT 3002
```

---

## Деплой — команди

```bash
# 1. Перший раз налаштувати сервер
bash deploy/setup.sh

# 2. Задеплоїти один статичний сайт
bash deploy/deploy.sh maayan-cosmetics.com

# 3. Задеплоїти всі сайти
bash deploy/deploy-all.sh
```

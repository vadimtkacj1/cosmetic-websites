// PM2 — менеджер процессов для Next.js сайтов
// Запуск:  pm2 start ecosystem.config.js
// Статус:  pm2 status
// Логи:    pm2 logs
// Рестарт: pm2 restart all

module.exports = {
  apps: [
    // ─── Next.js сайт 1 ───────────────────────────────────
    {
      name: "site-example",           // pm2 list покажет это имя
      cwd: "/var/www/example.com",    // путь к папке сайта
      script: "node_modules/.bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,                   // уникальный порт (совпадает с nginx upstream)
      },
      instances: 1,                   // 1 на RAM экономию; 2 если нужна надёжность
      exec_mode: "fork",
      max_memory_restart: "400M",     // перезапуск если > 400 MB
      restart_delay: 3000,
    },

    // ─── Next.js сайт 2 ───────────────────────────────────
    {
      name: "site-aiterra",
      cwd: "/var/www/aiterra.com",
      script: "node_modules/.bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3001,                   // следующий порт
      },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "400M",
      restart_delay: 3000,
    },

    // ─── Next.js сайт 3 (CRM — больше памяти) ─────────────
    {
      name: "site-crm",
      cwd: "/var/www/crm.example.com",
      script: "node_modules/.bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
        DATABASE_URL: "postgresql://user:pass@localhost:5432/crm_db",
      },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "600M",
      restart_delay: 3000,
    },

    // ─── Добавляй новые сайты по этому шаблону ────────────
    // {
    //   name: "site-NEW",
    //   cwd: "/var/www/newsite.com",
    //   script: "node_modules/.bin/next",
    //   args: "start",
    //   env: { NODE_ENV: "production", PORT: 3003 },
    //   instances: 1,
    //   exec_mode: "fork",
    //   max_memory_restart: "400M",
    //   restart_delay: 3000,
    // },
  ],
};

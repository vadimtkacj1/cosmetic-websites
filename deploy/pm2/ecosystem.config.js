// PM2 — менеджер процесів для Next.js сайтів
// Запуск:   pm2 start ecosystem.config.js
// Статус:   pm2 status
// Логи:     pm2 logs
// Рестарт:  pm2 restart all
// Зберегти: pm2 save

module.exports = {
  apps: [

    // ─── irena-beauty.com (glam_nails) ────────────────────────
    {
      name: "irena-beauty",
      cwd: "/var/www/irena-beauty.com",
      script: "node_modules/.bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "500M",
      restart_delay: 3000,
    },

    // ─── Шаблон для нового Next.js сайту ──────────────────────
    // {
    //   name: "new-site",
    //   cwd: "/var/www/new-site.com",
    //   script: "node_modules/.bin/next",
    //   args: "start",
    //   env: { NODE_ENV: "production", PORT: 3001 },
    //   instances: 1,
    //   exec_mode: "fork",
    //   max_memory_restart: "500M",
    //   restart_delay: 3000,
    // },

  ],
};

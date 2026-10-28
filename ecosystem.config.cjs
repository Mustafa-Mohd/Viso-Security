/** PM2 process file — run from repo root: npm run pm2:start */
module.exports = {
  apps: [
    {
      name: "viso-api",
      cwd: "./backend",
      script: "npm",
      args: "run start",
      autorestart: true,
      watch: false,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

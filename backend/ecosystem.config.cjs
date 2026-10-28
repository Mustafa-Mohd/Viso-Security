/** Run from `backend/`: `npm run pm2:backend` — same as `npm run dev`. */
module.exports = {
  apps: [
    {
      name: "viso-api",
      cwd: __dirname,
      script: "npm",
      args: "run dev",
      interpreter: "none",
      autorestart: true,
      max_restarts: 10,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

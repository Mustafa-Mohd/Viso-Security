/** PM2: API server (chat + email). Same as `npm run dev:backend`. */
module.exports = {
  apps: [
    {
      name: "viso-api",
      cwd: __dirname,
      script: "npm",
      args: "run dev:backend",
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

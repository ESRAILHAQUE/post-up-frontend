module.exports = {
  apps: [
    {
      name: "guestpostup-frontend",
      script: "npm",
      args: "start",
      cwd: "/var/www/guestpostup/frontend",
      env: {
        PORT: "3002",
        NODE_ENV: "production",
      },
      instances: 1,
      exec_mode: "fork",
    },
  ],
};


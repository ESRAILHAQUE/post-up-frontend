module.exports = {
  apps: [
    {
      name: "guestpostup-frontend",
      script: "npm",
      args: "start",
      env: {
        PORT: 3002,
        NODE_ENV: "production",
      },
    },
  ],
};


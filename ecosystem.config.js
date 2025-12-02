module.exports = {
  apps: [
    {
      name: "guestpostup-frontend",
      script: "npx",
      args: "next start -p 3002",
      env: {
        PORT: 3002,
        NODE_ENV: "production",
      },
    },
  ],
};


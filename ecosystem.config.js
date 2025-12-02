module.exports = {
  apps: [
    {
      name: "guestpostup-frontend",
      script: "node_modules/.bin/next",
      args: ["start", "-p", "3002"],
      env: {
        PORT: "3002",
        NODE_ENV: "production",
      },
      interpreter: "none",
    },
  ],
};


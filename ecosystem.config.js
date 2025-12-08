module.exports = {
  apps: [
    {
      name: "guestpostup-frontend",
      script: "npm",
      args: "start",
      env: {
        PORT: "3002",
        NODE_ENV: "production",
      },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "800M", // Auto-restart if memory exceeds 800MB
      min_uptime: "30s", // Minimum uptime before considering app stable
      max_restarts: 5, // Maximum restarts in 1 minute
      restart_delay: 5000, // Delay between restarts (5 seconds)
      kill_timeout: 10000, // Graceful shutdown timeout
      listen_timeout: 15000, // Wait for app to listen
      autorestart: true,
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_file: "./logs/pm2-combined.log",
      time: true,
      merge_logs: true,
    },
  ],
};


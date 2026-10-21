module.exports = {
  apps: [
    {
      name: 'spcsolar-backend',
      script: 'Backend/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      exp_backoff_restart_delay: 200,
      max_restarts: 15,
      watch: false,
      max_memory_restart: '800M',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};

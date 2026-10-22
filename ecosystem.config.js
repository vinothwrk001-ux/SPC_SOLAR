module.exports = {
  apps: [
    {
      name: 'spcsolar-backend',
      script: 'Backend/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      exp_backoff_restart_delay: 200,
      max_restarts: 15,
      watch: false,
      max_memory_restart: '800M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};

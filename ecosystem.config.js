module.exports = {
  apps : [
    {
      name: 'server',
      script: 'server/src/app.js',
      autorestart: true,
      watch: false,
      exec_mode: 'cluster',
      instances: 'max',
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'client',
      exec_mode: 'cluster',
      instances: 'max',
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'dev',
      cwd: './client',
    }
  ]
};

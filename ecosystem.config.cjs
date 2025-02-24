module.exports = {
  apps: [
    {
      // 개발용
      name: 'korea-weather-nowcasting-dev',
      script: './dist/index.js',
      instances: 1, // 단일 쓰레드

      watch: ['dist'],
      ignore_watch: ['node_modules', 'logs'],
    },
    {
      // 배포용
      name: 'korea-weather-nowcasting-pro',
      script: './dist/index.js',
      instances: -1, // 클러스터 모드
      watch: ['dist'],
      ignore_watch: ['node_modules', 'logs'],
    },
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};

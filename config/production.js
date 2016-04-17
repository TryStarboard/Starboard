'use strict';

const pkg = require('../package.json');
const join = require('path').join;

module.exports = {
  cookie: {
    keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2],
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
  },
  postgres: {
    host: 'postgres',
    port: process.env.POSTGRES_PORT_5432_TCP_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
  },
  koa: {
    publicDir: join(__dirname, '../public'),
    templateDir: join(__dirname, '../template'),
    staticDir: join(__dirname, '../static'),
  },
  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  },
  mixpanel: {
    token: null,
  },
  logging: {
    Logentries: {
      token: process.env.LOG_ENTRIES_TOKEN,
    },
    Sentry: {
      dsn: process.env.SENTRY_DSN,
      options: {
        release: pkg.version,
      }
    },
  },
};

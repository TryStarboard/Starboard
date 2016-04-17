'use strict';

const join = require('path').join;

module.exports = {
  cookie: {
    keys: ['keyboard cat', 'starboard'],
  },
  redis: {
    host: 'redis',
    port: process.env.REDIS_PORT_6379_TCP_PORT,
  },
  postgres: {
    host: 'postgres',
    port: process.env.POSTGRES_PORT_5432_TCP_PORT,
    database: process.env.POSTGRES_ENV_POSTGRES_DB,
    user: process.env.POSTGRES_ENV_POSTGRES_USER,
    password: process.env.POSTGRES_ENV_POSTGRES_PASSWORD,
  },
  koa: {
    publicDir: join(__dirname, '../public'),
    templateDir: join(__dirname, '../template'),
    staticDir: join(__dirname, '../static'),
  },
  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:10000/github-back'
  },
  mixpanel: {
    token: null,
  },
};

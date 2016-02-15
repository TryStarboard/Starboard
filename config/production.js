'use strict';

const join = require('path').join;

module.exports = {
  cookie: {
    keys: ['keyboard cat', 'starboard'],
  },
  redis: {
    host: process.env.REDIS_PORT_6379_TCP_ADDR,
    port: process.env.REDIS_PORT_6379_TCP_PORT,
  },
  postgres: {
    host: process.env.POSTGRES_PORT_5432_TCP_ADDR,
    port: process.env.POSTGRES_PORT_5432_TCP_PORT,
    database: 'dev-db',
    user: 'dev',
    password: '1234',
  },
  koa: {
    publicDir: join(__dirname, '../public'),
    templateDir: join(__dirname, '../template'),
  },
  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:10000/github-back'
  }
};

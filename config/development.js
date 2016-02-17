'use strict';

const url = require('url');
const join = require('path').join;

const dockerConn = url.parse(process.env.DOCKER_HOST || 'tcp://localhost');

module.exports = {
  cookie: {
    keys: ['keyboard cat', 'starboard'],
  },
  redis: {
    host: dockerConn.hostname,
    port: 6379,
  },
  postgres: {
    host: dockerConn.hostname,
    port: 5432,
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
    callbackURL: 'http://localhost:10010/github-back'
  },
  logging: {
    Console: {
      colorize: true,
      timestamp: true,
      prettyPrint: true,
      humanReadableUnhandledException: true,
      json: true,
      showLevel: true,
    }
  },
};

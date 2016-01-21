'use strict';

const url = require('url');

const dockerConn = url.parse(process.env.DOCKER_HOST);

module.exports = {
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
  }
};

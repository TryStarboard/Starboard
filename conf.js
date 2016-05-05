'use strict';

const convict = require('convict');

const conf = convict({
  postgres: {
    host: {
      env: 'POSTGRES_HOST',
      default: null,
      format: mustDefine,
    },
    database: {
      env: 'POSTGRES_DB',
      default: null,
      format: mustDefine,
    },
    user: {
      env: 'POSTGRES_USER',
      default: null,
      format: mustDefine,
    },
    password: {
      env: 'POSTGRES_PASS',
      default: null,
      format: mustDefine,
    },
    port: {
      env: 'POSTGRES_PORT',
      default: null,
      format: mustDefine,
    },
  },
});

conf.validate({strict: true});

module.exports = conf;

function mustDefine(val) {
  if (!val) {
    throw new Error('must be defined');
  }
}

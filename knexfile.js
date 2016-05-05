'use strict';

const conf = require('./conf');

module.exports = {
  [process.env.NODE_ENV || 'development']: {
    client: 'pg',
    connection: conf.get('postgres'),
  },
};

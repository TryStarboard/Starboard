'use strict';

const config = require('config');

module.exports = {
  [process.env.NODE_ENV || 'development']: {
    client: 'pg',
    connection: config.get('postgres'),
  },
};

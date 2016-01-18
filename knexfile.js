'use strict';

const config = require('config');

module.exports = {
  development: {
    client: 'pg',
    connection: config.get('postgres'),
  },
};

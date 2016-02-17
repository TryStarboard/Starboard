'use strict';

const config = require('config');

module.exports = {
  [config.get('currentEnv')]: {
    client: 'pg',
    connection: config.get('postgres'),
  },
};

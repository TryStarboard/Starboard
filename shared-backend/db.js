'use strict';

const knex = require('knex');
const config = require('config');

const db = knex({
  client: 'pg',
  connection: config.get('postgres'),
});

// db.on('query', console.log);
// db.on('query-error', console.log);

module.exports = db;

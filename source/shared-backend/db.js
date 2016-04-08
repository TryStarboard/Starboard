import knex from 'knex';
import config from 'config';

const db = knex({
  client: 'pg',
  connection: config.get('postgres'),
});

// db.on('query', console.log);
// db.on('query-error', console.log);

export {db as default};

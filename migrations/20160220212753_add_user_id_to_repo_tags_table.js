'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.table('repo_tags', (table) => {
    table.string('user_id');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('repo_tags', (table) => {
    table.dropColumn('user_id');
  });
};

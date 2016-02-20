'use strict';

exports.up = (knex, Promise) => {
  return knex.schema.table('users', function (table) {
    table.unique(['github_id']);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.table('users', function (table) {
    table.dropUnique(['github_id']);
  });
};

'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.table('users', (table) => {
    table.string('displayname');
    table.string('avatar');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('displayname');
    table.dropColumn('avatar');
  });
};

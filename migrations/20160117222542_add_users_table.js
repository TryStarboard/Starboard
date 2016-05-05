'use strict';

exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.bigInteger('github_id');
    table.string('email');
    table.string('username');
    table.string('access_token');
    table.string('refresh_token');
    table.timestamps();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};

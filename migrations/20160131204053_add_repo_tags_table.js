'use strict';

exports.up = (knex, Promise) => {
  return knex.schema.createTable('repo_tags', (table) => {
    table.increments();
    table.integer('tag_id');
    table.integer('repo_id');
    table.timestamps();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('repo_tags');
};

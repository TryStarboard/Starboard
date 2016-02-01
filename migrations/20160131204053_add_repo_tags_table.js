'use strict';

exports.up = (knex, Promise) => {
  return knex.schema.createTable('repo_tags', (table) => {
    table.increments();
    table.integer('tag_id');
    table.integer('repo_id');
    table.timestamps();

    table.unique(['tag_id', 'repo_id']);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('repo_tags');
};

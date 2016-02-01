'use strict';

exports.up = (knex, Promise) => {
  return knex.schema.createTable('repos', (table) => {
    table.increments();
    table.integer('user_id');
    table.bigInteger('github_id');
    table.string('full_name');
    table.text('description');
    table.string('homepage');
    table.string('html_url');
    table.integer('forks_count');
    table.integer('stargazers_count');
    table.timestamp('starred_at');
    table.timestamps();

    table.unique(['user_id', 'github_id']);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('repos');
};

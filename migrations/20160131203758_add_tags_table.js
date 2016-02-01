'use strict';

exports.up = (knex, Promise) => {
  return knex.schema.createTable('tags', (table) => {
    table.increments();
    table.integer('user_id');
    table.string('text');
    table.string('foreground_color');
    table.string('background_color');
    table.timestamps();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('tags');
};

'use strict';

exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.raw('ALTER TABLE users ALTER created_at SET DEFAULT current_timestamp'),
    knex.schema.raw('ALTER TABLE repos ALTER created_at SET DEFAULT current_timestamp'),
    knex.schema.raw('ALTER TABLE tags ALTER created_at SET DEFAULT current_timestamp'),
    knex.schema.raw('ALTER TABLE repo_tags ALTER created_at SET DEFAULT current_timestamp'),

    knex.schema.raw('ALTER TABLE users ALTER updated_at SET DEFAULT current_timestamp'),
    knex.schema.raw('ALTER TABLE repos ALTER updated_at SET DEFAULT current_timestamp'),
    knex.schema.raw('ALTER TABLE tags ALTER updated_at SET DEFAULT current_timestamp'),
    knex.schema.raw('ALTER TABLE repo_tags ALTER updated_at SET DEFAULT current_timestamp'),

    knex.schema.raw(`CREATE FUNCTION update_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ language 'plpgsql';`),

    knex.schema.raw(`CREATE TRIGGER update_user_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE PROCEDURE update_at_column();`),

    knex.schema.raw(`CREATE TRIGGER update_repo_updated_at
      BEFORE UPDATE ON repos
      FOR EACH ROW EXECUTE PROCEDURE update_at_column();`),

    knex.schema.raw(`CREATE TRIGGER update_tag_updated_at
      BEFORE UPDATE ON tags
      FOR EACH ROW EXECUTE PROCEDURE update_at_column();`),

    knex.schema.raw(`CREATE TRIGGER update_repo_tag_updated_at
      BEFORE UPDATE ON repo_tags
      FOR EACH ROW EXECUTE PROCEDURE update_at_column();`),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.raw('DROP TRIGGER update_user_updated_at ON users'),
    knex.schema.raw('DROP TRIGGER update_repo_updated_at ON repos'),
    knex.schema.raw('DROP TRIGGER update_tag_updated_at ON tags'),
    knex.schema.raw('DROP TRIGGER update_repo_tag_updated_at ON repo_tags'),

    knex.schema.raw('DROP FUNCTION update_at_column()'),

    knex.schema.raw('ALTER TABLE users ALTER created_at DROP DEFAULT'),
    knex.schema.raw('ALTER TABLE repos ALTER created_at DROP DEFAULT'),
    knex.schema.raw('ALTER TABLE tags ALTER created_at DROP DEFAULT'),
    knex.schema.raw('ALTER TABLE repo_tags ALTER created_at DROP DEFAULT'),

    knex.schema.raw('ALTER TABLE users ALTER updated_at DROP DEFAULT'),
    knex.schema.raw('ALTER TABLE repos ALTER updated_at DROP DEFAULT'),
    knex.schema.raw('ALTER TABLE tags ALTER updated_at DROP DEFAULT'),
    knex.schema.raw('ALTER TABLE repo_tags ALTER updated_at DROP DEFAULT'),
  ]);
};

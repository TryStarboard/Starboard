const {wrap}                  = require('co');
const db                      = require('../db');
const {UniqueConstraintError} = require('./Errors');

function getAll(id) {
  return db
    .select('id', 'text', 'foreground_color', 'background_color')
    .from('tags')
    .where('user_id', id)
    .orderBy('id', 'desc');
}

const addTag = wrap(function *(user_id, text) {
  try {
    const [tag] = yield db('tags').insert({user_id, text}, '*');
    return tag;
  } catch (err) {
    if (err.constraint === 'tags_user_id_text_unique') {
      throw new UniqueConstraintError('tags', 'text');
    }
    throw err;
  }
});

const deleteTag = wrap(function *(id) {
  yield [
    db('repo_tags').where({tag_id: id}).del(),
    db('tags').where({id}).del(),
  ];
});

module.exports = {
  getAll,
  addTag,
  deleteTag,
};

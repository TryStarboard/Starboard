'use strict';

const {wrap} = require('co');
const db     = require('../db');

const addRepoTag = wrap(function *(data) {
  const [repo_tag] = yield db('repo_tags').insert(data, '*');
  return repo_tag;
});

const deleteRepoTag = wrap(function *({repo_id, tag_id}) {
  yield db('repo_tags').where({repo_id, tag_id}).del();
});

module.exports = {
  addRepoTag,
  deleteRepoTag,
};

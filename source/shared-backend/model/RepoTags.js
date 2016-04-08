import {wrap} from 'co';
import db       from '../db';

export const addRepoTag = wrap(function *(data) {
  const [repo_tag] = yield db('repo_tags').insert(data, '*');
  return repo_tag;
});

export const deleteRepoTag = wrap(function *({repo_id, tag_id}) {
  yield db('repo_tags').where({repo_id, tag_id}).del();
});

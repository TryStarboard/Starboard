import { wrap } from 'co';
import db       from '../db';

export function getAll(id) {
  return db
    .select('id', 'text', 'foreground_color', 'background_color')
    .from('tags')
    .where('user_id', id)
    .orderBy('id', 'desc');
}

export const addTag = wrap(function *(user_id, text) {
  const [ tag ] = yield db('tags').insert({ user_id, text }, '*');
  return tag;
});

export const deleteTag = wrap(function *(id) {
  yield [
    db('repo_tags').where({tag_id: id}).del(),
    db('tags').where({id}).del(),
  ];
});

import { wrap } from 'co';
import db from '../db';

export const addRepoTag = wrap(function *(data) {
  const [repo_tag] = yield db('repo_tags').insert(data, '*');
  return repo_tag;
});

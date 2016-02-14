import { wrap } from 'co';
import db from '../db';

export const addRepoTag = wrap(function *(data) {
  yield db('repo_tags').insert(data);
});

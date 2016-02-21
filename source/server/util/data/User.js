import { wrap } from 'co';
import db from '../db';

export const getUserDetail = wrap(function *(id) {
  const [ user ] = yield db
    .select('id', 'email', 'displayname', 'avatar')
    .from('users')
    .where('id', id);
    
  return user;
});

export const deleteAccount = wrap(function *(id) {
  yield [
    db('repo_tags').where({user_id: id}).del(),
    db('tags').where({user_id: id}).del(),
    db('repos').where({user_id: id}).del(),
    db('users').where({id}).del(),
  ];
});

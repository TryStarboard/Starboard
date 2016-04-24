import {wrap} from 'co';
import db       from '../db';
import github   from '../github';

// { login: 'd6u',
//   id: 1234,
//   avatar_url: 'https://avatars.githubusercontent.com/xxxxxxx',
//   gravatar_id: '',
//   url: 'https://api.github.com/users/xyz',
//   html_url: 'https://github.com/xyz',
//   followers_url: 'https://api.github.com/users/xyz/followers',
//   following_url: 'https://api.github.com/users/xyz/following{/other_user}',
//   gists_url: 'https://api.github.com/users/xyz/gists{/gist_id}',
//   starred_url: 'https://api.github.com/users/xyz/starred{/owner}{/repo}',
//   subscriptions_url: 'https://api.github.com/users/xyz/subscriptions',
//   organizations_url: 'https://api.github.com/users/xyz/orgs',
//   repos_url: 'https://api.github.com/users/xyz/repos',
//   events_url: 'https://api.github.com/users/xyz/events{/privacy}',
//   received_events_url: 'https://api.github.com/users/xyz/received_events',
//   type: 'User',
//   site_admin: false,
//   name: 'XY Z',
//   company: null,
//   blog: 'http://xxx',
//   location: null,
//   email: 'xxx@email.com',
//   hireable: true,
//   bio: null,
//   public_repos: 123,
//   public_gists: 123,
//   followers: 123,
//   following: 123,
//   created_at: '2012-08-14T22:42:49Z',
//   updated_at: '2016-02-20T03:02:44Z' }

const fetchUserProfile = wrap(function *(access_token) {
  const client = github.client(access_token);
  const [, profile] = yield client.getAsync('/user');
  return profile;
});

const findById = wrap(function *(id) {
  const [ user ] = yield db
    .select('id', 'email', 'displayname', 'avatar')
    .from('users')
    .where('id', id);
  return user;
});

const deleteUser = wrap(function *(id) {
  yield [
    db('repo_tags').where({user_id: id}).del(),
    db('tags').where({user_id: id}).del(),
    db('repos').where({user_id: id}).del(),
    db('users').where({id}).del(),
  ];
});

const upsert = wrap(function *(data, access_token) {

  const user = {
    github_id: data.id,
    email: data.email,
    username: data.username,
    displayname: data.name,
    avatar: data.avatar_url,
    access_token,
  };

  const {rows: [ userRecord ]} = yield db.raw(`
    ? ON CONFLICT (github_id)
    DO UPDATE SET
      (email, username, access_token, displayname, avatar) =
      (EXCLUDED.email, EXCLUDED.username, EXCLUDED.access_token, EXCLUDED.displayname, EXCLUDED.avatar)
    RETURNING id`,
    [ db('users').insert(user) ]
  );

  return userRecord.id;
});

export {
  fetchUserProfile,
  upsert,
  findById,
  deleteUser,
};

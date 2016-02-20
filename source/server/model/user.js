import { wrap } from 'co';
import { path } from 'ramda';
import db from '../util/db';
import github from '../util/github';

// { login: 'd6u',
//   id: 2153667,
//   avatar_url: 'https://avatars.githubusercontent.com/u/2153667?v=3',
//   gravatar_id: '',
//   url: 'https://api.github.com/users/d6u',
//   html_url: 'https://github.com/d6u',
//   followers_url: 'https://api.github.com/users/d6u/followers',
//   following_url: 'https://api.github.com/users/d6u/following{/other_user}',
//   gists_url: 'https://api.github.com/users/d6u/gists{/gist_id}',
//   starred_url: 'https://api.github.com/users/d6u/starred{/owner}{/repo}',
//   subscriptions_url: 'https://api.github.com/users/d6u/subscriptions',
//   organizations_url: 'https://api.github.com/users/d6u/orgs',
//   repos_url: 'https://api.github.com/users/d6u/repos',
//   events_url: 'https://api.github.com/users/d6u/events{/privacy}',
//   received_events_url: 'https://api.github.com/users/d6u/received_events',
//   type: 'User',
//   site_admin: false,
//   name: 'Daiwei Lu',
//   company: null,
//   blog: 'http://daiwei.lu',
//   location: null,
//   email: 'daiweilu123@gmail.com',
//   hireable: true,
//   bio: null,
//   public_repos: 63,
//   public_gists: 41,
//   followers: 35,
//   following: 49,
//   created_at: '2012-08-14T22:42:49Z',
//   updated_at: '2016-02-20T03:02:44Z' }

const createUserFromAccessToken = wrap(function *(access_token) {

  const client = github.client(access_token);

  const [, profile] = yield client.getAsync('/user');

  const [ user ] = yield db
    .select('id').from('users').where({ github_id: parseInt(profile.id) }).limit(1);

  if (user) {
    return user.id;
  }

  const data = {
    github_id: profile.id,
    email: path(['emails', 0, 'value'], profile),
    username: profile.username,
    access_token,
  };

  const [ id ] = yield db('users').insert(data, 'id');

  return id;
});

export {
  createUserFromAccessToken,
};

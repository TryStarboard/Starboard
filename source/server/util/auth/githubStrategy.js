import config from 'config';
import { wrap } from 'co';
import GithubStrategy from 'passport-github';
import db from '../db';

// profile data example
//
// { id: '2153667',
//   displayName: 'Daiwei Lu',
//   username: 'd6u',
//   profileUrl: 'https://github.com/d6u',
//   emails: [ { value: 'daiweilu123@gmail.com' } ],
//   provider: 'github'
//   ...

export const handle = wrap(function *(accessToken, refreshToken, profile, done) {
  try {
    const [ user ] = yield db
      .select('id').from('users').where({ github_id: parseInt(profile.id) }).limit(1);

    let id;

    if (!user) {
      const data = {
        github_id: profile.id,
        email: profile.emails[0].value,
        username: profile.username,
        access_token: accessToken,
        refresh_token: refreshToken,
      };

      [ id ] = yield db('users').insert(data, 'id');
    } else {
      id = user.id;
    }

    done(null, { id });
  } catch (err) {
    done(err);
  }
});

export default new GithubStrategy(config.get('github'), handle);

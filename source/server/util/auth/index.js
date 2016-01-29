import passport from 'koa-passport';
import { wrap } from 'co';
import { hash as _hash, compare } from 'bcrypt';
import { promisify } from 'bluebird';
import db from '../db';
import githubStrategy from './githubStrategy.js';

const hashAsync = promisify(_hash);
const compareAsync = promisify(compare);

const opts = {
  usernameField: 'email',
  passwordField: 'password',
};

passport.use(githubStrategy);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(wrap(function *(id, done) {
  try {
    const [user] = yield db('users').select('id').where({ id }).limit(1);
    if (!user) {
      throw new Error('user does not exist');
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

const authInit = passport.initialize();
const authSession = passport.session();

export {
  authInit,
  authSession,
  passport,
}

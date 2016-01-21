import passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { wrap } from 'co';
import { hash, compare } from 'bcrypt';
import { promisify } from 'bluebird';
import db from './db';

const hashAsync = promisify(hash);
const compareAsync = promisify(compare);

const opts = {
  usernameField: 'email',
  passwordField: 'password',
};

passport.use(new LocalStrategy(opts, wrap(function *(email, password, done) {
  try {
    const [user] = yield db.select('id', 'password').from('users').where({ email }).limit(1);
    if (!user) {
      throw new Error('email not exist');
    }
    const correct = yield compareAsync(password, user.password);
    if (!correct) {
      throw new Error('email and password not match');
    }
    done(null, {id: user.id});
  } catch (err) {
    done(err);
  }
})));

passport.use('local-signup', new LocalStrategy(opts, wrap(function *(email, password, done) {
  try {
    const [user] = yield db.select('email').from('users').where({ email }).limit(1);
    if (user) {
      const err = new Error();
      err.code = 'EMAIL_USED';
      throw err;
    }
    const saltHash = yield hashAsync(password, 10);
    const [id] = yield db('users').insert({ email, password: saltHash }, 'id');
    done(null, { id });
  } catch (err) {
    done(err);
  }
})));

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

export const authInit = passport.initialize();
export const authSession = passport.session();
export const authenticateRequest = passport.authenticate('local');
export const authenticateSignupRequest = passport.authenticate('local-signup');

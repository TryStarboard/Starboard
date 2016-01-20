import passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';

const localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (username, password, done) => {
  if (password === '1234') {
    done(null, {id: 123, name: 'daiwei'});
  } else {
    done(null, false);
  }
});

passport.use(localStrategy);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  setTimeout(function () {
    const user = {id: 123, name: 'daiwei'};
    done(null, user);
  }, 10);
});

export const authInit = passport.initialize();
export const authSession = passport.session();
export const authenticateRequest = passport.authenticate('local');

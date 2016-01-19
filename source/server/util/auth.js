import passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';

const opts = {
  usernameField: 'email',
  passwordField: 'password',
};

const localStrategy = new LocalStrategy(opts, (username, password, done) => {
  console.log('localStrategy', username, password);
  done(null, {id: 123});
});

passport.use(localStrategy);

passport.serializeUser(function (user, done) {
  console.log('serializeUser', user);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  setTimeout(function () {
    const user = {id: 123, name: 'daiwei'};
    console.log('deserializeUser', id)
    done(err, user);
  }, 10);
});

export const authInit = passport.initialize();
export const authSession = passport.session();
export const localAuth = passport.authenticate('local');

import Router from 'koa-router';
import { passport } from '../../util/auth';
import renderReact from '../util/renderReact';

const unauthedRoute = new Router();

function *ensureUnauthed(next) {
  if (this.req.isAuthenticated()) {
    this.redirect('/dashboard');
  } else {
    yield next;
  }
}

unauthedRoute.get('/login', ensureUnauthed, renderReact);

unauthedRoute.get('/github-login', ensureUnauthed, passport.authenticate('github'));
unauthedRoute.get('/github-back',
  ensureUnauthed,
  passport.authenticate('github', {failureRedirect: '/login'}),
  function *() {
    this.redirect('/dashboard');
  }
);

export { unauthedRoute as default };

import Router from 'koa-router';
import renderReact from '../util/renderReact';

const unauthRoute = new Router();

function *ensureUnauthed(next) {
  if (this.req.isAuthenticated()) {
    this.redirect('/dashboard');
  } else {
    yield next;
  }
}

unauthRoute.get('/login', ensureUnauthed, renderReact);
unauthRoute.get('/signup', ensureUnauthed, renderReact);

export { unauthRoute as default };

import Router from 'koa-router';
import { fromCallback } from 'bluebird';
import { createLoginUrl, handleLoginCallback } from '../../util/github';
import renderReact from '../util/renderReact';
import { createUserFromAccessToken } from '../../model/user';

const unauthedRoute = new Router();

function *ensureUnauthed(next) {
  if (this.req.isAuthenticated()) {
    this.redirect('/dashboard');
  } else {
    yield next;
  }
}

unauthedRoute.get('/login', ensureUnauthed, renderReact);

unauthedRoute.get(
  '/github-login',
  ensureUnauthed,
  function *(next) {
    this.redirect(createLoginUrl());
  }
);

unauthedRoute.get('/github-back',
  ensureUnauthed,
  function *(next) {
    const access_token = yield handleLoginCallback(this.query);
    const userId = yield createUserFromAccessToken(access_token);
    yield fromCallback((done) => {
      this.req.login({id: userId}, done);
    });
    this.redirect('/dashboard');
  }
);

export { unauthedRoute as default };

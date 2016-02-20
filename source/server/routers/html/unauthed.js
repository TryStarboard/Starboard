import Router from 'koa-router';
import { fromCallback } from 'bluebird';
import { createLoginUrl, handleLoginCallback } from '../../util/github';
import { logger } from '../../util/logging';
import { fetchUserProfile, upsert as upsertUser } from '../../model/user';
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

unauthedRoute.get('/github-login', ensureUnauthed, function *(next) {
  this.redirect(createLoginUrl());
});

unauthedRoute.get('/github-back', ensureUnauthed, function *(next) {
  try {
    const access_token = yield handleLoginCallback(this.query);
    const user = yield fetchUserProfile(access_token);
    const id = yield upsertUser(user, access_token);
    yield fromCallback((done) => this.req.login({ id }, done));
    this.redirect('/dashboard');
  } catch (err) {
    logger.error('github auth callback error', {
      error: err,
    });
    this.redirect('/login');
  }
});

export { unauthedRoute as default };

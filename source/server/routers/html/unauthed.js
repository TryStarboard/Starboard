import Router                                   from 'koa-router';
import {fromCallback}                           from 'bluebird';
import log                                      from '../../../shared-backend/log';
import {createLoginUrl, handleLoginCallback}    from '../../../shared-backend/github';
import {fetchUserProfile, upsert as upsertUser} from '../../../shared-backend/model/User';
import {enqueueSyncStarsJob}                    from '../../util/JobQueue';

const unauthedRoute = new Router();

function *ensureUnauthed(next) {
  if (this.req.isAuthenticated()) {
    this.redirect('/dashboard');
    return;
  }

  yield next;
}

unauthedRoute.get('/github-login', ensureUnauthed, function *(next) {
  this.redirect(createLoginUrl());
});

unauthedRoute.get('/github-back', ensureUnauthed, function *(next) {
  try {
    const access_token = yield handleLoginCallback(this.query);
    const user = yield fetchUserProfile(access_token);
    const id = yield upsertUser(user, access_token);
    yield fromCallback((done) => this.req.login({id}, done));
    enqueueSyncStarsJob(id);
    this.redirect('/dashboard');
  } catch (err) {
    log.error(err, 'github auth callback error');
    this.redirect('/');
  }
});

export {unauthedRoute as default};

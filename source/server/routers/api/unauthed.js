import Router from 'koa-router';
import { authenticateRequest, authenticateSignupRequest } from '../../util/auth';

function *ensureUnauthed(next) {
  if (this.req.isAuthenticated()) {
    this.res.status = 403;
  } else {
    yield next;
  }
}

function *returnUser() {
  this.body = this.req.user;
}

const unauthedRoute = new Router();

unauthedRoute.post('/signup', ensureUnauthed, authenticateSignupRequest, returnUser);
unauthedRoute.post('/login', ensureUnauthed, authenticateRequest, returnUser);

export { unauthedRoute as default };

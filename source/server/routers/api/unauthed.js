import Router from 'koa-router';
import { authenticateRequest } from '../../util/auth';

function *ensureUnauthed(next) {
  if (this.req.isAuthenticated()) {
    this.res.status = 403;
  } else {
    yield next;
  }
}

const unauthedRoute = new Router();

unauthedRoute.post('/login', ensureUnauthed, authenticateRequest, function *(next) {
  this.body = this.req.user;
});

unauthedRoute.post('/login', ensureUnauthed, authenticateRequest, function *(next) {
  this.body = this.req.user;
});

export { unauthedRoute as default };

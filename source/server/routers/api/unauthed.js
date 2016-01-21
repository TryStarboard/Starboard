import Router from 'koa-router';
import {
  authenticateRequest,
  authenticateSignupRequest,
  EmailPassNotMatchError,
  EmailExistError
} from '../../util/auth';

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

function returnError(middleware) {
  return function *(next) {
    try {
      yield middleware.call(this, next);
    } catch (err) {
      this.status = 404;
      if (err instanceof EmailPassNotMatchError) {
        this.body = {err_code: 'EMAIL_PASS_NOT_MATCH'};
      } else if (err instanceof EmailExistError) {
        this.body = {err_code: 'EMAIL_EXIST'};
      }
    }
  };
}

const unauthedRoute = new Router();

unauthedRoute.post(
  '/signup',
  ensureUnauthed,
  returnError(authenticateSignupRequest),
  returnUser);

unauthedRoute.post(
  '/login',
  ensureUnauthed,
  returnError(authenticateRequest),
  returnUser);

export { unauthedRoute as default };

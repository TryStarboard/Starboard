import Router from 'koa-router';
import { authenticateRequest } from '../../util/auth';

function *ensureAuthed(next) {
  if (this.req.isAuthenticated()) {
    yield next;
  } else {
    this.res.status = 401;
  }
}

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

const authedRoute = new Router();

authedRoute.get('/profile', ensureAuthed, function *() {
  this.body = this.req.user;
});

const router = new Router();
router.use('/api/v1', unauthedRoute.routes(), unauthedRoute.allowedMethods());
router.use('/api/v1', authedRoute.routes(), authedRoute.allowedMethods());

export default router.routes();

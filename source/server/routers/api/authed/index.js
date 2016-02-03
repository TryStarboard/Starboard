import Router from 'koa-router';
import { getAll as getAllStars } from '../../../util/data/stars';
import syncStarsForUser from '../../../util/data/syncStarsForUser';

function *ensureAuthed(next) {
  if (this.req.isAuthenticated()) {
    yield next;
  } else {
    this.res.status = 401;
  }
}

const authedRoute = new Router();

authedRoute.get('/logout', ensureAuthed, function *() {
  this.req.logout();
  this.status = 200;
});

authedRoute.get('/stars', ensureAuthed, function *() {
  this.body = yield getAllStars(this.req.user.id);
});

authedRoute.get('/stars/sync', ensureAuthed, function *() {
  this.body = yield syncStarsForUser(this.req.user.id);
});

export { authedRoute as default };

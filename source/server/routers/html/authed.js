import Router from 'koa-router';
import { getAll as getAllStars } from '../../util/data/Repos';
import { getAll as getAllTags } from '../../util/data/tags';
import renderReact from '../util/renderReact';

const authedRoute = new Router();

function *ensureAuthed(next) {
  if (this.req.isAuthenticated()) {
    yield next;
  } else {
    this.redirect('/login');
  }
}

authedRoute.get('/dashboard', ensureAuthed, function *(next) {
  this.reactState = yield {
    user: this.req.user,
    stars: getAllStars(this.req.user.id),
    tags: getAllTags(this.req.user.id),
  };

  yield next;
}, renderReact);

authedRoute.get('/logout', ensureAuthed, function *() {
  this.req.logout();
  this.redirect('/login');
});

export { authedRoute as default };

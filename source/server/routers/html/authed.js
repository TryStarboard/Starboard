import Router from 'koa-router';
import { getAll as getAllRepos } from '../../util/data/Repos';
import { getAll as getAllTags } from '../../util/data/Tags';
import { getUserDetail } from '../../util/data/User';
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
    user: getUserDetail(this.req.user.id),
    repos: getAllRepos(this.req.user.id, 100),
    tags: getAllTags(this.req.user.id),
  };

  yield next;
}, renderReact);

authedRoute.get('/logout', ensureAuthed, function *() {
  this.req.logout();
  this.redirect('/login');
});

authedRoute.get('/userprofile', ensureAuthed, function *(next) {
  this.reactState = yield {
    user: getUserDetail(this.req.user.id)
  };
  yield next;
}, renderReact);

export { authedRoute as default };

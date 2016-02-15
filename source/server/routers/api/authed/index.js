import Router from 'koa-router';
import { getAll as getAllStars } from '../../../util/data/stars';
import { getAll as getAllTags, addTag, deleteTag } from '../../../util/data/tags';
import { addRepoTag, deleteRepoTag } from '../../../util/data/RepoTags';

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

authedRoute.post('/tags', ensureAuthed, function *(next) {
  this.body = yield addTag(this.req.user.id, this.request.body.name);
});

authedRoute.get('/tags', ensureAuthed, function *(next) {
  this.body = yield getAllTags(this.req.user.id);
});

authedRoute.delete('/tags/:id', ensureAuthed, function *(next) {
  this.body = yield deleteTag(this.params.id);
});

authedRoute.post('/repo_tags', ensureAuthed, function *() {
  this.body = yield addRepoTag(this.request.body);
});

authedRoute.delete('/repo_tags', ensureAuthed, function *() {
  this.body = yield deleteRepoTag(this.request.body);
});

export { authedRoute as default };

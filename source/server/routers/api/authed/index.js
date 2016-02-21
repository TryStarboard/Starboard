import Router from 'koa-router';
import { getAll as getAllRepos } from '../../../util/data/Repos';
import { getAll as getAllTags, addTag, deleteTag } from '../../../util/data/Tags';
import { addRepoTag, deleteRepoTag } from '../../../util/data/RepoTags';
import { deleteAccount } from '../../../util/data/User';

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

authedRoute.get('/repos', ensureAuthed, function *() {
  this.body = yield getAllRepos(this.req.user.id);
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

authedRoute.delete('/account', ensureAuthed, function *() {
  this.body = yield deleteAccount(this.req.user.id);
  console.log(this.body);
});

export { authedRoute as default };

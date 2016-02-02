import Router from 'koa-router';
import db from '../../../util/db';

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
  this.body = yield db('repos')
    .select('full_name', 'description', 'homepage', 'html_url', 'tags.text AS tag')
    .where('repos.user_id', this.req.user.id)
    .leftJoin('repo_tags', 'repos.id', 'repo_tags.repo_id')
    .leftJoin('tags', 'repo_tags.tag_id', 'tags.id');
});

export { authedRoute as default };

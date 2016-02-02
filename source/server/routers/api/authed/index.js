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
  const { rows } = yield db.raw(`
    SELECT repos.id AS id, full_name, description, homepage, html_url, 
      array_agg(tags.text) AS tags
    FROM repos
    LEFT JOIN repo_tags ON repo_tags.repo_id = repos.id
    LEFT JOIN tags ON repo_tags.tag_id = tags.id
    WHERE repos.user_id = ?
    GROUP BY repos.id`,
    [this.req.user.id]
  );

  this.body = rows;
});

export { authedRoute as default };

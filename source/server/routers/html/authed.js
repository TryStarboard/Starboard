import Router from 'koa-router';
import renderReact from '../util/renderReact';

const authedRoute = new Router();

function *ensureAuthed(next) {
  if (this.req.isAuthenticated()) {
    yield next;
  } else {
    this.redirect('/login');
  }
}

authedRoute.get('/dashboard', ensureAuthed, renderReact);

export { authedRoute as default };

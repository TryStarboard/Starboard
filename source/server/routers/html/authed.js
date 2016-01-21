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

authedRoute.get('/dashboard', ensureAuthed, function *(next) {
  this.reactState = {user: this.req.user};
  yield next;
}, renderReact);

authedRoute.get('/logout', ensureAuthed, function *() {
  this.req.logout();
  this.redirect('/login');
});

export { authedRoute as default };

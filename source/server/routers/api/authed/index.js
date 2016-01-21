import Router from 'koa-router';

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

export { authedRoute as default };

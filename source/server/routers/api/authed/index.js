import Router from 'koa-router';

function *ensureAuthed(next) {
  if (this.req.isAuthenticated()) {
    yield next;
  } else {
    this.res.status = 401;
  }
}

const authedRoute = new Router();

authedRoute.get('/profile', ensureAuthed, function *() {
  this.body = this.req.user;
});

export { authedRoute as default };

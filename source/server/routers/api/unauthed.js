import Router from 'koa-router';

function *ensureUnauthed(next) {
  if (this.req.isAuthenticated()) {
    this.res.status = 403;
  } else {
    yield next;
  }
}

const unauthedRoute = new Router();

unauthedRoute.get('/', ensureUnauthed, function *() {
  this.body = {hello: 'world'};
});

export {unauthedRoute as default};

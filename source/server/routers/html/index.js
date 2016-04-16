import Router from 'koa-router';

const router = new Router();

router.get('/', function *() {
  if (this.req.isAuthenticated()) {
    this.redirect('/dashboard');
  } else {
    yield this.render('index');
  }
});

router.get('/dashboard', function *() {
  if (!this.req.isAuthenticated()) {
    this.redirect('/');
  } else {
    yield this.render('dashboard');
  }
});

router.get('/user-profile', function *() {
  if (!this.req.isAuthenticated()) {
    this.redirect('/');
  } else {
    yield this.render('dashboard');
  }
});

export default router.routes();

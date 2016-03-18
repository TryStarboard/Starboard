import Router from 'koa-router';

const router = new Router();

router.get('/', function *() {
  if (this.req.isAuthenticated()) {
    this.redirect('/dashboard');
  } else {
    this.redirect('/login');
  }
});

router.get('/login', function *() {
  if (this.req.isAuthenticated()) {
    this.redirect('/dashboard');
  } else {
    yield this.render('index');
  }
});

router.get('/dashboard', function *() {
  if (!this.req.isAuthenticated()) {
    this.redirect('/login');
  } else {
    yield this.render('index');
  }
});

router.get('/user-profile', function *() {
  if (!this.req.isAuthenticated()) {
    this.redirect('/login');
  } else {
    yield this.render('index');
  }
});

export default router.routes();

import Router from 'koa-router';

const router = new Router();

router.get('/', function *() {
  if (this.req.isAuthenticated()) {
    this.redirect('/dashboard');
    return;
  }

  yield this.render('index');
});

router.get('/dashboard', function *() {
  if (!this.req.isAuthenticated()) {
    this.redirect('/');
    return;
  }

  yield this.render('-inner');
});

router.get('/user-profile', function *() {
  if (!this.req.isAuthenticated()) {
    this.redirect('/');
    return;
  }

  yield this.render('-inner');
});

export default router.routes();

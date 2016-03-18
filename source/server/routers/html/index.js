import config from 'config';
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
    yield this.render('index', {
      MIXPANEL_TOKEN: config.get('mixpanel.token'),
    });
  }
});

router.get('/dashboard', function *() {
  if (!this.req.isAuthenticated()) {
    this.redirect('/login');
  } else {
    yield this.render('index', {
      MIXPANEL_TOKEN: config.get('mixpanel.token'),
    });
  }
});

router.get('/user-profile', function *() {
  if (!this.req.isAuthenticated()) {
    this.redirect('/login');
  } else {
    yield this.render('index', {
      MIXPANEL_TOKEN: config.get('mixpanel.token'),
    });
  }
});

export default router.routes();

import config from 'config';
import koa from 'koa';
import render from 'koa-ejs';
import koaStatic from 'koa-static';
import bodyParser from 'koa-bodyparser';
import koaLogger from 'koa-logger';
import session from '../util/session';
import log from '../util/log';
import { authInit, authSession } from '../util/auth';
import htmlRoute from '../routers/html';
import apiRoute from '../routers/api';

export default function createKoaServer() {

  const app = koa();

  app.keys = config.get('cookie.keys');

  render(app, {
    root: config.get('koa.templateDir'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: true,
  });

  app.use(koaStatic(config.get('koa.publicDir')));

  if (config.get('isDev')) {
    app.use(koaLogger());
  }

  app.use(function *(next) {
    const t1 = Date.now();
    try {
      yield next;
      log.info({
        req: this.request,
        res: this.response,
        responseTime: Date.now() - t1,
      }, 'request');
    } catch (err) {
      this.status = 500;
      if (config.get('isDev')) {
        this.body = err.stack;
      }
      log.error({
        req: this.request,
        res: this.response,
        responseTime: Date.now() - t1,
        err,
      }, 'request-error');
    }
  });

  app.use(session);
  app.use(bodyParser());
  app.use(authInit);
  app.use(authSession);
  app.use(apiRoute);
  app.use(htmlRoute);

  return app;
}

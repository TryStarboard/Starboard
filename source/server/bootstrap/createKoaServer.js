import config                    from 'config';
import koa                       from 'koa';
import koaStatic                 from 'koa-static';
import bodyParser                from 'koa-bodyparser';
import koaLogger                 from 'koa-logger';
import views                     from 'koa-views';
import log                       from '../../shared-backend/log';
import session                   from '../util/session';
import {authInit, authSession}   from '../util/auth';
import htmlRoute                 from '../routers/html';
import unauthedRoute             from '../routers/html/unauthed';
import apiRoute                  from '../routers/api';

export default function createKoaServer() {

  const app = koa();

  app.keys = config.get('cookie.keys');

  app.use(koaStatic(config.get('koa.publicDir')));
  app.use(koaStatic(config.get('koa.staticDir')));

  app.use(views(config.get('koa.templateDir'), {
    extension: 'jade',
  }));

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
  app.use(unauthedRoute.routes());

  return app;
}

import config from 'config';
import koa from 'koa';
import render from 'koa-ejs';
import koaStatic from 'koa-static';
import bodyParser from 'koa-bodyparser';
import koaLogger from 'koa-logger';
import session from '../util/session';
import { logger } from '../util/logging';
import { authInit, authSession } from '../util/auth';
import htmlRoute from '../routers/html';
import apiRoute from '../routers/api';

function collectLogMeta(ctx, responseTime, error) {
  return {
    responseTime,
    error,
    req: {
      httpVersion: ctx.request.httpVersion,
      headers: ctx.headers,
      url: ctx.url,
      method: ctx.method,
      originalUrl: ctx.originalUrl,
      query: ctx.query,
    },
    res: {
      status: ctx.status,
    },
    short: `${ctx.method} ${ctx.originalUrl} ${ctx.status}`,
  };
}

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
      logger.info('request', collectLogMeta(this, Date.now() - t1));
    } catch (err) {
      this.status = 500;
      if (config.get('isDev')) {
        this.body = err.stack;
      }
      logger.error('request-error', collectLogMeta(this, Date.now() - t1, err));
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

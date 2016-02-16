/*eslint no-process-env:0*/

import config from 'config';
import koa from 'koa';
import render from 'koa-ejs';
import koaStatic from 'koa-static';
import bodyParser from 'koa-bodyparser';
import session from './util/session';
import { logger, devLogging } from './util/logging';
import { authInit, authSession } from './util/auth';
import htmlRoute from './routers/html';
import apiRoute from './routers/api';

export default function createKoaServer() {
  const app = koa();

  app.keys = config.get('cookie.keys');

  if (process.env.NODE_ENV === 'development') {
    app.use(function *(next) {
      try {
        yield next;
      } catch (err) {
        this.status = 500;
        this.body = err.stack;
        logger.error(err);
      }
    });

    app.use(koaStatic(config.get('koa.publicDir')));
    app.use(devLogging);
  }

  app.use(session);
  app.use(bodyParser());
  app.use(authInit);
  app.use(authSession);

  render(app, {
    root: config.get('koa.templateDir'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: true,
  });

  app.use(apiRoute);
  app.use(htmlRoute);

  if (process.env.NODE_ENV !== 'production') {
    app.on('error', function (err, ctx) {
      logger.error(err);
    });
  }

  return app;
}

import 'source-map-support/register';
import { join } from 'path';
import koa from 'koa';
import render from 'koa-ejs';
import koaStatic from 'koa-static';
import bodyParser from 'koa-bodyparser';
import session from './util/session';
import { logger, middleware as devLoggingMiddleware } from './util/logging';
import { authInit, authSession } from './util/auth';
import htmlRoute from './routers/html';
import apiRoute from './routers/api';

const app = koa();

app.keys = ['keyboard cat', 'starboard'];
app.use(koaStatic(join(__dirname, '../../public')));
app.use(devLoggingMiddleware);
app.use(session);
app.use(bodyParser());
app.use(authInit);
app.use(authSession);

render(app, {
  root: join(__dirname, '../../template'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: true,
});

app.use(apiRoute);
app.use(htmlRoute);

app.on('error', function (err, ctx) {
  logger.error(err);
});

app.listen(10000, '0.0.0.0', () => {
  logger.info('http://0.0.0.0:10000');
});

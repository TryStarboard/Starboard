import 'source-map-support/register';
import { join } from 'path';
import koa from 'koa';
import render from 'koa-ejs';
import koaStatic from 'koa-static';
import session from './util/session';
import { logger, middleware as devLoggingMiddleware } from './util/logging';
import viewRoute from './route/view';

const app = koa();

app.keys = ['keyboard cat', 'starboard'];
app.use(devLoggingMiddleware);
app.use(session);
app.use(koaStatic(join(__dirname, '../../public')));

render(app, {
  root: join(__dirname, '../../template'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: true,
});

app.use(viewRoute);

app.listen(10000, '0.0.0.0', () => {
  logger.info('http://0.0.0.0:10000');
});

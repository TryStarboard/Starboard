import 'source-map-support/register';
import { join } from 'path';
import express from 'express';
import { sessionMiddleware } from './datastore/redis';
import { loggingMiddleware } from './util/logging';
import viewRoute from './route/view';
import apiRoute from './route/api';

const app = express();

app.set('views', join(__dirname, '../../template'));
app.set('view engine', 'ejs');

app.use(loggingMiddleware);
app.use(sessionMiddleware);
app.use(express.static(join(__dirname, '../../public')));
app.use(viewRoute);
app.use(apiRoute);

app.listen(10000, '0.0.0.0', () => {
  console.log('http://0.0.0.0:10000');
});

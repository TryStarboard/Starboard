import 'source-map-support/register';
import { readFile } from 'fs';
import { join } from 'path';
import express from 'express';
import session from 'express-session';
import winston from 'winston';
import expressWinston from 'express-winston';
import getStoreClass from 'connect-redis';
import Redis from 'ioredis';
import config from 'config';
import viewRoute from './route/view';

const app = express();

app.set('views', join(__dirname, '../../template'));
app.set('view engine', 'ejs');

const RedisStore = getStoreClass(session);
const redis = new Redis(config.get('redis'));

app.use(session({
  store: new RedisStore({client: redis}),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({colorize: true})
  ],
  meta: false,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorStatus: true,
}));

app.use(express.static(join(__dirname, '../../public')));

app.use(route);

app.listen(10000, '0.0.0.0', () => {
  console.log('http://0.0.0.0:10000');
});

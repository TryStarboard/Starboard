import session from 'express-session';
import getStoreClass from 'connect-redis';
import Redis from 'ioredis';
import config from 'config';
import { logger } from '../util/logging';

const RedisStore = getStoreClass(session);
const redis = new Redis(config.get('redis'));

redis.on('error', (err) => {
  logger.error(err);
});

export const sessionMiddleware = session({
  store: new RedisStore({client: redis}),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
});

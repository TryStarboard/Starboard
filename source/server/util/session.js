import config from 'config';
import Redis from 'ioredis';
import session from 'koa-generic-session';
import redisStore from 'koa-redis';
import { logger } from './logging';

const client = new Redis(config.get('redis'));

client.on('error', (err) => {
  logger.error(err);
});

export default session({
  store: redisStore({client})
});

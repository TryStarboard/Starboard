import session from 'koa-generic-session';
import redisStore from 'koa-redis';
import { client } from './redis';

export default session({
  store: redisStore({client})
});

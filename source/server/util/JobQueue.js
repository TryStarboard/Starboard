import kue                       from 'kue';
import config                    from 'config';
import Redis                     from 'ioredis';
import {wrap} from 'co';
import log                       from '../../shared-backend/log';
import {client as redisClient} from '../../shared-backend/redis';

const REDIS_CONFIG = config.get('redis');

const queue = kue.createQueue({
  redis: {
    createClientFactory() {
      return new Redis(REDIS_CONFIG);
    }
  }
});

export const enqueueSyncStarsJob = wrap(function *(user_id) {
  const key = `{uniq-job:sync-stars}:user_id:${user_id}`;
  const result = yield redisClient.getset(key, Date.now().toString());
  log.info({value: result}, 'ENQUEUE_UNIQUE_JOB_CHECK');
  // result will be `null` when first time "getset"
  if (result !== null) {
    return;
  }
  queue.create('sync-stars', {user_id}).save();
  yield redisClient.expire(key, 30); // 30 sec
});

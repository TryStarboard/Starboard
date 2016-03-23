import kue                       from 'kue';
import config                    from 'config';
import Redis                     from 'ioredis';
import { client as redisClient } from '../../shared-backend/redis';

const REDIS_CONFIG = config.get('redis');

const queue = kue.createQueue({
  redis: {
    createClientFactory() {
      return new Redis(REDIS_CONFIG);
    }
  }
});

export function enqueueSyncStarsJob(user_id) {
  redisClient.getset(`{uniq-job:sync-stars}:user_id:${user_id}`, 'running')
    .then(function (result) {
      // result will be `null` when first time "getset"
      if (result === 'running') {
        return;
      }
      queue.create('sync-stars', {user_id}).save();
    });
}

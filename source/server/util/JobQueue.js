import kue    from 'kue';
import config from 'config';
import Redis  from 'ioredis';

const REDIS_CONFIG = config.get('redis');

const queue = kue.createQueue({
  redis: {
    createClientFactory() {
      return new Redis(REDIS_CONFIG);
    }
  }
});

export function enqueueSyncStarsJob(user_id) {
  const job = queue.create('sync-stars', {user_id});
  job.save();
}

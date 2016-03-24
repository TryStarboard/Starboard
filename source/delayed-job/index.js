import kue                     from 'kue';
import config                  from 'config';
import Redis                   from 'ioredis';
import log                     from '../shared-backend/log';
import {client as redisClient} from '../shared-backend/redis';
import startSyncStars          from './SyncStars';

const REDIS_CONFIG = config.get('redis');

const queue = kue.createQueue({
  redis: {
    createClientFactory() {
      return new Redis(REDIS_CONFIG);
    }
  }
});

const pub = new Redis(REDIS_CONFIG);

queue.process('sync-stars', 5, function (job, done) {
  const data = job.data;
  const {user_id} = data;
  const channel = `sync-stars:user_id:${user_id}`;
  let total;
  let i = 0;

  log.info({user_id, job_type: 'sync-stars'}, 'JOB_STARTED');

  startSyncStars(user_id).subscribe(onNext, onError, onCompleted);

  function onNext(event) {
    switch (event.type) {
    case 'SUMMARY_ITEM':
      // Plus one because we have to an additional delete step after all pages
      total = event.total_page + 1;
      break;
    case 'UPDATED_ITEM':
      // Fallthrough
    case 'DELETED_ITEM':
      i += 1;
      job.progress(i, total);
      pub.publish(channel, JSON.stringify({
        type: 'PROGRESS_DATA_ITEM',
        progress: Math.round(i / total * 100) / 100,
      }));
      pub.publish(channel, JSON.stringify(event));
      break;
    default:
      // No additional case
    }
  }

  function onError(err) {
    log.error({err, user_id, job_type: 'sync-stars'}, 'JOB_ERROR');
    redisClient.set(`{uniq-job:sync-stars}:user_id:${user_id}`, 'idle');
    done(err);
  }

  function onCompleted() {
    log.info({user_id, job_type: 'sync-stars'}, 'JOB_COMPLETED');
    redisClient.set(`{uniq-job:sync-stars}:user_id:${user_id}`, 'idle');
    done();
  }
});

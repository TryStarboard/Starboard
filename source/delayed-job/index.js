import kue            from 'kue';
import config         from 'config';
import Redis          from 'ioredis';
import log            from '../shared-backend/log';
import startSyncStars from './SyncStars';

const REDIS_CONFIG = config.get('redis');

const queue = kue.createQueue({
  redis: {
    createClientFactory() {
      return new Redis(REDIS_CONFIG);
    }
  }
});

queue.process('sync-stars', 5, function (job, done) {
  const data = job.data;
  let total;
  let i = 0;

  startSyncStars(data.user_id).subscribe(onNext, onError, done);

  function onNext(event) {
    switch (event.type) {
    case 'SUMMARY_ITEM':
      // Plus one because we have to an additional delete step after all pages
      total = event.total_page + 1;
      break;
    case 'UPDATED_ITEM':
      i += 1;
      job.progress(i, total);
      break;
    case 'DELETED_ITEM':
      i += 1;
      job.progress(i, total);
      break;
    default:
      // No additional case
    }
  }

  function onError(err) {
    log.error('sync-stars-error', {err});
    done(err);
  }
});

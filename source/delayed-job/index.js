import kue            from 'kue';
import config         from 'config';
import Redis          from 'ioredis';
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

  startSyncStars(data.user_id).subscribe(
    (event) => {
      switch (event.type) {
      case 'SUMMARY':
        // Plus one because we have to an additional delete step after all pages
        total = event.total_page + 1;
        break;
      case 'PROGRESS':
        i += 1;
        job.progress(i, total, {type: 'PROGRESS', repo_ids: event.repo_ids});
        break;
      case 'DELETE':
        i += 1;
        job.progress(i, total, {type: 'DELETE', deleted_repo_ids: event.deleted_repo_ids});
        break;
      default:
        // No additional case
      }
    }
    // },
    // (error) => log.error('sync-stars-error', { error })
  );
});

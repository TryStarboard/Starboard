import config                  from 'config';
import Redis                   from 'ioredis';
import {client as redisClient} from '../../shared-backend/redis';
import log                     from '../../shared-backend/log';
import startSyncStars          from './SyncStars';

const pub = new Redis(config.get('redis'));

export default function (job, done) {
  const data = job.data;
  const {user_id} = data;
  const channel = `sync-stars:user_id:${user_id}`;
  const uniqKey = `{uniq-job:sync-stars}:user_id:${user_id}`;
  let total;
  let i = 0;

  log.info({user_id, job_type: 'sync-stars', job_id: job.id}, 'JOB_STARTED');

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
    log.error({err, user_id, job_type: 'sync-stars', job_id: job.id}, 'JOB_ERROR');
    redisClient.del(uniqKey);
    done(err);
  }

  function onCompleted() {
    log.info({user_id, job_type: 'sync-stars', job_id: job.id}, 'JOB_COMPLETED');
    redisClient.del(uniqKey);
    done();
  }
}

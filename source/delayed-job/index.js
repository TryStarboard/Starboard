import 'source-map-support/register';
import kue       from 'kue';
import config    from 'config';
import Redis     from 'ioredis';
import log       from '../shared-backend/log';
import syncStars from './jobs/sync-stars';

const REDIS_CONFIG = config.get('redis');

const queue = kue.createQueue({
  redis: {
    createClientFactory() {
      return new Redis(REDIS_CONFIG);
    }
  }
});

queue
  .on('job enqueue', function (id, type) {
    log.info({job_type: type, job_id: id}, 'JOB_ENQUEUE');
  })
  .on('job complete', function (id, result) {
    kue.Job.get(id, function (err1, job) {
      if (err1) {
        return;
      }

      job.remove(function (err2) {
        if (err2) {
          throw err2;
        }
        log.info({job_id: id}, 'JOB_REMOVED');
      });
    });
  })
  .on('error', function (err) {
    log.error(err, 'QUEUE_ERROR');
  });

queue.process('sync-stars', 5, function (job, done) {
  try {
    syncStars(job, done);
  } catch (err) {
    log.error(err, 'UNEXPECTED_JOB_ERROR');
    done(err);
  }
});

log.info('JOB_SERVER_START');

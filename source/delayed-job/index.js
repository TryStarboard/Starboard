import kue from 'kue';
import config from 'config';
import Redis from 'ioredis';

const REDIS_CONFIG = config.get('redis');

const queue = kue.createQueue({
  redis: {
    createClientFactory() {
      return new Redis(REDIS_CONFIG);
    }
  }
});

queue.process('sync-stars', 5, function (job, done) {
  let i = 0;
  function next() {
    if (i === 5) {
      done();
    }
    setTimeout(function () {
      i += 1;
      job.progress(i, 5, {
        something: {
          arr: [1,2,3,4]
        },
      });
      next();
    }, 1000);
  }
  next();
});

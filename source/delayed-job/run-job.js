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

var job = queue.create('sync-stars');

job.on('progress', function (progress, data) {
  console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data);
});

job.save(function (err) {
  if(!err)
    console.log(job.id);

  // setTimeout(function () {
  //   kue.Job.rangeByType('sync-stars', 'active', 0, 100, 'asc', function (err, jobs) {
  //     console.log(err, jobs);
  //   });
  // }, 1000)
});

console.log(job.id);

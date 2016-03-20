import kue from 'kue';
import config from 'config';
import Redis from 'ioredis';
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

  startSyncStars(data.user_id).subscribe(
    ({ type, data }) => {
      if (type === 'PROGRESS') {
        const { repos, tags } = data;
        // job.progress(, 100);
        socket.emit(UPDATE_TAGS, tags);
        socket.emit(UPDATE_SOME_REPOS, repos);
      } else {
        // type === 'DELETE'
        socket.emit(REMOVE_REPOS, data);
      }
    }
    // },
    // (error) => log.error('sync-stars-error', { error })
  );
});

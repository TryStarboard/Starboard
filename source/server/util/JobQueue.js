import kue                      from 'kue';
import config                   from 'config';
import Redis                    from 'ioredis';
import { Observable           } from 'rx';
import { props                } from 'bluebird';
import { getReposWithIds      } from '../../shared-backend/model/Repos';
import { getAll as getAllTags } from '../../shared-backend/model/Tags';

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
  const source = Observable.create((observer) => {
    /**
    * progress: number, percentage
    * data: Object
    */
    job.on('progress', (progress, event) => {
      switch (event.type) {
      case 'PROGRESS':
        props({
          repos: getReposWithIds(event.repo_ids),
          tags: getAllTags(user_id),
        })
        .then((data) => {
          observer.onNext({type: 'PROGRESS', progress, data});
        });
        break;
      case 'DELETE':
        observer.onNext({type: 'DELETE', progress, data: event.deleted_repo_ids});
        break;
      default:
        // No additional case
      }
    });

    job.save((err) => {
      if (err) {
        observer.onError(err);
      }
    });
  });

  return {job, source};
}

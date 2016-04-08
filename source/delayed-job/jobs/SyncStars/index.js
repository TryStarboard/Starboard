import {Observable, Subject}         from 'rx';
import {propEq, concat, prop, pluck} from 'ramda';
import {Maxcon}                      from 'maxcon';
import {
  createRepoSource,
  reposSelector,
  tagsSelector,
  reposAndLanguageTagMapSelector,
  deleteRepos
} from './util';

/**
 * Data source from Github, emit fetched data from github
 *
 * @param {number} user_id Local User ID
 *
 * @return {Observable} Emit two types of item
 *                      interface SummaryItem {
 *                      	type: 'SUMMARY_ITEM',
 *                      	total_page: number,
 *                      }
 *                      interface UpdatedItem {
 *                      	type: 'UPDATED_ITEM',
 *                      	repo_ids: number[],
 *                      }
 *                      interface DeletedItem {
 *                      	type: 'DELETED_ITEM',
 *                      	deleted_repo_ids: number[],
 *                      }
 */
export default function (user_id) {
  const returnSubject = new Subject();

  new Maxcon({
    fetchStarsFromGithub: {
      process: () => createRepoSource(user_id),
    },
    getFetchSummary: {
      dependsOn: ['fetchStarsFromGithub'],
      process({fetchStarsFromGithub: a}) {
        return a
          .filter(propEq('type', 'SUMMARY_ITEM'))
          .doOnNext((val) => returnSubject.onNext(val));
      },
    },
    getStarItems: {
      dependsOn: ['fetchStarsFromGithub'],
      process({fetchStarsFromGithub: a}) {
        return a
          .filter(propEq('type', 'REPOS_ITEM'))
          .map(prop('repos'));
      },
    },
    saveRepos: {
      dependsOn: ['getStarItems'],
      process({getStarItems: a}) {
        return a.flatMapWithMaxConcurrent(1, reposSelector);
      }
    },
    saveTags: {
      dependsOn: ['getStarItems'],
      process({getStarItems: a}) {
        return a.flatMapWithMaxConcurrent(1, tagsSelector(user_id));
      }
    },
    saveRepoTags: {
      dependsOn: ['saveRepos', 'saveTags'],
      process({saveRepos: a, saveTags: b}) {
        return Observable
          .zip(a, b)
          .flatMapWithMaxConcurrent(1, reposAndLanguageTagMapSelector(user_id))
          .doOnNext(emitProgressItem);
      }
    },
    deleteUnstarredRepos: {
      dependsOn: ['saveRepos'],
      process({saveRepos: a}) {
        return a
          .map(pluck('id'))
          .reduce(concat)
          .flatMap(deleteRepos(user_id));
      }
    },
    reportProgress: {
      dependsOn: ['saveRepoTags', 'deleteUnstarredRepos'],
      process({saveRepoTags: a, deleteUnstarredRepos: b}) {
        return Observable.create((observer) => {
          // Use replay to convert into hot observable
          // because concat won't subscribe to "b" before "a" finish
          const c = b.replay();
          const d1 = c.connect();
          // Use concat to ensure delete event is emitted last
          const d2 = Observable
            .concat(a, c.doOnNext(emitDeleteItem))
            .subscribe(observer);
          return () => {
            // Dispose resource in case of unsubscribing at the bottom
            d1.dispose();
            d2.dispose();
          };
        });
      }
    }
  })
  .connect((err) => {
    if (err) {
      returnSubject.onError(err);
    } else {
      returnSubject.onCompleted();
    }
  });

  function emitProgressItem(repoIds) {
    returnSubject.onNext({type: 'UPDATED_ITEM', repo_ids: repoIds});
  }

  function emitDeleteItem(deletedRepoIds) {
    returnSubject.onNext({type: 'DELETED_ITEM', deleted_repo_ids: deletedRepoIds});
  }

  return returnSubject;
}

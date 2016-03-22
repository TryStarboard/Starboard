import { Observable, Subject } from 'rx';
import { propEq, concat, prop, pluck } from 'ramda';
import {
  createRepoSource,
  reposSelector,
  tagsSelector,
  reposAndLanguageTagMapSelector,
  deleteRepos } from './util';

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

  const reposSharedSource = createRepoSource(user_id).share();

  reposSharedSource
    .filter(propEq('type', 'SUMMARY_ITEM'))
    .subscribe(::returnSubject.onNext, ::returnSubject.onError);
  const reposItemsSource = reposSharedSource
    .filter(propEq('type', 'REPOS_ITEM'))
    .map(prop('repos'))
    .share();

  const reposSource = reposItemsSource
    .flatMapWithMaxConcurrent(1, reposSelector)
    .shareReplay();
  const tagsSource = reposItemsSource
    .flatMapWithMaxConcurrent(1, tagsSelector(user_id));

  // Use "concat" because we want to make sure DELETED_ITEM comes last
  Observable.concat(
    Observable
      .zip(reposSource, tagsSource)
      .flatMapWithMaxConcurrent(1, reposAndLanguageTagMapSelector(user_id))
      .doOnNext(emitProgressItem),
    reposSource
      .map(pluck('id'))
      .reduce(concat)
      .flatMap(deleteRepos(user_id))
      .doOnNext(emitDeleteItem)
  )
  .subscribe(() => {}, ::returnSubject.onError, ::returnSubject.onCompleted);

  function emitProgressItem(repoIds) {
    returnSubject.onNext({type: 'UPDATED_ITEM', repo_ids: repoIds});
  }

  function emitDeleteItem(deletedRepoIds) {
    returnSubject.onNext({type: 'DELETED_ITEM', deleted_repo_ids: deletedRepoIds});
  }

  return returnSubject;
}

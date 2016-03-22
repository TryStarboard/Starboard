import { wrap                                         } from 'co';
import { map, uniq, compact                           } from 'lodash';
import { Observable, Subject                          } from 'rx';
import { propEq, map as Rmap, concat, curry, curryN, prop } from 'ramda';
import db                                               from '../../shared-backend/db';
import { transformReposForInsertion, createRepoSource } from './util';

/**
 * @param {Object[]} repos Raw star object from github
 *
 * @yield {Promise<{id: number; language: string;}>} Resolve
 */
const reposSelector = wrap(function *(repos) {
  const [githubIdLangMap, transformedRepos] = transformReposForInsertion(repos);

  const transformInsertedRepos = Rmap(function ({id: repo_id, github_id}) {
    return {id: repo_id, language: githubIdLangMap[github_id]};
  });

  const {rows} = yield db.raw(
    '? ON CONFLICT (user_id, github_id) ' +
    'DO UPDATE SET (full_name, description, homepage, html_url, forks_count, stargazers_count) = ' +
    '(' +
      'EXCLUDED.full_name, EXCLUDED.description, EXCLUDED.homepage, ' +
      'EXCLUDED.html_url, EXCLUDED.forks_count, EXCLUDED.stargazers_count' +
    ') ' +
    'RETURNING id, github_id',
    [db('repos').insert(transformedRepos)]
  );

  return transformInsertedRepos(rows);
});

const tagsSelector = curryN(2, wrap(function *(user_id, repos) {
  const languages = uniq(compact(map(repos, 'language')));
  const sql = db('tags').insert(languages.map((lang) => ({user_id, text: lang})));
  yield db.raw('? ON CONFLICT DO NOTHING', [sql]);
  const tags = yield db('tags').select('id', 'text').where({user_id});

  const languageTagMap = {};

  for (const {id: tag_id, text} of tags) {
    languageTagMap[text] = tag_id;
  }

  return languageTagMap;
}));

const reposAndLanguageTagMapSelector = curryN(2, wrap(function *(user_id, [repos, languageTagMap]) {
  const entries = compact(repos.map(({id: repo_id, language}) => {
    if (language == null) {
      return null;
    }
    return {repo_id, tag_id: languageTagMap[language], user_id};
  }));

  yield db.raw('? ON CONFLICT DO NOTHING', [db('repo_tags').insert(entries)]);

  return map(repos, 'id');
}));

const deleteRepos = curry((user_id, ids) => {
  return db('repos')
    .where('user_id', user_id)
    .whereNotIn('id', ids)
    .del()
    .returning('id');
});

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

  const reposSource = reposItemsSource.flatMapWithMaxConcurrent(1, reposSelector);
  const tagsSource = reposItemsSource.flatMapWithMaxConcurrent(1, tagsSelector(user_id));

  Observable.merge(
    Observable
      .zip(reposSource, tagsSource)
      .flatMap(reposAndLanguageTagMapSelector(user_id))
      .doOnNext(emitProgressItem),
    reposSource
      .map(Rmap(prop(['id'])))
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

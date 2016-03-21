import { wrap                                         } from 'co';
import { map, uniq, compact                           } from 'lodash';
import { Observable, Subject                          } from 'rx';
import db                                               from '../../shared-backend/db';
import { transformReposForInsertion, createRepoSource } from './util';

/**
 * Data source from Github, emit fetched data from github
 *
 * @param {number} id Local User ID
 *
 * @return {Observable} Emit two types of item
 *                      interface SummaryItem {
 *                      	type: 'SUMMARY',
 *                      	total_page: number,
 *                      }
 *                      interface ProgressItem {
 *                      	type: 'PROGRESS',
 *                      	repo_ids: number[],
 *                      }
 *                      interface DeleteItem {
 *                      	type: 'DELETE',
 *                      	deleted_repo_ids: number[],
 *                      }
 */
export default function (id) {
  const IDs = [];
  const progressSubject = new Subject();
  const source = createRepoSource(id);

  const reposSelector = wrap(function *(repos) {
    const [githubIdLangMap, transformedRepos] = transformReposForInsertion(repos);

    const { rows } = yield db.raw(
      '? ON CONFLICT (user_id, github_id) ' +
      'DO UPDATE SET (full_name, description, homepage, html_url, forks_count, stargazers_count) = ' +
      '(' +
        'EXCLUDED.full_name, EXCLUDED.description, EXCLUDED.homepage, ' +
        'EXCLUDED.html_url, EXCLUDED.forks_count, EXCLUDED.stargazers_count' +
      ') ' +
      'RETURNING id, github_id',
      [ db('repos').insert(transformedRepos) ]
    );

    return rows.map(({ id: repo_id, github_id }) => {
      IDs.push(repo_id);
      return {id: repo_id, language: githubIdLangMap[github_id]};
    });
  });

  const tagsSelector = wrap(function *(repos) {
    const languages = uniq(compact(map(repos, 'language')));
    const sql = db('tags').insert(languages.map((lang) => ({user_id: id, text: lang})));
    yield db.raw('? ON CONFLICT DO NOTHING', [sql]);
    const tags = yield db('tags').select('id', 'text').where({user_id: id});

    const languageTagMap = {};

    for (const {id: tag_id, text} of tags) {
      languageTagMap[text] = tag_id;
    }

    return languageTagMap;
  });

  const reposAndLanguageTagMapSelector = wrap(function *([ repos, languageTagMap ]) {
    const entries = compact(repos.map(({ id: repo_id, language }) => {
      if (language == null) {
        return null;
      }
      return { repo_id, tag_id: languageTagMap[language], user_id: id };
    }));

    yield db.raw('? ON CONFLICT DO NOTHING', [ db('repo_tags').insert(entries) ]);

    return map(repos, 'id');
  });

  const reposSource = source
    .filter((item) => {
      switch (item.type) {
      case 'SUMMARY_ITEM':
        progressSubject.onNext({
          type: 'SUMMARY',
          total_page: item.total_page,
        });
        return false;
      case 'REPOS_ITEM':
        return true;
      default:
        // No additional case
      }
    })
    .flatMapWithMaxConcurrent(1, reposSelector);
  const tagsSource = source.flatMapWithMaxConcurrent(1, tagsSelector);

  Observable
    .zip(reposSource, tagsSource)
    .flatMap(reposAndLanguageTagMapSelector)
    .subscribe(
      (repoIds) => {
        progressSubject.onNext({
          type: 'PROGRESS',
          repo_ids: repoIds
        });
      },
      (err) => progressSubject.onError(err),
      () => {
        db('repos')
          .where('user_id', id)
          .whereNotIn('id', IDs)
          .del()
          .returning('id')
          .then((deletedRepoIds) => {
            progressSubject.onNext({
              type: 'DELETE',
              deleted_repo_ids: deletedRepoIds,
            });
            progressSubject.onCompleted();
          });
      }
    );

  return progressSubject;
}

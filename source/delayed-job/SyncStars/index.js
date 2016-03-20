import { wrap                                         } from 'co';
import { map, uniq, compact                           } from 'lodash';
import { Observable, Subject                          } from 'rx';
import { props                                        } from 'bluebird';
import db                                               from '../../shared-backend/db';
import { getAll as getAllTags                         } from '../../shared-backend/model/Tags';
import { getReposWithIds                              } from '../../shared-backend/model/Repos';
import { transformReposForInsertion, createDataSource } from './util';

export default function (id) {
  const IDs = [];
  const source = createDataSource(id);

  const reposSource = source.flatMapWithMaxConcurrent(1, wrap(function *(repos) {
    const [githubIdLangMap, transformedRepos] = transformReposForInsertion(repos);
    const sql = db('repos').insert(transformedRepos);

    const { rows } = yield db.raw(
      '? ON CONFLICT (user_id, github_id) ' +
      'DO UPDATE SET (full_name, description, homepage, html_url, forks_count, stargazers_count) = ' +
      '(' +
        'EXCLUDED.full_name, EXCLUDED.description, EXCLUDED.homepage, ' +
        'EXCLUDED.html_url, EXCLUDED.forks_count, EXCLUDED.stargazers_count' +
      ') ' +
      'RETURNING id, github_id',
      [sql]
    );

    return rows.map(({ id: repo_id, github_id }) => {
      IDs.push(repo_id);
      return {id: repo_id, language: githubIdLangMap[github_id]};
    });
  }));

  const tagsSource = source.flatMapWithMaxConcurrent(1, wrap(function *(repos) {
    const languages = uniq(compact(map(repos, 'language')));
    const sql = db('tags').insert(languages.map((lang) => ({user_id: id, text: lang})));
    yield db.raw('? ON CONFLICT DO NOTHING', [sql]);
    const tags = yield db('tags').select('id', 'text').where({user_id: id});

    const languageTagMap = {};
    for (const {id: tag_id, text} of tags) {
      languageTagMap[text] = tag_id;
    }

    return languageTagMap;
  }));

  const progressSubject = new Subject();

  Observable
    .zip(reposSource, tagsSource)
    .flatMap(([repos, languageTagMap]) => {
      const entries = compact(repos.map(({id: repo_id, language}) => {
        if (language == null) {
          return null;
        }
        return { repo_id, tag_id: languageTagMap[language], user_id: id };
      }));

      return db
        .raw('? ON CONFLICT DO NOTHING', [db('repo_tags').insert(entries)])
        .then(() => {
          return props({
            repos: getReposWithIds(map(repos, 'id')),
            tags: getAllTags(id),
          });
        });
    })
    .subscribe(
      (data) => progressSubject.onNext({ type: 'PROGRESS', data }),
      (err) => progressSubject.onError(err),
      () => {
        db('repos')
          .where('user_id', id)
          .whereNotIn('id', IDs)
          .del()
          .returning('id')
          .then((deletedRepoIds) => {
            progressSubject.onNext({ type: 'DELETE', data: deletedRepoIds });
            progressSubject.onCompleted();
          });
      }
    );

  return progressSubject;
}

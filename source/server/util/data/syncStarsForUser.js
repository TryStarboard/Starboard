import co, { wrap } from 'co';
import { curry, pick, map, uniq, compact, omit } from 'lodash';
import parseLinkHeader from 'parse-link-header';
import { Observable, Subject } from 'rx';
import { props } from 'bluebird';
import github from '../github';
import db from '../db';
import { getAll as getAllTags } from './tags';
import { getReposWithIds } from './stars';

const transformRepo = curry(function (id, {starred_at, repo}) {
  const transformed = pick(repo, [
    'full_name',
    'description',
    'homepage',
    'html_url',
    'forks_count',
    'stargazers_count',
    'language',
  ]);

  transformed.user_id = id;
  transformed.github_id = repo.id;
  transformed.starred_at = starred_at;

  return transformed;
});

function createDataSource(id) {

  return Observable.create(function (observer) {

    let isStopped = false;

    co(function *() {

      const transformFunc = transformRepo(id);

      const [{ access_token }] = yield db('users').select('access_token').where({ id });
      const client = github.client(access_token);

      let page = 1;

      // Let's only support 2000 stars for now, 1 page shows 100 repos
      while (page <= 20 && !isStopped) {
        const [, repos, headers] = yield client.getOptionsAsync('/user/starred', {
          headers: {
            // Get "starred_at" property
            Accept: 'application/vnd.github.v3.star+json'
          }
        }, {
          per_page: 100,
          page,
        });

        observer.onNext(repos.map(transformFunc));

        const { next } = parseLinkHeader(headers.link);

        if (!next) {
          break;
        }

        page = next.page;
      }

      observer.onCompleted();

    }).catch(::observer.onError);

    return function () {
      isStopped = true;
    };
  });
}

function transformReposForInsertion(repos) {

  const githubIdLangMap = {};

  const transformedRepos = repos.map((repo) => {
    githubIdLangMap[repo.github_id] = repo.language;
    return omit(repo, ['language']);
  });

  return [githubIdLangMap, transformedRepos];
}

export default function (id) {

  const IDs = [];
  const source = createDataSource(id);

  const reposSource = source.flatMapWithMaxConcurrent(1, wrap(function *(repos) {
    const [githubIdLangMap, transformedRepos] = transformReposForInsertion(repos);
    const sql = db('repos').insert(transformedRepos);

    const { rows } = yield db.raw(
      '? ON CONFLICT (user_id, github_id) ' +
      'DO UPDATE SET (full_name, description, homepage, html_url, forks_count, stargazers_count) = ' +
      '(EXCLUDED.full_name, EXCLUDED.description, EXCLUDED.homepage, ' +
        'EXCLUDED.html_url, EXCLUDED.forks_count, EXCLUDED.stargazers_count) ' +
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
        return { repo_id, tag_id: languageTagMap[language] };
      }));

      return db.raw('? ON CONFLICT DO NOTHING', [db('repo_tags').insert(entries)])
        .then(() => {
          const idsOfCurrentBatch = map(repos, 'id');
          const reposP = getReposWithIds(idsOfCurrentBatch);
          const tagsP = getAllTags(id);
          return props({ repos: reposP, tags: tagsP });
        })
        .then(({ repos: repoRows, tags }) => ({ repos: repoRows, tags }));
    })
    .subscribe(
      (data) => progressSubject.onNext({ type: 'PROGRESS', data }),
      (err) => progressSubject.onError(err),
      () => {
        db('repos').where('user_id', id).whereNotIn('id', IDs).del().returning('id')
          .then((deletedRepoIds) => {
            progressSubject.onNext({ type: 'DELETE', data: deletedRepoIds });
            progressSubject.onCompleted();
          });
      }
    );

  return progressSubject;
}

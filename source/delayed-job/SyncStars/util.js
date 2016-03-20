import { curry, pick } from 'ramda';
import { fromCallback } from 'bluebird';
import co from 'co';
import { omit } from 'lodash';
import { Observable } from 'rx';
import parseLinkHeader from 'parse-link-header';

import github from '../../shared-backend/github';
import db from '../../shared-backend/db';

export const transformRepo = curry(function (id, {starred_at, repo}) {
  const transformed = pick([
    'full_name',
    'description',
    'homepage',
    'html_url',
    'forks_count',
    'stargazers_count',
    'language',
  ], repo);

  transformed.user_id = id;
  transformed.github_id = repo.id;
  transformed.starred_at = starred_at;

  return transformed;
});

const GET_STARRED_OPTS = {
  headers: {
    // Get "starred_at" property from Github API
    Accept: 'application/vnd.github.v3.star+json'
  }
};

export function getStarred(client, query) {
  return fromCallback((done) => {
    client.getOptions('/user/starred', GET_STARRED_OPTS, query, done);
  }, {multiArgs: true});
}

export function transformReposForInsertion(repos) {
  const githubIdLangMap = {};
  const transformedRepos = repos.map((repo) => {
    githubIdLangMap[repo.github_id] = repo.language;
    return omit(repo, ['language']);
  });
  return [githubIdLangMap, transformedRepos];
}

export function createDataSource(id) {
  return Observable.create((observer) => {
    let isStopped = false;

    co(function *() {
      const transformFunc = transformRepo(id);
      const [{ access_token }] = yield db('users').select('access_token').where({ id });
      const client = github.client(access_token);
      let page = 1;

      // Let's only support 2000 stars for now, 1 page shows 100 repos
      while (page <= 20 && !isStopped) {
        const query = { per_page: 100, page };
        const [, repos, headers] = yield getStarred(client, query);
        observer.onNext(repos.map(transformFunc));
        const linkHeader = parseLinkHeader(headers.link);
        if (!linkHeader || !linkHeader.next) {
          break;
        }
        page = linkHeader.next.page;
      }

      observer.onCompleted();
    }).catch(::observer.onError);

    return () => {
      isStopped = true;
    };
  });
}

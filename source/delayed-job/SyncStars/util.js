import { curry, pick, map, omit } from 'ramda';
import co from 'co';
import { Observable } from 'rx';
import parseLinkHeader from 'parse-link-header';

import github from '../../shared-backend/github';
import db     from '../../shared-backend/db';

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

export function getStarred(client, query) {
  return client.getOptionsAsync(
    '/user/starred',
    {
      headers: {
        // Get "starred_at" property from Github API
        Accept: 'application/vnd.github.v3.star+json'
      }
    },
    query
  );
}

export function transformReposForInsertion(repos) {
  const githubIdLangMap = {};
  const transformedRepos = repos.map((repo) => {
    githubIdLangMap[repo.github_id] = repo.language;
    return omit(['language'], repo);
  });
  return [githubIdLangMap, transformedRepos];
}

/**
 * Data source from Github, emit fetched data from github
 *
 * @param {number} id Local User ID
 *
 * @return {Observable} Emit two types of item
 *                      interface ReposItem {
 *                      	type: 'REPOS_ITEM',
 *                      	repos: Repo[],
 *                      }
 *                      interface SummaryItem {
 *                      	type: 'SUMMARY_ITEM',
 *                      	total_page: number,
 *                      }
 */
export function createDataSource(id) {
  return Observable.create((observer) => {
    let isStopped = false;

    co(function *() {
      const transformRepos = map(transformRepo(id));
      const [{ access_token }] = yield db('users').select('access_token').where({ id });
      const client = github.client(access_token);

      let page = 1;
      let gotTotalPage = false;

      // Let's only support 2000 stars for now, 1 page shows 100 repos
      while (page <= 20 && !isStopped) {
        const query = { per_page: 100, page };
        const [, repos, headers] = yield getStarred(client, query);

        const linkHeader = parseLinkHeader(headers.link);

        // Report total page number for tracking progress
        //
        if (!gotTotalPage && linkHeader && linkHeader.last) {
          gotTotalPage = true;
          observer.onNext({
            type: 'SUMMARY_ITEM',
            total_page: parseInt(linkHeader.last.page),
          });
        }

        observer.onNext({
          type: 'REPOS_ITEM',
          repos: transformRepos(repos),
        });

        if (!linkHeader || !linkHeader.next) {
          break;
        }

        page = linkHeader.next.page;
      }

      observer.onCompleted();
    })
    .catch(::observer.onError);

    return () => {
      isStopped = true;
    };
  });
}

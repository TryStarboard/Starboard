import { curry, pick, map, omit, pipe, path, defaultTo } from 'ramda';
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
  )
    .then(function ([, repos, headers]) {
      const {lastPage, nextPage} = getLinkHeaderInfo(headers.link);
      return {repos, lastPage, nextPage};
    });
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
 * @param {number} user_id Local User ID
 * @param {Object} client Github client to make API requests
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
function createDataSource(user_id, client) {
  const transformRepos = map(transformRepo(user_id));

  return Observable.create((observer) => {
    co(function *() {
      let gotTotalPage = false;
      let page = 1;

      // Let's only support 2000 stars for now, 1 page contains 100 repos
      while (page !== null && page <= 20) {
        const query = {per_page: 100, page};
        const {repos, lastPage, nextPage} = yield getStarred(client, query);

        // Report total page number for tracking progress
        //
        if (!gotTotalPage && lastPage !== null) {
          gotTotalPage = true;
          observer.onNext({type: 'SUMMARY_ITEM', total_page: lastPage});
        }

        observer.onNext({type: 'REPOS_ITEM', repos: transformRepos(repos)});
        page = nextPage;
      }

      observer.onCompleted();
    })
    .catch(::observer.onError);
  });
}

/**
  enum ParsedLinkHeaderRel {
    Next = 'next',
    Last = 'last',
    First = 'first',
    Prev = 'prev',
  }

  interface ParsedLinkHeaderItem {
    per_page: string;
    page: string;
    access_token: string;
    rel: ParsedLinkHeaderRel;
    url: string;
  }

  interface ParsedLinkHeader {
    next?: ParsedLinkHeaderItem;
    last?: ParsedLinkHeaderItem;
    first?: ParsedLinkHeaderItem;
    prev?: ParsedLinkHeaderItem;
  }

 * @param  {string} linkHeader "link" property from Headers
 * @return {Object} {lastPage?: number, nextPage?: number}
 */
function getLinkHeaderInfo(linkHeader) {
  const parsed = parseLinkHeader(linkHeader); // ParsedLinkHeader
  return {
    lastPage: pipe(path(['last', 'page']), parseInt, defaultTo(null))(parsed),
    nextPage: pipe(path(['next', 'page']), parseInt, defaultTo(null))(parsed),
  };
}

export function createRepoSource(user_id) {
  return Observable
    .fromPromise(getGithubClientForUser(user_id))
    .flatMap((client) => createDataSource(user_id, client));
}

function getGithubClientForUser(user_id) {
  return db('users').select('access_token').where({ id: user_id })
    .then(function ([{ access_token }]) {
      return github.client(access_token);
    });
}

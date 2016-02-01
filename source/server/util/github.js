import config from 'config';
import { wrap } from 'co';
import github from 'octonode';
import { promisifyAll } from 'bluebird';
import { pick, map, uniq, compact } from 'lodash';
import parseLinkHeader from 'parse-link-header';
import db from './db';

github.auth.config({
  id: config.get('github.clientID'),
  secret: config.get('github.clientSecret'),
});

promisifyAll(Object.getPrototypeOf(github.client()), {multiArgs: true});

export { github as default };

export const syncStarsForUser = wrap(function *(id) {
  const [{ access_token }] = yield db('users').select('access_token').where({ id });
  const client = github.client(access_token);

  let page = '1';
  let IDs = [];

  while (true) {
    const [, repos, headers] = yield client.getAsync('/user/starred', {
      per_page: 100,
      page,
    });

    // Transform data into format similar to repos table
    //

    const arr = repos.map((r) => {
      const obj = pick(r, [
        'full_name',
        'description',
        'homepage',
        'html_url',
        'forks_count',
        'stargazers_count',
        'language',
      ]);

      obj.user_id = id;
      obj.github_id = r.id;
      obj.starred_at = r.updated_at;

      return obj;
    });


    // Create tags
    //

    {
      const languages = uniq(compact(map(arr, 'language')));
      const sql = db('tags').insert(languages.map((lang) => ({user_id: id, text: lang})));
      yield db.raw('? ON CONFLICT DO NOTHING', [sql]);
    }

    break;

    // Insert repo data
    //

    const sql = db('repos').insert(arr);

    const { rows } = yield db.raw(
      '? ON CONFLICT (user_id, github_id) ' +
      'DO UPDATE SET (full_name, description, homepage, html_url, forks_count, stargazers_count) = ' +
      '(EXCLUDED.full_name, EXCLUDED.description, EXCLUDED.homepage, ' +
        'EXCLUDED.html_url, EXCLUDED.forks_count, EXCLUDED.stargazers_count) ' +
      'RETURNING "id"',
      [sql]);

    IDs = IDs.concat(map(rows, 'id'));

    const { next } = parseLinkHeader(headers.link);

    // if (!next) {
      break;
    // }

    page = next.page;
  }

  return IDs;
});

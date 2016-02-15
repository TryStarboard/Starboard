import { wrap } from 'co';
import db from '../db';

const SQL_PIECE1 = `
  SELECT repos.id AS id, full_name, description, homepage, html_url,
    array_remove(array_agg(tags.id ORDER BY repo_tags.id ASC), NULL) AS tags,
    extract(epoch from starred_at) AS starred_at
  FROM repos
  LEFT JOIN repo_tags ON repo_tags.repo_id = repos.id
  LEFT JOIN tags ON repo_tags.tag_id = tags.id`;

const SQL_PIECE2 = `
  GROUP BY repos.id
  ORDER BY repos.starred_at DESC`;

export const getAll = wrap(function *(id, limit) {
  let result;

  if (limit == null) {
    result = yield db.raw(
      `${SQL_PIECE1} WHERE repos.user_id = ? ${SQL_PIECE2}`,
      [id]
    );
  } else {
    result = yield db.raw(
      `${SQL_PIECE1} WHERE repos.user_id = ? ${SQL_PIECE2} LIMIT ?`,
      [id, limit]
    );
  }

  return result.rows;
});

export const getReposWithIds = wrap(function *(ids) {
  const {rows} = yield db.raw(
    `${SQL_PIECE1} WHERE repos.id IN (${ids.join(',')}) ${SQL_PIECE2}`);
  return rows;
});

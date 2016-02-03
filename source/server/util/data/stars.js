import { wrap } from 'co';
import db from '../db';

export const getAll = wrap(function *(id) {
  const { rows } = yield db.raw(`
    SELECT repos.id AS id, full_name, description, homepage, html_url,
      array_agg(tags.text) AS tag_texts
    FROM repos
    LEFT JOIN repo_tags ON repo_tags.repo_id = repos.id
    LEFT JOIN tags ON repo_tags.tag_id = tags.id
    WHERE repos.user_id = ?
    GROUP BY repos.id
    ORDER BY repos.starred_at DESC`,
    [id]
  );
  return rows;
});

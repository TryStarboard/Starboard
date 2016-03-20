import db from '../db';

function buildQuery() {
  return db
    .select(
      'repos.id AS id',
      'full_name',
      'description',
      'homepage',
      'html_url',
      db.raw('array_remove(array_agg(tags.id ORDER BY repo_tags.id ASC), NULL) AS tags'),
      db.raw('extract(epoch from starred_at) AS starred_at')
    )
    .from('repos')
    .leftJoin('repo_tags', 'repo_tags.repo_id', 'repos.id')
    .leftJoin('tags', 'repo_tags.tag_id', 'tags.id')
    .groupBy('repos.id')
    .orderBy('repos.starred_at', 'desc');
}

export function getAll(id, limit) {
  let query = buildQuery().where('repos.user_id', id);

  if (limit != null) {
    query = query.limit(limit);
  }

  return query;
}

export function getReposWithIds(ids) {
  return buildQuery().whereIn('repos.id', ids);
}

import { createSelector } from 'reselect';
import { prop, values, map, tap, pipe, merge, identity, sortBy, reverse, fromPairs, contains, filter, any, __ } from 'ramda';
import u from 'updeep';
import { DEFAULT_TAG_COLORS } from './const/DEFAULT_TAG_COLORS';

const assignDefaultColorToTag = (tag) => {
  const colors = DEFAULT_TAG_COLORS[tag.text.toLowerCase()];
  if (!colors) {
    return tag;
  }
  return merge(tag, {
    background_color: colors.bg,
    foreground_color: colors.fg,
  });
};

const selectRepos = createSelector(
  prop('filters'),
  prop('reposById'),
  (filters, reposById) => {
    if (filters.length) {
      return pipe(
        values,
        filter(pipe(prop('tags'), any(contains(__, filters)))),
        sortBy(prop('starred_at')),
        reverse,
        map(prop('id'))
      )(reposById);
    }

    return pipe(
      values,
      sortBy(prop('starred_at')),
      reverse,
      map(prop('id'))
    )(reposById);
  }
)

const updateTagsStateAffectedByFilter = createSelector(
  prop('filters'),
  prop('tagsById'),
  (filters, tagsById) => {
    const updates = fromPairs(filters.map((tagId) => [tagId, { isSelected: true }]));
    return u(updates, tagsById);
  }
)

export default createSelector(
  prop('filters'), // filters
  prop('reposById'), // reposById
  selectRepos, // repos
  prop('routes'),
  pipe(updateTagsStateAffectedByFilter, map(assignDefaultColorToTag)), // tagsById
  pipe(prop('tagsById'), values, sortBy(prop('id')), reverse, map(prop('id'))), // tags
  prop('ui'), // ui
  prop('user'), // user
  (filters, reposById, repos, routes, tagsById, tags, ui, user) =>
    ({ filters, reposById, repos, routes, tagsById, tags, ui, user })
);

/**
interface ComputedStoreShape {
  filters: number[];
  reposById: { [key string]: Repo };
  repos: number[];
  routes: RouteShape;
  tagsById: { [key string]: Tag },
  tags: number[];
  ui: UIShape;
  user: UserShape;
}
 */

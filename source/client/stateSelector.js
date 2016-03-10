import { createSelector } from 'reselect';
import { prop, values, map, tap, pipe, merge, identity, sortBy, reverse } from 'ramda';
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

export default createSelector(
  prop('filters'),
  prop('reposById'),
  pipe(prop('reposById'), values, sortBy(prop('starred_at')), reverse, map(prop('id'))),
  prop('routes'),
  pipe(prop('tagsById'), map(assignDefaultColorToTag)),
  pipe(prop('tagsById'), values, sortBy(prop('id')), reverse, map(prop('id'))),
  prop('ui'),
  prop('user'),
  (filters, reposById, repos, routes, tagsById, tags, ui, user) =>
    ({ filters, reposById, repos, routes, tagsById, tags, ui, user })
);

/**
interface ComputedStoreShape {
  filters:;
  repos:;
  routes: RouteShape;
  tagsById: { [key string]: Tag },
  tags: number[];
  ui: UIShape;
  user:;
}
 */

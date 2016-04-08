import {prop, values, map, pipe, merge, sortBy, reverse, toPairs, fromPairs, contains, filter, all, not, __} from 'ramda';
import {createSelector}     from 'reselect';
import u                    from 'updeep';
import {DEFAULT_TAG_COLORS} from './const/DEFAULT_TAG_COLORS';

// Helpers
//
function createStateTransformer(transforms) {
  const transformPairs = toPairs(transforms);
  return function (state) {
    const newStatePairs = transformPairs.map(([ key, transform ]) => [ key, transform(state) ]);
    return fromPairs(newStatePairs);
  };
}

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
    return pipe(
      values,
      filter(pipe(
        prop('tags'),
        (tags) => all(contains(__, tags), filters)
      )),
      sortBy(prop('starred_at')),
      reverse,
      map(prop('id'))
    )(reposById);
  }
);

const updateTagsStateAffectedByFilter = createSelector(
  prop('filters'),
  prop('tagsById'),
  (filters, tagsById) => {
    const updates = fromPairs(filters.map((tagId) => [tagId, {isSelected: true}]));
    return u(updates, tagsById);
  }
);

const selectTags = createSelector(
  prop('filters'),
  prop('tagsById'),
  (filters, tagsById) => {
    return pipe(
      values,
      filter(pipe(
        prop('id'),
        contains(__, filters),
        not
      )),
      sortBy(prop('id')),
      reverse,
      map(prop('id'))
    )(tagsById);
  }
);

/**
interface ComputedStoreShape {
  filters   : number[];
  reposById : { [key string] : Repo };
  repos     : number[];
  routes    : RouteShape;
  tagsById  : { [key string] : Tag },
  tags      : number[];
  ui        : UIShape;
  user      : UserShape;
}
*/

export default createStateTransformer({
  filters: prop('filters'),
  reposById: prop('reposById'),
  repos: selectRepos,
  routes: prop('routes'),
  tagsById: pipe(updateTagsStateAffectedByFilter, map(assignDefaultColorToTag)),
  tags: selectTags,
  ui: prop('ui'),
  user: prop('user'),
});

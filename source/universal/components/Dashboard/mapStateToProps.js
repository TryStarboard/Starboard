import { createSelector } from 'reselect';
import defaults from 'lodash/fp/defaults';
import keyBy from 'lodash/fp/keyBy';
import assign from 'lodash/fp/assign';
import { DEFAULT_TAG_COLORS } from '../../const/DEFAULT_TAG_COLORS';

const reposSelector = (state) => state.stars;
const tagsSelector = (state) => state.tags;
const uiSelector = (state) => state.ui;

const tagsWithColorsSelector = createSelector(
  tagsSelector,
  (tags) => {
    return tags.map((tag) => {
      const colors = DEFAULT_TAG_COLORS[tag.text.toLowerCase()];
      if (!colors) {
        return tag;
      }
      return defaults(tag, {
        background_color: colors.bg,
        foreground_color: colors.fg,
      });
    });
  }
);

const tagsMapSelector = createSelector(
  tagsWithColorsSelector,
  keyBy('id')
);

const reposWithTagDetailSelector = createSelector(
  reposSelector,
  tagsMapSelector,
  (repos, tags) => {
    return repos.map((repo) => {
      return assign(repo, {
        tags: repo.tags.map((tag_id) => tags[tag_id])
      });
    });
  }
);

export default createSelector(
  tagsWithColorsSelector,
  reposWithTagDetailSelector,
  uiSelector,
  (tags, repos, ui) => ({tags, stars: repos, ui})
);

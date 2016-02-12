import { combineReducers } from 'redux';
import { browserHistory } from 'react-router';
import defaults from 'lodash/fp/defaults';
import {
  LOGOUT,
  SYNC_REPOS
} from '../../actions';
import { DEFAULT_TAG_COLORS } from '../../const';

function user(state = null, { type, payload }) {
  switch (type) {
  case `${LOGOUT}_FULFILLED`:
    browserHistory.push('/login');
    return null;
  default:
    return state;
  }
}

function stars(state = [], { type, payload }) {
  switch (type) {
  default:
    return state;
  }
}

function tags(state = [], { type, payload }) {
  switch (type) {
  default:
    return state.map((tag) => {
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
}

export default combineReducers({
  user,
  stars,
  tags,
});

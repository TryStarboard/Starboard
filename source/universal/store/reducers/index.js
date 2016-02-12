import { combineReducers } from 'redux';
import { browserHistory } from 'react-router';
import { findIndex, assign, sortBy } from 'lodash/fp';
import defaults from 'lodash/fp/defaults';
import {
  LOGOUT
} from '../../actions';
import {
  UPDATE_SOME_REPOS,
  REMOVE_REPOS
} from '../../actions/serverActions';
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

function stars(state = [], { type, payload: repos }) {
  switch (type) {
  case UPDATE_SOME_REPOS:
    // Merge new or existing repos with current list of repos
    const currentState = state.slice(0);
    const newRepos = [];
    for (const repo of repos) {
      const existingIndex = findIndex(['id', repo.id], currentState);
      if (existingIndex > -1) {
        currentState.splice(existingIndex, 1, assign(currentState[existingIndex], repo));
      } else {
        newRepos.push(repo);
      }
    }
    return sortBy('id', currentState.concat(newRepos)).reverse();
  case REMOVE_REPOS:
    // TODO: handle repo removal
    return state;
  default:
    return sortBy('id', state).reverse();
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

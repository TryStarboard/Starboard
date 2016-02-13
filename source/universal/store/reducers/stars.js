import { findIndex, assign, sortBy } from 'lodash/fp';
import { UPDATE_SOME_REPOS, REMOVE_REPOS } from '../../actions/serverActions';

export default function (state = [], { type, payload: repos }) {
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
    return sortBy('id', currentState.concat(newRepos));
  case REMOVE_REPOS:
    // TODO: handle repo removal
    return state;
  default:
    return sortBy('id', state);
  }
}

import findIndex from 'lodash/findIndex';
import assign from 'lodash/fp/assign';
import sortBy from 'lodash/fp/sortBy';
import differenceWith from 'lodash/differenceWith';
import { UPDATE_SOME_REPOS, REMOVE_REPOS } from '../../actions/serverActions';

export default function (state = [], { type, payload }) {
  switch (type) {

  case UPDATE_SOME_REPOS:
    // Merge new or existing repos with current list of repos
    const currentState = state.slice(0);
    const newRepos = [];
    for (const repo of payload) {
      const existingIndex = findIndex(['id', repo.id], currentState);
      if (existingIndex > -1) {
        currentState.splice(existingIndex, 1, assign(currentState[existingIndex], repo));
      } else {
        newRepos.push(repo);
      }
    }
    return sortBy('id', currentState.concat(newRepos));

  case REMOVE_REPOS:
    return differenceWith(state, payload, (repo, id) => {
      return repo.id === id;
    });

  default:
    return sortBy('id', state);
  }
}

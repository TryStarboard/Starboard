import findIndex from 'lodash/findIndex';
import orderBy from 'lodash/orderBy';
import assign from 'lodash/fp/assign';
import without from 'lodash/without';
import differenceWith from 'lodash/differenceWith';
import { UPDATE_SOME_REPOS, REMOVE_REPOS } from '../../actions/serverActions';
import { APPLY_TAG_TO_REPO, DELETE_TAG } from '../../actions';

function mergeReposArray(currentArr, incomingArr) {
  const currentArrCopy = currentArr.slice(0);
  const incomingArrCopy = incomingArr.slice(0);

  for (let i = 0; i < currentArrCopy.length; i++) {
    const currentRepo = currentArrCopy[i];
    const incomingRepoIndex = findIndex(incomingArrCopy, ['id', currentRepo.id]);
    if (incomingRepoIndex > -1) {
      currentArrCopy.splice(i, 1, assign(currentRepo, incomingArrCopy[incomingRepoIndex]));
      incomingArrCopy.splice(incomingRepoIndex, 1);
    }
  }

  return incomingArrCopy.concat(currentArrCopy);
}

function applyTagToRepo(state, payload) {
  const copy = state.slice(0);
  const repoIndex = findIndex(copy, ['id', payload.repo_id]);
  const repo = copy[repoIndex];
  copy.splice(repoIndex, 1, assign(repo, {tags: repo.tags.concat([payload.tag_id])}));
  return copy;
}

export default function (state = [], { type, payload }) {
  switch (type) {
  case UPDATE_SOME_REPOS:
    return orderBy(mergeReposArray(state, payload), ['starred_at'], ['desc']);
  case REMOVE_REPOS:
    return differenceWith(state, payload, (repo, id) => repo.id === id);
  case `${APPLY_TAG_TO_REPO}_PENDING`: // Optimistic updates
    return applyTagToRepo(state, payload);
  case `${DELETE_TAG}_PENDING`:
    return state.map((repo) => {
      return assign(repo, {tags: without(repo.tags, payload.id)});
    });
  default:
    return state;
  }
}

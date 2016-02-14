import findIndex from 'lodash/findIndex';
import orderBy from 'lodash/orderBy';
import assign from 'lodash/fp/assign';
import differenceWith from 'lodash/differenceWith';
import { UPDATE_SOME_REPOS, REMOVE_REPOS } from '../../actions/serverActions';

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

export default function (state = [], { type, payload }) {
  switch (type) {
  case UPDATE_SOME_REPOS:
    return orderBy(mergeReposArray(state, payload), ['starred_at'], ['desc']);
  case REMOVE_REPOS:
    return differenceWith(state, payload, (repo, id) => repo.id === id);
  default:
    return orderBy(state, ['starred_at'], ['desc']);
  }
}

// import findIndex from 'lodash/findIndex';
// import orderBy from 'lodash/orderBy';
// import assign from 'lodash/fp/assign';
// import without from 'lodash/without';
// import differenceWith from 'lodash/differenceWith';
import { indexBy, prop, append } from 'ramda';
import u from 'updeep';
import { UPDATE_SOME_REPOS, REMOVE_REPOS } from '../actions/serverActions';
import {
  APPLY_TAG_TO_REPO,
  DELETE_TAG,
  REMOVE_REPO_TAG,
  GET_ALL_REPOS
} from '../actions/creators';

// function mergeReposArray(currentArr, incomingArr) {
//   const currentArrCopy = currentArr.slice(0);
//   const incomingArrCopy = incomingArr.slice(0);

//   for (let i = 0; i < currentArrCopy.length; i++) {
//     const currentRepo = currentArrCopy[i];
//     const incomingRepoIndex = findIndex(incomingArrCopy, ['id', currentRepo.id]);
//     if (incomingRepoIndex > -1) {
//       currentArrCopy.splice(i, 1, assign(currentRepo, incomingArrCopy[incomingRepoIndex]));
//       incomingArrCopy.splice(incomingRepoIndex, 1);
//     }
//   }

//   return incomingArrCopy.concat(currentArrCopy);
// }

function applyTagToRepo(state, payload) {
  return u({
    [payload.repo_id]: {
      tags: append(payload.tag_id)
    }
  }, state);
}

// function removeTagFromRepo(state, payload) {
//   const copy = state.slice(0);
//   const repoIndex = findIndex(copy, ['id', payload.repo_id]);
//   const repo = copy[repoIndex];
//   copy.splice(repoIndex, 1, assign(repo, {tags: without(repo.tags, payload.tag_id)}));
//   return copy;
// }

export default function (state = {}, { type, payload }) {
  switch (type) {
  case `${GET_ALL_REPOS}_FULFILLED`:
    return indexBy(prop('id'), payload.data);
  // case UPDATE_SOME_REPOS:
  //   return orderBy(mergeReposArray(state, payload), ['starred_at'], ['desc']);
  // case REMOVE_REPOS:
  //   return differenceWith(state, payload, (repo, id) => repo.id === id);
  case `${APPLY_TAG_TO_REPO}_PENDING`:
    return applyTagToRepo(state, payload);
  // case `${DELETE_TAG}_PENDING`:
  //   return state.map((repo) => {
  //     return assign(repo, {tags: without(repo.tags, payload.id)});
  //   });
  // case `${REMOVE_REPO_TAG}_PENDING`:
  //   return removeTagFromRepo(state, payload);
  default:
    return state;
  }
}

import {indexBy, prop, append, reject, equals, merge, pipe, contains, __, map} from 'ramda';
import u from 'updeep';
import {UPDATE_SOME_REPOS, REMOVE_REPOS} from '../../shared/action-types';
import {
  APPLY_TAG_TO_REPO,
  DELETE_TAG,
  REMOVE_REPO_TAG,
  GET_ALL_REPOS
} from '../actions/creators';

function applyTagToRepo(state, payload) {
  return u({
    [payload.repo_id]: {
      tags: append(payload.tag_id)
    }
  }, state);
}

function removeTagFromRepo(state, payload) {
  return u({
    [payload.repo_id]: {
      tags: reject(equals(payload.tag_id))
    }
  }, state);
}

export default function (state = {}, {type, payload}) {
  switch (type) {
  case `${GET_ALL_REPOS}_FULFILLED`:
    return indexBy(prop('id'), payload.data);
  case UPDATE_SOME_REPOS:
    const someReposById = indexBy(prop('id'), payload);
    return merge(state, someReposById);
  case REMOVE_REPOS:
    return reject(pipe(prop('id'), contains(__, payload)), state);
  case `${APPLY_TAG_TO_REPO}_PENDING`:
    return applyTagToRepo(state, payload);
  case `${DELETE_TAG}_PENDING`:
    return map(
      u({
        tags: reject(equals(payload.tagId))
      }),
      state);
  case `${REMOVE_REPO_TAG}_PENDING`:
    return removeTagFromRepo(state, payload);
  default:
    return state;
  }
}

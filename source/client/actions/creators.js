import axios     from 'axios';
import validate  from 'validate.js';
import {collect} from '../helpers/form';
import mixpanel  from '../mixpanel';

export const GET_CURRENT_USER      = 'GET_CURRENT_USER';
export const GET_ALL_REPOS         = 'GET_ALL_REPOS';
export const GET_ALL_TAGS          = 'GET_ALL_TAGS';
export const CLOSE_ADD_TAG_MODAL   = 'CLOSE_ADD_TAG_MODAL';
export const OPEN_ADD_TAG_MODAL    = 'OPEN_ADD_TAG_MODAL';
export const ADD_TAG               = 'ADD_TAG';
export const ADD_TAG_INVALID_INPUT = 'ADD_TAG_INVALID_INPUT';
export const APPLY_TAG_TO_REPO     = 'APPLY_TAG_TO_REPO';
export const BEGIN_DRAG_TAG        = 'BEGIN_DRAG_TAG';
export const END_DRAG_TAG          = 'END_DRAG_TAG';
export const DELETE_TAG            = 'DELETE_TAG';
export const REMOVE_REPO_TAG       = 'REMOVE_REPO_TAG';
export const SELECT_TAG            = 'SELECT_TAG';
export const REMOVE_FILTER         = 'REMOVE_FILTER';

export function getCurrentUser() {
  return {
    type: GET_CURRENT_USER,
    payload: {
      promise: axios.get('/api/v1/me')
        .tap(({data: user}) => mixpanel.identify(user.id)),
    }
  };
}

export function getAllRepos() {
  return {
    type: GET_ALL_REPOS,
    payload: {
      promise: axios.get('/api/v1/repos'),
    }
  };
}

export function getAllTags() {
  return {
    type: GET_ALL_TAGS,
    payload: {
      promise: axios.get('/api/v1/tags'),
    }
  };
}

export function openAddTagModal() {
  mixpanel.track(OPEN_ADD_TAG_MODAL);
  return {
    type: OPEN_ADD_TAG_MODAL,
  };
}

export function closeAddTagModal() {
  mixpanel.track(CLOSE_ADD_TAG_MODAL);
  return {
    type: CLOSE_ADD_TAG_MODAL,
  };
}

export function addTag(event) {
  event.preventDefault();

  const inputs = collect(event.target);
  const errors = validate(inputs, {
    tag_text: {
      presence: true,
    },
  });

  if (errors != null) {
    return {
      type: ADD_TAG_INVALID_INPUT,
      payload: errors,
    };
  }

  return function (dispatch) {
    mixpanel.track(ADD_TAG);
    dispatch({
      type: ADD_TAG,
      payload: {
        promise: axios.post('/api/v1/tags', { name: inputs.tag_text })
          .tap((data) => dispatch(closeAddTagModal())),
      },
    });
  };
}

export function applyTagToRepo(tag_id, repo_id) {
  mixpanel.track(APPLY_TAG_TO_REPO);
  return {
    type: APPLY_TAG_TO_REPO,
    payload: {
      data: { tag_id, repo_id },
      promise: axios.post('/api/v1/repo_tags', { tag_id, repo_id }),
    }
  };
}

export function beginDragTag() {
  mixpanel.track(BEGIN_DRAG_TAG);
  return {
    type: BEGIN_DRAG_TAG,
  };
}

export function endDragTag() {
  mixpanel.track(END_DRAG_TAG);
  return {
    type: END_DRAG_TAG,
  };
}

export function deleteTag({ tagId }) {
  mixpanel.track(DELETE_TAG);
  return {
    type: DELETE_TAG,
    payload: {
      data: { tagId },
      promise: axios.delete(`/api/v1/tags/${tagId}`),
    }
  };
}

export function removeRepoTag(repoTag) {
  mixpanel.track(REMOVE_REPO_TAG);
  return {
    type: REMOVE_REPO_TAG,
    payload: {
      data: repoTag,
      promise: axios.delete(`/api/v1/repo_tags`, { data: repoTag }),
    }
  };
}

export function selectTag(tagId) {
  mixpanel.track(SELECT_TAG);
  return {
    type: SELECT_TAG,
    payload: { tagId },
  };
}

export function removeFilter(tagId) {
  mixpanel.track(REMOVE_FILTER);
  return {
    type: REMOVE_FILTER,
    payload: {tagId},
  };
}

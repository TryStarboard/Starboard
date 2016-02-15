import axios from 'axios';
import { browserHistory } from 'react-router';
import validate from 'validate.js';
import tap from 'lodash/fp/tap';
import { collect } from '../utils/form';

export const LOGOUT = 'LOGOUT';
export const CLOSE_ADD_TAG_MODAL = 'CLOSE_ADD_TAG_MODAL';
export const OPEN_ADD_TAG_MODAL = 'OPEN_ADD_TAG_MODAL';
export const ADD_TAG = 'ADD_TAG';
export const ADD_TAG_INVALID_INPUT = 'ADD_TAG_INVALID_INPUT';
export const APPLY_TAG_TO_REPO = 'APPLY_TAG_TO_REPO';
export const BEGIN_DRAG_TAG = 'BEGIN_DRAG_TAG';
export const END_DRAG_TAG = 'END_DRAG_TAG';

export function logout() {
  return {
    type: LOGOUT,
    payload: {
      promise: axios.get('/api/v1/logout').then(() => {
        browserHistory.push('/login');
      }),
    }
  };
}

export function openAddTagModal() {
  return {
    type: OPEN_ADD_TAG_MODAL,
  };
}

export function closeAddTagModal() {
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
    dispatch({
      type: ADD_TAG,
      payload: {
        promise: axios.post('/api/v1/tags', { name: inputs.tag_text })
          .then(tap( (data) => dispatch(closeAddTagModal()) )),
      },
    });
  };
}

export function applyTagToRepo(tag_id, repo_id) {
  return {
    type: APPLY_TAG_TO_REPO,
    payload: {
      data: { tag_id, repo_id },
      promise: axios.post('/api/v1/repo_tags', { tag_id, repo_id }),
    }
  };
}

export function beginDragTag() {
  return {
    type: BEGIN_DRAG_TAG,
  };
}

export function endDragTag() {
  return {
    type: END_DRAG_TAG,
  };
}

import axios from 'axios';
import { browserHistory } from 'react-router';
import validate from 'validate.js';
import { collect } from '../utils/form';

export const LOGOUT = 'LOGOUT';
export const CLOSE_ADD_TAG_MODAL = 'CLOSE_ADD_TAG_MODAL';
export const OPEN_ADD_TAG_MODAL = 'OPEN_ADD_TAG_MODAL';
export const ADD_TAG = 'ADD_TAG';
export const ADD_TAG_INVALID_INPUT = 'ADD_TAG_INVALID_INPUT';

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
          .then((data) => {
            dispatch(closeAddTagModal());
            return data;
          }),
      },
    });
  };
}

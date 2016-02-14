/*eslint no-alert:0 no-undef:0*/

import axios from 'axios';
import { browserHistory } from 'react-router';

export const LOGOUT = 'LOGOUT';
export const ADD_TAG = 'ADD_TAG';
export const ADD_TAG_FAILED = 'ADD_TAG_FAILED';

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

export function addTag() {
  const name = prompt('enter the tag name');

  if (name != null && name !== '') {
    return {
      type: ADD_TAG,
      payload: {
        promise: axios.post('/api/v1/tags', { name })
      }
    };
  }

  return {
    type: ADD_TAG_FAILED,
  };
}

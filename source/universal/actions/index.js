import axios from 'axios';

export const LOGOUT = 'LOGOUT';
export const ADD_TAG = 'ADD_TAG';

export function logout() {
  return {
    type: LOGOUT,
    payload: {
      promise: axios.get('/api/v1/logout')
    }
  };
}

export function addTag(tagName) {
  return {
    type: ADD_TAG,
    payload: {
      promise: axios.post('/api/v1/tags', {name: tagName})
    }
  };
}

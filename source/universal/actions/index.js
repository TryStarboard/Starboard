import axios from 'axios';

export const LOGOUT = 'LOGOUT';
export const GET_STARS = 'GET_STARS';

export function logout() {
  return {
    type: LOGOUT,
    payload: {
      promise: axios.get('/api/v1/logout')
    }
  };
}

export function getStars() {
  return {
    type: GET_STARS,
    payload: {
      promise: axios.get('/api/v1/stars')
    }
  };
}

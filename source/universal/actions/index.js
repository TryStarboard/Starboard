import axios from 'axios';

export const LOGOUT = 'LOGOUT';

export function logout() {
  return {
    type: LOGOUT,
    payload: {
      promise: axios.get('/api/v1/logout')
    }
  };
}

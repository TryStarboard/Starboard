import axios from 'axios';

export const LOGOUT = 'LOGOUT';
export const SYNC_REPOS = 'SYNC_REPOS';

export function logout() {
  return {
    type: LOGOUT,
    payload: {
      promise: axios.get('/api/v1/logout')
    }
  };
}

export function syncRepos() {
  return {
    type: SYNC_REPOS,
    payload: {
      promise: axios.get('/api/v1/stars/sync')
    }
  };
}

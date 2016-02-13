import axios from 'axios';
import { browserHistory } from 'react-router';

export const LOGOUT = 'LOGOUT';

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

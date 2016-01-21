import axios from 'axios';

export const SIGNUP = 'SIGNUP';

export function signup(data) {
  return {
    type: SIGNUP,
    payload: {
      promise: axios.post('/api/v1/signup', data)
    }
  };
}

import axios from 'axios';

export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export function signup(data) {
  return {
    type: SIGNUP,
    payload: {
      promise: axios.post('/api/v1/signup', data)
    }
  };
}

export function login(data) {
  return {
    type: LOGIN,
    payload: {
      promise: axios.post('/api/v1/login', data)
    }
  };
}

export function logout() {
  return {
    type: LOGOUT,
    payload: {
      promise: axios.get('/api/v1/logout')
    }
  };
}

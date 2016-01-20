import axios from 'axios';
import { collect } from '../../client/js/util/form';

export const SUBMIT_LOGIN = 'SUBMIT_LOGIN';

export function submitLogin(form) {
  return {
    type: SUBMIT_LOGIN,
    payload: {
      promise: axios.post('/api/v1/login', collect(form))
    }
  };
}

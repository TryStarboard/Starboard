import { collect } from '../util/form';

const SUBMIT_LOGIN = 'SUBMIT_LOGIN';

export function submitLogin(form) {
  return {
    type: SUBMIT_LOGIN,
    data: collect(form),
  };
}

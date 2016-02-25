import { LOGOUT, DELETE_ACCOUNT } from '../../actions/creators';

export default function (state = null, { type, payload }) {
  switch (type) {
  case `${LOGOUT}_FULFILLED`:
    return null;
  case `${DELETE_ACCOUNT}_FULFILLED`:
    return null;
  default:
    return state;
  }
}

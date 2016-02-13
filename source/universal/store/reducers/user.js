import { LOGOUT } from '../../actions';

export default function (state = null, { type, payload }) {
  switch (type) {
  case `${LOGOUT}_FULFILLED`:
    return null;
  default:
    return state;
  }
}

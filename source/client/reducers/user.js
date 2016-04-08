import {GET_CURRENT_USER, LOGOUT, DELETE_ACCOUNT} from '../actions/creators';

export default function (state = {}, {type, payload}) {
  switch (type) {
  case `${GET_CURRENT_USER}_FULFILLED`:
    return payload.data;
  case `${LOGOUT}_FULFILLED`:
    return null;
  case `${DELETE_ACCOUNT}_FULFILLED`:
    return null;
  default:
    return state;
  }
}

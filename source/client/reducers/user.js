import { Reducer } from 'redux';

// import { LOGOUT, DELETE_ACCOUNT } from '../../actions/creators';

interface UserState {
  id: number,
}

export default function (state: UserState = null, { type, user }): UserState {
  switch (type) {
  // case `${LOGOUT}_FULFILLED`:
  //   return null;
  // case `${DELETE_ACCOUNT}_FULFILLED`:
  //   return null;
  default:
    return state;
  }
}

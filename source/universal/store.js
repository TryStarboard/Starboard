import { combineReducers, createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import { browserHistory } from 'react-router';
import {
  SIGNUP,
  LOGIN,
  LOGOUT
} from './actions';

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware(),
  createLogger()
)(createStore);

const reducers = combineReducers({
  form(state = {}, { type, payload }) {
    switch (type) {
    case `${SIGNUP}_REJECTED`:
    case `${LOGIN}_REJECTED`:
      return payload.data;
    case `${SIGNUP}_FULFILLED`:
    case `${LOGIN}_FULFILLED`:
      return {};
    default:
      return state;
    }
  },
  user(state = null, { type, payload }) {
    switch (type) {
    case `${SIGNUP}_FULFILLED`:
    case `${LOGIN}_FULFILLED`:
      browserHistory.push('/dashboard');
      return payload.data;
    case `${LOGOUT}_FULFILLED`:
      browserHistory.push('/login');
      return null;
    default:
      return state;
    }
  }
});

export default function (state) {
  return createStoreWithMiddleware(reducers, state);
}

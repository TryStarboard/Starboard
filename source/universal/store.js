import { combineReducers, createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import { browserHistory } from 'react-router';
import {
  LOGOUT,
  GET_STARS
} from './actions';

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware(),
  createLogger({logger: console})
)(createStore);

const reducers = combineReducers({
  user(state = null, { type, payload }) {
    switch (type) {
    case `${LOGOUT}_FULFILLED`:
      browserHistory.push('/login');
      return null;
    default:
      return state;
    }
  },
  stars(state = [], { type, payload }) {
    switch (type) {
    case `${GET_STARS}_FULFILLED`:
      return payload.data;
    default:
      return state;
    }
  },
  tags(state = [], { type, payload }) {
    switch (type) {
    default:
      return state;
    }
  },
});

export default function (state) {
  return createStoreWithMiddleware(reducers, state);
}

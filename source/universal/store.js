import { combineReducers, createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import { browserHistory } from 'react-router';
import {
  LOGOUT
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
  }
});

export default function (state) {
  return createStoreWithMiddleware(reducers, state);
}

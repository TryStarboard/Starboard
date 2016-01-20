import { combineReducers, createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import {
  SUBMIT_LOGIN
} from './actions';

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware(),
  createLogger()
)(createStore);

const reducers = combineReducers({
  title(state = null, action) {
    return state;
  },
  user(state = null, action) {
    switch (action.type) {
    case SUBMIT_LOGIN:
      return state;
    default:
      return state;
    }
  }
});

export default function (state) {
  return createStoreWithMiddleware(reducers, state);
}

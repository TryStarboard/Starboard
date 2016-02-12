import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware(),
  createLogger({logger: console})
)(createStore);

export default function (state) {
  return createStoreWithMiddleware(reducers, state);
}

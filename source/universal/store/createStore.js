/*global window*/

import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import reducers from './reducers';

const createStoreWithMiddleware = compose(
  applyMiddleware(
    promiseMiddleware(),
    createLogger({logger: console})
  ),
  // For Redux devtool
  typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ?
    window.devToolsExtension() : (f) => f
)(createStore);

export default function (state) {
  return createStoreWithMiddleware(reducers, state);
}

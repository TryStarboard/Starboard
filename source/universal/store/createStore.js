/*global window*/

import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import identity from 'lodash/identity';
import reducers from './reducers';

const middleware = applyMiddleware(
  promiseMiddleware(),
  thunk,
  createLogger({logger: console})
);

const reduxDevtool =
  typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ?
  window.devToolsExtension() : identity;

const createStoreWithMiddleware = compose(reduxDevtool, middleware)(createStore);

export default function (state) {
  return createStoreWithMiddleware(reducers, state);
}

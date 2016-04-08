/*eslint no-process-env:0*/
/*global process, require*/

import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk             from 'redux-thunk';
import {identity}        from 'ramda';
import stateSelector     from './stateSelector';
import filters           from './reducers/filters';
import reposById         from './reducers/reposById';
import routes            from './reducers/routes';
import tagsById          from './reducers/tagsById';
import ui                from './reducers/ui';
import user              from './reducers/user';

const middlewares = [promiseMiddleware(), thunk];

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(require('redux-logger')());
}

const middleware = applyMiddleware.apply(this, middlewares);

let createStoreWithMiddleware;

if (process.env.NODE_ENV !== 'production') {
  const reduxDevtool =
    typeof window.devToolsExtension !== 'undefined' ?
      window.devToolsExtension() : identity;
  createStoreWithMiddleware = compose(middleware, reduxDevtool)(createStore);
} else {
  createStoreWithMiddleware = compose(middleware)(createStore);
}

const store = createStoreWithMiddleware(combineReducers({
  filters,
  reposById,
  routes,
  tagsById,
  ui,
  user,
}));

// Transform original state tree from store
//
const _getState = store.getState;

store.getState = function () {
  const state = _getState.call(store);
  const transformedState = stateSelector(state);
  return transformedState;
};

export {store as default};

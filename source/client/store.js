import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import stateSelector from './stateSelector';

import filters  from './reducers/filters';
import repos    from './reducers/repos';
import routes   from './reducers/routes';
import tagsById from './reducers/tagsById';
import ui       from './reducers/ui';
import user     from './reducers/user';

const middleware = applyMiddleware(
  promiseMiddleware(),
  thunk,
  createLogger()
);

const reduxDevtool = typeof window.devToolsExtension !== 'undefined' ?
  window.devToolsExtension() : identity;

const createStoreWithMiddleware = compose(middleware, reduxDevtool)(createStore);

const store = createStoreWithMiddleware(combineReducers({
  filters,
  repos,
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
  return stateSelector(state);
};

export { store as default };

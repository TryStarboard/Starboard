import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import stateSelector from './stateSelector';

import filters   from './reducers/filters';
import reposById from './reducers/reposById';
import routes    from './reducers/routes';
import tagsById  from './reducers/tagsById';
import ui        from './reducers/ui';
import user      from './reducers/user';

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
  console.log(transformedState);
  return transformedState;
};

export { store as default };

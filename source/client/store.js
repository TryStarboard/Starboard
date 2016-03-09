import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import identity from 'lodash/identity';
import filters from './reducers/filters';
import repos   from './reducers/repos';
import routes  from './reducers/routes';
import tags    from './reducers/tags';
import ui      from './reducers/ui';
import user    from './reducers/user';

const middleware = applyMiddleware(
  promiseMiddleware(),
  thunk,
  createLogger()
);

const reduxDevtool = typeof window.devToolsExtension !== 'undefined' ?
  window.devToolsExtension() : identity;

const createStoreWithMiddleware = compose(middleware, reduxDevtool)(createStore);

export default createStoreWithMiddleware(combineReducers({
  filters,
  repos,
  routes,
  tags,
  ui,
  user,
}));

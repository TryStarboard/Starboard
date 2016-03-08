import { createStore, combineReducers } from 'redux';
import { start } from 'routility';
import filters from './reducers/filters';
import repos from './reducers/repos';
import routes from './reducers/routes';
import tags from './reducers/tags';
import ui from './reducers/ui';
import user from './reducers/user';
import { routes as routesDefinition } from './routes';
import { newRoute } from './actions/index';

const store = createStore(combineReducers({
  filters,
  repos,
  routes,
  tags,
  ui,
  user,
}));

export const navTo = start(
  routesDefinition,
  (state) => store.dispatch(newRoute(state)),
  { browserHistory: true });

export { store as default };

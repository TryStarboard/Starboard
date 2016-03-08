import { createStore, combineReducers } from 'redux';
import { start } from 'routility';
import user from './reducers/user.ts';
import routes from './reducers/routes.ts';
import { routes as routesDefinition } from './routes.tsx';
import { newRoute } from './actions/index.ts';

interface StoreShape {
  user: {},
  routes: {},
}

const store = createStore(combineReducers<StoreShape>({
  user,
  routes,
}));

export const navTo: (path: string) => any = start(
  routesDefinition,
  (state) => store.dispatch(newRoute(state)),
  { browserHistory: true });

export { store as default };

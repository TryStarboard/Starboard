import { Action } from 'redux';

const NEW_ROUTE = 'NEW_ROUTE';

interface NewRouteAction extends Action {
  data: {}
}

export function newRoute(state: {}): NewRouteAction {
  return {
    type: NEW_ROUTE,
    data: state,
  };
}

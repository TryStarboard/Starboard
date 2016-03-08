export const NEW_ROUTE = 'NEW_ROUTE';

export function newRoute(state) {
  return {
    type: NEW_ROUTE,
    data: state,
  };
}

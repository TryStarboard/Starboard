import {parse} from 'routility';

export default function routilityRouterFactory(routes, stateHandler) {

  const parser = parse(routes);

  return function *routilityRouter(next) {
    if (this.method !== 'GET') {
      yield next;
      return;
    }

    const state = parser(this.url);

    if (!state) {
      yield next;
      return;
    }

    if (state.redirectTo) {
      this.redirect(state.redirectTo);
      return;
    }

    yield* stateHandler.call(this, next, state);
  };
}

declare module 'routility' {

  interface RouteDefinition {
  }

  export interface RoutilityOptions {
    browserHistory: boolean;
  }

  export function r(path: string, name: string, childRoutes?: RouteDefinition[]): RouteDefinition;

  export function redirect(path: string, target: string);

  export function start(definition: RouteDefinition, handler: (state: Object) => void, options?: RoutilityOptions);

}

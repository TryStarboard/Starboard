import { renderToString } from 'react/dist/react.min';
import { routes as routesDefinition } from '../../../universal/routes';
import routilityRouterFactory from './routilityRouterFactory';
import createApp from '../util/createApp';

export default routilityRouterFactory(routesDefinition, function *(next, routes) {

  const state = yield {
    routes,
  };

  yield this.render('index', {
    content: renderToString(createApp(state)),
    data: state,
  });

});

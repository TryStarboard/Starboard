import { path } from 'ramda';
import { renderToString } from 'react/dist/react.min';
import { routes as routesDefinition } from '../../../universal/routes';
import { getAll as getAllRepos } from '../../util/data/Repos';
import { getAll as getAllTags } from '../../util/data/Tags';
import { findById as findUserById } from '../../model/User';
import createApp from '../util/createApp';
import routilityRouterFactory from './routilityRouterFactory';

export default routilityRouterFactory(routesDefinition, function *(next, routes) {

  const state = yield {
    routes,
    user: (path(['root', 'dashboard'], routes) || path(['root', 'user_profile'], routes))
      && findUserById(this.req.user.id),
    repos: path(['root', 'dashboard'], routes) && getAllRepos(this.req.user.id, 100),
    tags: path(['root', 'dashboard'], routes) && getAllTags(this.req.user.id),
  };

  yield this.render('index', {
    content: renderToString(createApp(state)),
    data: state,
  });

});

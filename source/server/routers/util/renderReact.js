import React, { PropTypes, Component } from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import { fromCallback } from 'bluebird';
import * as actions from '../../../universal/actions';
import routes from '../../../universal/components/routes';
import createStoreWithInitState from '../../../universal/createStoreWithInitState';

function matchPath(url) {
  return fromCallback(
    (done) => match({routes, location: url}, done),
    {multiArgs: true}
  );
}

function createApp(renderProps, state) {
  class App extends Component {

    static childContextTypes = {
      logout: PropTypes.func.isRequired,
      syncRepos: PropTypes.func.isRequired,
    };

    getChildContext() {
      return {
        logout: actions.logout,
        syncRepos: actions.syncRepos,
      };
    }

    render() {
      return (
        <Provider store={createStoreWithInitState(state)}>
          <RouterContext {...renderProps}/>
        </Provider>
      );
    }
  }

  return <App/>;
}

function *renderTemplate(renderProps, state) {
  yield this.render('index', {
    content: renderToString(createApp(renderProps, state)),
    data: state,
  });
}

export default function *() {
  const [redirectLocation, renderProps] = yield matchPath(this.req.url);

  if (redirectLocation) {
    this.redirect(redirectLocation.pathname + redirectLocation.search);
  } else if (renderProps) {
    yield renderTemplate.call(this, renderProps, this.reactState || {});
  }
}

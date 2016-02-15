import React, { PropTypes, Component } from 'react';
import { renderToString } from 'react-dom/dist/react-dom-server.min';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import { fromCallback } from 'bluebird';
import { noop } from 'lodash/fp';
import routes from '../../../universal/routes';
import createStore from '../../../universal/store/createStore';

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
      addTag: PropTypes.func.isRequired,
      openAddTagModal: PropTypes.func.isRequired,
      closeAddTagModal: PropTypes.func.isRequired,
      applyTagToRepo: PropTypes.func.isRequired,
    };

    getChildContext() {
      return {
        logout: noop,
        syncRepos: noop,
        addTag: noop,
        openAddTagModal: noop,
        closeAddTagModal: noop,
        applyTagToRepo: noop,
      };
    }

    render() {
      return (
        <Provider store={createStore(state)}>
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

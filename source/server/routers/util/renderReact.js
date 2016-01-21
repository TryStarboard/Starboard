import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import { fromCallback } from 'bluebird';
import routes from '../../../universal/components/routes';
import createStoreWithInitState from '../../../universal/store';

function matchPath(url) {
  return fromCallback(
    (done) => match({routes, location: url}, done),
    {multiArgs: true}
  );
}

function *renderTemplate(renderProps, state) {
  const app = (
    <Provider store={createStoreWithInitState(state)}>
      <RouterContext {...renderProps}/>
    </Provider>
  );

  yield this.render('index', {
    content: renderToString(app),
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

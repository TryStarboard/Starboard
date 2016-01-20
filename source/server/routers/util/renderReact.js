import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import routes from '../../../universal/routes';
import store from '../../../universal/store';

function matchPath(url) {
  return new Promise((resolve, reject) => {
    match({routes, location: url}, (err, redirectLocation, renderProps) => {
      if (err) {
        reject(err);
        return;
      }

      resolve([redirectLocation, renderProps]);
    });
  });
}

export default function *() {
  const [redirectLocation, renderProps] = yield matchPath(this.req.url);

  if (redirectLocation) {
    this.redirect(redirectLocation.pathname + redirectLocation.search);

  } else if (renderProps) {

    const app = (
      <Provider store={store}>
        <RouterContext {...renderProps}/>
      </Provider>
    );

    yield this.render('index', {content: renderToString(app)});
  }
}

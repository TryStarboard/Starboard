import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
// import routes from '../../client/component/routes';

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
  // console.log(this.req.user);
  // const [redirectLocation, renderProps] = yield matchPath(this.req.url);
  //
  // if (redirectLocation) {
  //   this.redirect(redirectLocation.pathname + redirectLocation.search);
  // } else if (renderProps) {
  yield this.render('index', {
    content: ''
    // content: renderToString(createElement(RouterContext, renderProps))
  });
  // }
}

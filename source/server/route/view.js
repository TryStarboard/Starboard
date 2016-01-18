import { Router } from 'express';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../../client/component/routes';

const router = Router();

router.use(function (req, res, next) {
  match({routes, location: req.url}, (err, redirectLocation, renderProps) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      res.render('index', {
        content: renderToString(createElement(RouterContext, renderProps))
      });
    } else {
      next();
    }
  });
});

export { router as default };

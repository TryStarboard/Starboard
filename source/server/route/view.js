import { Router } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../../client/component/routes';

const router = Router();

function handle(req, res) {
  match({routes, location: req.url}, (err, redirectLocation, renderProps) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      res.render('index', {content: renderToString(<RouterContext {...renderProps}/>)});
    } else {
      res.status(404).send('Not found');
    }
  });
}

router.get('/', handle);
router.get('/login', handle);
router.get('/signup', handle);

export { router as default };

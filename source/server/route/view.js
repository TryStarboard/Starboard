import { Router } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../../client/component/App';

const router = Router();

router.get('/', function (req, res) {
  if (req.session.count == null) {
    req.session.count = 1;
  } else {
    req.session.count += 1;
  }
  res.render('index', {content: renderToString(<App count={req.session.count}/>)});
});

export { router as default };

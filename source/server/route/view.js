import { Router } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../../client/component/App';

const router = Router();

router.get('/', function (req, res) {
  res.render('index', {content: renderToString(<App/>)});
});

export { router as default };

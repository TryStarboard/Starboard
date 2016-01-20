import Router from 'koa-router';
import renderReact from '../util/renderReact';

const publicRouter = new Router();

publicRouter.get('/', renderReact);

export { publicRouter as default };

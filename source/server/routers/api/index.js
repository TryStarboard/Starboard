import Router from 'koa-router';
import unauthedRoute from './unauthed';
import authedRoute from './authed';

const router = new Router();

router.use('/api/v1', authedRoute.routes(), authedRoute.allowedMethods());
router.use('/api/v1', unauthedRoute.routes(), unauthedRoute.allowedMethods());

export default router.routes();

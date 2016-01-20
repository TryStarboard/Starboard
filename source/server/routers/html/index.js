import Router from 'koa-router';
import publicRouter from './public';
import unauthedRouter from './unauthed';
import authedRouter from './authed';

const router = new Router();

router.use(publicRouter.routes(), publicRouter.allowedMethods());
router.use(unauthedRouter.routes(), unauthedRouter.allowedMethods());
router.use(authedRouter.routes(), authedRouter.allowedMethods());

export default router.routes();

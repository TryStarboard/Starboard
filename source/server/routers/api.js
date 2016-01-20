import createRouter from 'koa-router';
// import { localAuth } from '../util/auth';

const userManagement = createRouter();

// userManagement
//   .post('/login', localAuth);

const router = createRouter();
router.use('/api/v1', userManagement.routes(), userManagement.allowedMethods());

export default router.routes();

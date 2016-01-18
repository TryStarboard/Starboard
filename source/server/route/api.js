import { Router } from 'express';

const router = Router();

router.get('/api/v1/user', function (req, res) {
  res.send({id: 123});
});

export { router as default };

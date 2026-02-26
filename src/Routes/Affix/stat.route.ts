import { Router } from 'express';

import {
  createStatController,
  getStatbyKeyController,
  getStatsController,
} from '@/Controllers/Affix/stat.controller';
import { requireAdmin } from '@/Middlewares/requireAuthMiddleware';
import { validate } from '@/Middlewares/validate.middleware';
import {
  createStatSchema,
  getStatsQuerySchema,
} from '@/validates/stat.validate';
export const statRouter = Router();
statRouter.post(
  '/create-stat',
  requireAdmin,
  validate(createStatSchema),
  createStatController
);
statRouter.get(
  '/stats',
  // validate(getStatssQuerySchema),
  // requireAdmin,
  getStatsController
);
statRouter.get(
  '/stats/key/:key',
  validate(getStatsQuerySchema),
  requireAdmin,
  getStatbyKeyController
);

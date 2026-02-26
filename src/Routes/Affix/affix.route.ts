import { Router } from 'express';

import {
  createAffixController,
  getAffixes,
  getAffixesbyKeyController,
} from '@/Controllers/Affix/affix.controller';
import {
  createBaseAffixController,
  getBaseAffixController,
} from '@/Controllers/Affix/baseAffix.controller';
import { requireAdmin } from '@/Middlewares/requireAuthMiddleware';
import { validate } from '@/Middlewares/validate.middleware';
import { createAffixSchema } from '@/validates/affix.validate';
import { createBaseAffixSchema } from '@/validates/baseAffix.validate';
export const affixRouter = Router();
affixRouter.post(
  '/create-affix',
  validate(createAffixSchema),
  requireAdmin,
  createAffixController
);
affixRouter.post(
  '/create-base-affix',
  validate(createBaseAffixSchema),
  // requireAdmin,
  createBaseAffixController
);
affixRouter.get('/affixes', getAffixes);
affixRouter.get(
  '/affixes/key/:key',
  validate(createAffixSchema),
  // requireAdmin,
  getAffixesbyKeyController
);
affixRouter.get(
  '/base-affix',
  // requireAdmin,
  getBaseAffixController
);

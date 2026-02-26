import { Router } from 'express';

import { createItemBaseController } from '@/Controllers/item/itemBase.controller';
import { requireAdmin } from '@/Middlewares/requireAuthMiddleware';
import { upload } from '@/Middlewares/upload.middleware';
import { validate } from '@/Middlewares/validate.middleware';
import { createItemBaseSchema } from '@/validates/item/itemBase.validate';
export const itemRouter = Router();
itemRouter.post(
  '/item-base',
  requireAdmin,
  upload.single('image'),
  validate(createItemBaseSchema),
  createItemBaseController
);

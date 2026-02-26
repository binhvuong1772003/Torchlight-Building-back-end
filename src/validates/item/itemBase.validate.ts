import { ItemCategory } from '@prisma/client';
import { z } from 'zod';
import { createImageSchema } from '../image/image.validate';

export const createItemBaseSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().optional(),
  category: z.nativeEnum(ItemCategory),
  baseAffixKeys: z.array(z.string()).optional().default([]),
});

export type CreateItemBaseInput = z.infer<typeof createItemBaseSchema>;
export type ImageInput = z.infer<typeof createImageSchema>;

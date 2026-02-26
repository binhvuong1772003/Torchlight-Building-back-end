// src/modules/affixes/affix.validation.ts

import { AffixType, AffixTier, ItemCategory } from '@prisma/client';
import { z } from 'zod';

// Roll table schema
const affixStatRollTableSchema = z
  .object({
    category: z.nativeEnum(ItemCategory),
    minValue: z.number().min(0, 'Min value must be positive'),
    maxValue: z.number().min(0, 'Max value must be positive'),
  })
  .refine((data) => data.maxValue >= data.minValue, {
    message: 'Max value must be greater than or equal to min value',
  });

// Affix stat schema
const affixStatSchema = z.object({
  statKey: z.string().min(2, 'Stat key must be at least 2 characters'),

  rollTables: z
    .array(affixStatRollTableSchema)
    .min(1, 'At least one roll table is required'),
});

// Create affix schema
export const createAffixSchema = z.object({
  key: z
    .string()
    .min(2, 'Key must be at least 2 characters')
    .max(50, 'Key must be at most 50 characters')
    .regex(
      /^[a-z_]+$/,
      'Key must contain only lowercase letters and underscores'
    ),

  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),

  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),

  type: z.nativeEnum(AffixType, {
    errorMap: () => ({ message: 'Invalid affix type' }),
  }),

  tier: z.nativeEnum(AffixTier, {
    errorMap: () => ({ message: 'Invalid affix tier' }),
  }),

  tierlevel: z
    .number()
    .int('Tier level must be an integer')
    .min(0, 'Tier level must be at least 0')
    .max(5, 'Tier level cannot exceed 5'),

  tags: z.array(z.string()).default([]),

  minItemLevel: z
    .number()
    .int('Min item level must be an integer')
    .min(1, 'Min item level must be at least 1')
    .max(100, 'Min item level cannot exceed 100'),

  maxItemLevel: z
    .number()
    .int('Max item level must be an integer')
    .min(1, 'Max item level must be at least 1')
    .max(100, 'Max item level cannot exceed 100')
    .optional()
    .nullable(),

  stats: z
    .array(affixStatSchema)
    .min(1, 'At least one stat is required')
    .max(5, 'Maximum 5 stats per affix'),
});

export const updateAffixSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .optional(),

  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional()
    .nullable(),

  tags: z.array(z.string()).optional(),

  maxItemLevel: z
    .number()
    .int('Max item level must be an integer')
    .min(1, 'Max item level must be at least 1')
    .max(100, 'Max item level cannot exceed 100')
    .optional()
    .nullable(),
});

export const getAffixesQuerySchema = z.object({
  type: z.nativeEnum(AffixType).optional(),
  tier: z.nativeEnum(AffixTier).optional(),
  category: z.nativeEnum(ItemCategory).optional(),
  minItemLevel: z.coerce.number().int().min(1).max(100).optional(),
  maxItemLevel: z.coerce.number().int().min(1).max(100).optional(),
  tags: z.string().optional(), // comma-separated
  search: z.string().optional(),
});

// Export types
export type CreateAffixInput = z.infer<typeof createAffixSchema>;
export type UpdateAffixInput = z.infer<typeof updateAffixSchema>;
export type GetAffixesQueryInput = z.infer<typeof getAffixesQuerySchema>;

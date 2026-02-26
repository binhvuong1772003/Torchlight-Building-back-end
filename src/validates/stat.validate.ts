// src/modules/stats/stats.validation.ts
import { StatValueType, StatCategory } from '@prisma/client';
import { z } from 'zod';

export const createStatSchema = z.object({
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

  valueType: z.nativeEnum(StatValueType, {
    errorMap: () => ({
      message: 'Invalid value type. Must be FLAT, PERCENTAGE, or MULTIPLIER',
    }),
  }),

  category: z.nativeEnum(StatCategory, {
    errorMap: () => ({
      message:
        'Invalid category. Must be OFFENSIVE, DEFENSIVE, UTILITY, or RESOURCE',
    }),
  }),
});

export const updateStatSchema = z.object({
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

  icon: z
    .string()
    .max(10, 'Icon must be at most 10 characters')
    .optional()
    .nullable(),

  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional()
    .nullable(),
});

export const getStatsQuerySchema = z.object({
  category: z.nativeEnum(StatCategory).optional(),
  valueType: z.nativeEnum(StatValueType).optional(),
  search: z.string().optional(),
});

// Export inferred types from Zod schemas
export type CreateStatInput = z.infer<typeof createStatSchema>;
export type UpdateStatInput = z.infer<typeof updateStatSchema>;
export type GetStatsQueryInput = z.infer<typeof getStatsQuerySchema>;

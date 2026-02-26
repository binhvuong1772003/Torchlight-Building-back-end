import { z } from 'zod';

// Create
export const createBaseAffixSchema = z.object({
  key: z.string().min(1).toLowerCase().trim(),
  name: z.string().min(1),
  description: z.string().optional(),
  minItemLevel: z.number().int().min(1).default(1),
  isPriceless: z.boolean().default(false),
  stats: z
    .array(
      z.object({
        statKey: z.string().min(1),
        value: z.number(),
      })
    )
    .optional()
    .default([]),
});

// Update
export const updateBaseAffixSchema = z.object({
  params: z.object({
    key: z.string().min(1),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    minItemLevel: z.number().int().min(1).optional(),
    isPriceless: z.boolean().optional(),
  }),
});

// Get query
export const getBaseAffixQuerySchema = z.object({
  isPriceless: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
  minItemLevel: z.string().optional(),
});

// Attach to ItemBase
export const attachBaseAffixSchema = z.object({
  params: z.object({
    itemBaseKey: z.string().min(1),
  }),
  body: z.object({
    baseAffixKey: z.string().min(1),
  }),
});

// Add stat to BaseAffix
export const addStatToBaseAffixSchema = z.object({
  params: z.object({
    key: z.string().min(1),
  }),
  body: z.object({
    statKey: z.string().min(1),
    value: z.number(),
  }),
});

export type CreateBaseAffixInput = z.infer<typeof createBaseAffixSchema>;
export type UpdateBaseAffixInput = z.infer<
  typeof updateBaseAffixSchema
>['body'];
export type GetBaseAffixQueryInput = z.infer<typeof getBaseAffixQuerySchema>;
export type AttachBaseAffixInput = z.infer<
  typeof attachBaseAffixSchema
>['body'];
export type AddStatToBaseAffixInput = z.infer<
  typeof addStatToBaseAffixSchema
>['body'];

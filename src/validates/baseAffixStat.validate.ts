import { z } from 'zod';
const statScheme = z.object({
  statKey: z.string().min(2, 'Stat key must be at least 2 characters'),
  value: z.number(),
});
export const createBaseAffixStatSchema = z.object({
  baseAffixId: z.string(),
  statKey: z.string(),
  stats: z
    .array(statScheme)
    .min(1, 'At least one stat is required')
    .max(5, 'Maximum 5 stats per affix'),
});
export type CreateBaseAffixStatInput = z.infer<
  typeof createBaseAffixStatSchema
>;

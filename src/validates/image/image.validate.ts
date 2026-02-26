import { z } from 'zod';
export const createImageSchema = z.object({
  url: z.string(),
  secureUrl: z.string(),
  publicId: z.string(),
});

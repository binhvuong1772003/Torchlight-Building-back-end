import z from 'zod';
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const loginSchema = registerSchema;
export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatar: z.string().nullable(),
  role: z.enum(['USER', 'ADMIN']), // dựa trên UserRole enum
  googleId: z.string().nullable(),
  password: z.string().nullable(),
  isActive: z.boolean(),
  emailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshTokenSchema>;

export type UserEntity = z.infer<typeof userSchema>;

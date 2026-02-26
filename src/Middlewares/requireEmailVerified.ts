// middlewares/requireEmailVerified.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/ApiError';
import { db } from '@/db/prisma';

export const requireEmailVerified = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // giả sử authenticateJWT đã gắn req.user
    const userId = (req as { user?: { id: string } }).user?.id;

    if (!userId) throw new ApiError(401, 'Unauthorized');

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    });

    if (!user) throw new ApiError(404, 'User not found');
    if (!user.emailVerified)
      throw new ApiError(
        403,
        'Email not verified. Please verify your email first.'
      );

    next();
  } catch (err) {
    next(err);
  }
};

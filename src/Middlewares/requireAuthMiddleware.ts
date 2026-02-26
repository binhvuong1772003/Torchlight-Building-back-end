import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/jwt';
import { UserRole } from '@prisma/client';
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      role: UserRole;
    };
  }
}
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    console.log(decoded.role);
    if (decoded.role !== UserRole.ADMIN) {
      return res.status(403).json({
        message: 'Forbidden - Admin Only',
      });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

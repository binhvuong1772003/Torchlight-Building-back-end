// middlewares/error-handler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/ApiError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Lỗi chủ động (business error)
  if (err instanceof ApiError) {
    console.log(err);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors ?? null,
    });
  }

  // Lỗi không lường trước
  console.error('UNEXPECTED ERROR:', err);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

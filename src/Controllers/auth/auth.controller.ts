import { Request, Response, NextFunction } from 'express';
import {
  loginService,
  registerService,
  sendVerifyEmailService,
  verifyEmail,
  refreshTokenService,
  getMeService,
} from '@/Services/Auth/auth.service';
import type { LoginInput, RegisterInput } from '@/validates/auth.validate';
import { ApiError } from '@/utils/ApiError';
import { verifyRefreshToken } from '@/utils/jwt';
import { updateRefreshToken } from '@/models.ts/auth.model';
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input = req.body as RegisterInput;
    const { accessToken, refreshToken } = await registerService(input);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    return res.status(201).json({
      success: true,
      data: accessToken,
    });
  } catch (err) {
    next(err);
  }
};
export const sendEmailVerifyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input = req.body;
    await sendVerifyEmailService(input.email);
    return res.status(200).json('Email Verification Send Success');
  } catch (err) {
    next(err);
  }
};
export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.query.token;
    const result = await verifyEmail(token as string);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Lấy dữ liệu từ body
    const input = req.body as LoginInput;

    // Gọi service login (trả về accessToken + refreshToken)
    const { accessToken, refreshToken, user } = await loginService(input);

    // Set refreshToken vào cookie httpOnly
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      secure: process.env.NODE_ENV === 'production', // chỉ HTTPS nếu production
    });

    // Trả accessToken về frontend
    return res.status(200).json({
      success: true,
      accessToken: accessToken,
      user: { id: user.id, email: user.email },
      // frontend sẽ attach vào header Authorization
    });
  } catch (err: any) {
    next(err);
  }
};
export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new ApiError(401, 'No refresh token');

    const { accessToken } = await refreshTokenService(refreshToken);

    return res.json({ success: true, data: accessToken });
  } catch (err) {
    next(err);
  }
};
// auth.controller.ts
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken) as { userId: string };
      await updateRefreshToken(payload.userId, null); // xóa refreshToken trong DB
    }
    res.clearCookie('refreshToken');
    return res.status(200).json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};
export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getMeService(req.user!.userId);
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

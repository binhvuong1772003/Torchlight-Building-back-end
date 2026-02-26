import { Router } from 'express';

import {
  loginController,
  refreshTokenController,
  registerController,
  sendEmailVerifyController,
  verifyEmailController,
  logoutController,
  getMeController,
} from '@/Controllers/auth/auth.controller';
import { requireAuth } from '@/Middlewares/requireAuthMiddleware';
import { validate } from '@/Middlewares/validate.middleware';
import { loginSchema, registerSchema } from '@/validates/auth.validate';
export const authRouter = Router();
authRouter.post('/Register', validate(registerSchema), registerController);
authRouter.post('/login', validate(loginSchema), loginController);
authRouter.post('/send-verification-email', sendEmailVerifyController);
authRouter.get('/verify-email', verifyEmailController);
authRouter.post('/refresh-token', refreshTokenController);
authRouter.post('/logout', logoutController);
authRouter.get('/me', requireAuth, getMeController);
// router.get(
//   '/protected',
//   authenticateJWT, // check JWT và gắn req.user
//   requireEmailVerified, // check emailVerified
//   someProtectedController
// );

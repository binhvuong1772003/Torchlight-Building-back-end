import crypto from 'crypto';

import { db } from '@/db/prisma';
import {
  createUser,
  findUserByEmail,
  updateRefreshToken,
  findUserById,
  createVerifyToken,
  findVerifyToken,
  deleteVerifyToken,
} from '@/models.ts/auth.model';
import { ApiError } from '@/utils/ApiError';
import { hashPassword, comparePassword } from '@/utils/hash';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt';
import { transporter } from '@/utils/mailer';
import type { RegisterInput, LoginInput } from '@/validates/auth.validate';

export const registerService = async (input: RegisterInput) => {
  const { email, password } = input;

  // 1️⃣ check email đã tồn tại
  const existed = await findUserByEmail(email);
  if (existed) throw new ApiError(409, 'Email already exists');

  // 2️⃣ hash password
  const hashed = await hashPassword(password);

  // 3️⃣ tạo user
  const user = await createUser({ email, password: hashed });

  // 4️⃣ tạo token
  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id });

  // 5️⃣ update refresh token (nếu DB có field này)
  await updateRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      // ← thêm user vào response
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginService = async (input: LoginInput) => {
  const { email, password } = input;
  const user = await findUserByEmail(email);
  if (!user || !user.password) throw new ApiError(401, 'Invalid credentials');

  const ok = await comparePassword(password, user.password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id });

  await updateRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      // ← thêm vào
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const refreshTokenService = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken) as { userId: string };

  const user = await findUserById(payload.userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const newAccessToken = signAccessToken({ userId: user.id, role: user.role });

  return { accessToken: newAccessToken };
};
export const sendVerifyEmailService = async (email: string) => {
  const token = crypto.randomBytes(32).toString('hex');
  const user = await findUserByEmail(email);
  if (!user) throw new ApiError(404, 'User Not Found');
  await db.emailVerificationToken.deleteMany({
    where: { userId: user.id },
  });
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  await createVerifyToken(user.id, token, expiresAt);
  const verifyLink = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Email from TLOB',
    html: `
      <h2>Email Verification</h2>
      <p>Click link below to verify:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `,
  });
};

export const verifyEmail = async (token: string) => {
  const record = await findVerifyToken(token);
  if (!record) throw new ApiError(401, 'Invalid Token');
  if (record.expiresAt < new Date()) throw new ApiError(401, 'Token Expired');
  await db.user.update({
    where: { id: record.userId },
    data: { emailVerified: true },
  });
  await deleteVerifyToken(token);
  return { message: 'Email verified successfully' };
};
export const getMeService = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
};

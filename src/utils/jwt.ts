import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '@/config/jwt';
import { UserRole } from '@prisma/client';

/**
 * ==============================
 * TOKEN PAYLOAD TYPES
 * ==============================
 */

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  userId: string;
}

/**
 * ==============================
 * SIGN TOKENS
 * ==============================
 */

export const signAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, jwtConfig.accessTokenSecret, {
    expiresIn: jwtConfig.accessTokenExpiresIn,
  } as SignOptions);
};

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, jwtConfig.refreshTokenSecret, {
    expiresIn: jwtConfig.refreshTokenExpiresIn,
  } as SignOptions);
};

/**
 * ==============================
 * VERIFY TOKENS
 * ==============================
 */

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, jwtConfig.accessTokenSecret) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, jwtConfig.refreshTokenSecret) as RefreshTokenPayload;
};

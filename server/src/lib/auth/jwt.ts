import type { TokenPayload, TokenPair, TokenExpiration, TokenInput, SignOptions, JwtPayload } from '@/types';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { appConfig } from '@/config/app.config';
import { UnauthorizedError } from '@/utils/errors';

const signToken = (payload: TokenPayload, secret: string, expiresIn: TokenExpiration): string => {
  const options: SignOptions = {
    expiresIn,
    issuer: 'projecthub-api'
  };

  return jwt.sign(payload, secret, options);
};

const verifyToken = <T extends JwtPayload>(
  token: string,
  secret: string,
  errorMessage: string
): T => {
  try {
    const decoded = jwt.verify(token, secret) as T;
    if (typeof decoded === 'string') {
      throw new UnauthorizedError(errorMessage);
    }

    return decoded as T;
  } catch (error) {
    throw new UnauthorizedError(errorMessage);
  }
};

export const jwtService = {
  generateTokenPair(payload: TokenInput): TokenPair {
    const basePayload: TokenPayload = {
      userId: payload._id,
      email: payload.email,
      role: payload.role
    };

    const accessToken = signToken(basePayload, appConfig.jwt.secret, appConfig.jwt.expiresIn);
    const refreshToken = signToken(
      basePayload,
      appConfig.jwt.refreshSecret,
      appConfig.jwt.refreshExpiresIn
    );

    return { accessToken, refreshToken };
  },

  verifyAccessToken(token: string): TokenPayload {
    return verifyToken<TokenPayload>(token, appConfig.jwt.secret, 'Invalid access token');
  },

  verifyRefreshToken(token: string): TokenPayload {
    return verifyToken<TokenPayload>(
      token,
      appConfig.jwt.refreshSecret,
      'Invalid refresh token'
    );
  },

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
};
import type { JwtPayload, SignOptions } from 'jsonwebtoken';

export type { JwtPayload, SignOptions } from 'jsonwebtoken';

export type { RedisClientType } from 'redis';

export type TokenInput = {
  _id: string;
  email: string;
  role: string;
};

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export type TokenExpiration = NonNullable<SignOptions['expiresIn']>;

export type { Transporter } from 'nodemailer';
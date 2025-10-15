import env from '@/config/env';
import { AuthService } from '@/services/auth.service';
import { InternalServerError } from '@/utils/errors';
import { ErrorLog, logger } from '@/utils/logger';
import { sendSuccess } from '@/utils/response';
import type { Request, Response } from 'express';

const authService = new AuthService();

const signup = async (req: Request, res: Response) => {
  try {
    const { user, tokens } = await authService.register(req.body);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 60 * 1000
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userObj = user.toObject();
    const { password: _password, refreshTokens: _refreshTokens, ...sanitizedUser } = userObj;
    return sendSuccess(res, { user: sanitizedUser, /*tokens*/ }, 201);
  } catch (error) {
    if (env.NODE_ENV === 'development') logger.error(error);
    throw new InternalServerError();
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { user, tokens } = await authService.login(req.body);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 60 * 1000
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userObj = user.toObject();
    const { password: _password, refreshTokens: _refreshTokens, ...sanitizedUser } = userObj;
    return sendSuccess(res, { user: sanitizedUser, /*tokens*/ }, 200);
  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    // const refreshToken = req.cookies.refreshToken;
    // decoded = jwtService.verifyRefreshToken(refreshToken);
    // await authService.logout(userId, refreshToken);
    // res.clearCookie('accessToken');
    // res.clearCookie('refreshToken');
    // return sendSuccess(res, {}, 200);
  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
}

const forgotPassword = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
}

const resetPassword = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
}

const verifyEmail = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
}

const refreshToken = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
}

const googleOAuth = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
}

const discordOAuth = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
}

export default {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  googleOAuth,
  discordOAuth
}
import type { TokenPair, Request, Response, GoogleProfileType } from '@/types';
import env from '@/config/env';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { appConfig } from '@/config/app.config';
import { jwtService } from '@/lib/auth/jwt';
import { authService } from '@/services/auth.service';
import { AppError } from '@/utils/errors';

const setCookie = (res: Response, tokens: TokenPair) => {
  res.cookie('accessToken', tokens.accessToken, appConfig.cookie.accessToken);
  res.cookie('refreshToken', tokens.refreshToken, appConfig.cookie.refreshToken);
}

const signup = async (req: Request, res: Response) => {
  try {
    const { user, tokens } = await authService.register(req.body);

    setCookie(res, tokens);

    const userObj = user.toObject();
    const { password: _password, refreshTokens: _refreshTokens, ...sanitizedUser } = userObj;
    return sendSuccess(res, {
      user: sanitizedUser,
      /*tokens*/
    }, 201);
  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { user, tokens } = await authService.login(req.body);

    setCookie(res, tokens);

    const userObj = user.toObject();
    const { password: _password, refreshTokens: _refreshTokens, ...sanitizedUser } = userObj;
    return sendSuccess(res, {
      user: sanitizedUser,
      /*tokens*/
    }, 200);
  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwtService.verifyRefreshToken(refreshToken);
    await authService.logout(decoded.userId, refreshToken);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return sendSuccess(res, {
      message: 'Logged out successfully',
      user: decoded
    }, 200);
  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
}

const forgotPassword = async (req: Request, res: Response) => {
  try {
    await authService.requestPasswordReset(req.body.email);
    return sendSuccess(res, {
      message: 'Password reset email sent successfully',
    }, 200);
  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
}

const resetPassword = async (req: Request, res: Response) => {
  try {
    await authService.resetPassword(req.body);
    return sendSuccess(res, {
      message: 'Password reset successfully',
    }, 200);
  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
}

const verifyEmail = async (req: Request, res: Response) => {
  try {
    await authService.verifyEmail(req.body.token);
    return sendSuccess(res, {
      message: 'Email verified successfully',
    }, 200);
  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
}

const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwtService.verifyRefreshToken(refreshToken);
    const tokens = await authService.refreshToken(refreshToken);
    setCookie(res, tokens);
    return sendSuccess(res, {
      user: decoded,
      // tokens
    }, 200);
  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
}

const googleOAuthCallback = async (req: Request, res: Response) => {
  try {
    const tokens = await authService.googleOAuthCallback(req.user as GoogleProfileType);

    setCookie(res, tokens);

    res.redirect(env.FRONTEND_REDIRECT_URL || "/app");
  } catch (error) {
    ErrorLog(error as unknown as Error)
  }
}

const discordOAuthCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query as { code: string };

    const authResponse = await authService.discordOAuthCallback(code);

    setCookie(res, authResponse.tokens);

    res.redirect(env.FRONTEND_REDIRECT_URL || "/app")

  } catch (error: any) {
    ErrorLog(error);
    if (error instanceof AppError) {
      return sendError(res, error.code, error.message, error.statusCode, error.details);
    }
    return sendError(res, 'DISCORD_OAUTH_FAILED', 'Discord OAuth failed');
  }
};

export default {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  googleOAuthCallback,
  discordOAuthCallback
}
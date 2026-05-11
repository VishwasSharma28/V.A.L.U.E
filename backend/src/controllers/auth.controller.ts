import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { env } from '../config/env';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.register(req.body);
    sendCreated(res, user, 'Registration successful — check your email to verify');
  } catch (e) { next(e); }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.login(req.body);
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true, secure: env.NODE_ENV === 'production',
      sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendSuccess(res, { user: result.user, accessToken: result.tokens.accessToken }, { message: 'Login successful' });
  } catch (e) { next(e); }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.logout(req.user!.id);
    res.clearCookie('refreshToken');
    sendSuccess(res, null, { message: 'Logged out' });
  } catch (e) { next(e); }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token  = req.body.refreshToken ?? req.cookies.refreshToken;
    const tokens = await AuthService.refreshTokens(token);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true, secure: env.NODE_ENV === 'production',
      sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendSuccess(res, { accessToken: tokens.accessToken }, { message: 'Token refreshed' });
  } catch (e) { next(e); }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.forgotPassword(req.body.email);
    sendSuccess(res, null, { message: 'If that email exists, a reset link has been sent' });
  } catch (e) { next(e); }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.resetPassword(req.body.token, req.body.password);
    sendSuccess(res, null, { message: 'Password updated — please log in again' });
  } catch (e) { next(e); }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.verifyEmail(req.query.token as string);
    res.redirect(`${env.FRONTEND_URL}/verified`);
  } catch (e) { next(e); }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.getMe(req.user!.id);
    sendSuccess(res, user);
  } catch (e) { next(e); }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await AuthService.updateProfile(req.user!.id, req.body);
    sendSuccess(res, updated, { message: 'Profile updated' });
  } catch (e) { next(e); }
};

export const googleOAuthRedirect = (_req: Request, res: Response) => {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id',    env.GOOGLE_CLIENT_ID);
  url.searchParams.set('redirect_uri', env.GOOGLE_CALLBACK_URL);
  url.searchParams.set('response_type','code');
  url.searchParams.set('scope',        'openid email profile');
  res.redirect(url.toString());
};

export const googleOAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { GoogleOAuthService } = await import('../services/googleOAuth.service');
    const result = await GoogleOAuthService.handleCallback(req.query.code as string);
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'strict',
    });
    res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${result.tokens.accessToken}`);
  } catch (e) { next(e); }
};

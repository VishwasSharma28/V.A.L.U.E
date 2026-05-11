import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { validate }        from '../middlewares/validate';
import { authenticate }    from '../middlewares/authenticate';
import { authRateLimiter } from '../middlewares/rateLimiter';
import {
  registerSchema, loginSchema,
  refreshSchema,  resetPasswordSchema,
  forgotPasswordSchema,
} from '../validators/auth.validator';

const router = Router();

router.post('/register',       authRateLimiter, validate(registerSchema),       AuthController.register);
router.post('/login',          authRateLimiter, validate(loginSchema),           AuthController.login);
router.post('/logout',         authenticate,                                     AuthController.logout);
router.post('/refresh',                         validate(refreshSchema),          AuthController.refresh);
router.post('/forgot-password',authRateLimiter, validate(forgotPasswordSchema),  AuthController.forgotPassword);
router.post('/reset-password',                  validate(resetPasswordSchema),    AuthController.resetPassword);
router.get ('/verify-email',                                                     AuthController.verifyEmail);
router.get ('/me',             authenticate,                                     AuthController.me);
router.patch('/me',            authenticate,                                     AuthController.updateProfile);

// Google OAuth
router.get ('/google',          AuthController.googleOAuthRedirect);
router.get ('/google/callback', AuthController.googleOAuthCallback);

export default router;

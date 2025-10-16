import express from 'express';
import authController from '../controllers/auth.controller';
import validators from "@/middleware/validators";
import { authRateLimiters } from '@/middleware/rate-limit/rate-limit.middleware';

const router = express.Router();

router.post("/signup", authRateLimiters.register, validators.registerValidation, authController.signup);
router.post("/login", authRateLimiters.login, validators.loginValidation, authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authRateLimiters.forgotPassword, authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/verify-email", authRateLimiters.verifyEmail, authController.verifyEmail);
router.post("/refresh-token", authRateLimiters.refreshToken, authController.refreshToken);

router.get("/oauth/google", authController.googleOAuth);
router.get("/oauth/discord", authController.discordOAuth);

export default router;
import express from 'express';
import authController from '@/controllers/auth.controller';
import validators from "@/middleware/validators";
import { authRateLimiters } from '@/middleware/rate-limit';
import oAuthClient from '@/integrations';

const router = express.Router();

router.post("/signup", authRateLimiters.register, validators.registerValidation, authController.signup);
router.post("/login", authRateLimiters.login, validators.loginValidation, authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authRateLimiters.forgotPassword, authController.forgotPassword);
router.post("/reset-password", authRateLimiters.forgotPassword, authController.resetPassword);
router.post("/verify-email", authRateLimiters.verifyEmail, authController.verifyEmail);
router.post("/refresh-token", authRateLimiters.refreshToken, authController.refreshToken);

router.get("/oauth/google", oAuthClient.passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));
router.get("/oauth/google/callback", validators.oauthValidation, oAuthClient.passport.authenticate('google', { session: false }), authController.googleOAuthCallback);

router.get("/oauth/discord", (_, res) => { res.redirect(oAuthClient.getDiscordAuthorizationUrl()) })
router.get("/oauth/discord/callback", validators.oauthValidation, authController.discordOAuthCallback);

export default router;
import express from 'express';
import authController from '../controllers/auth.controller';
import validators from "@/middleware/validators/auth";

const router = express.Router();

router.post("/signup", validators.registerValidation, authController.signup);
router.post("/login", validators.loginValidation, authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/verify-email", authController.verifyEmail);
router.post("/refresh-token", authController.refreshToken);
router.get("/oauth/google", authController.googleOAuth);
router.get("/oauth/discord", authController.discordOAuth);

export default router;
import express from 'express';
import authRouter from '@/routes/auth.route';
import { isAuthenticate } from '@/middleware/auth/isAuthenticate';

const router = express.Router();

router.get("/", (_req, res) => {
  return res.json({ message: "Welcome to SRC Platform" })
})

router.use('/auth', authRouter);

router.use(isAuthenticate)

export default router;
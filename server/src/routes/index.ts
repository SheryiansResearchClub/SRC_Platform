import express from 'express';
import authRouter from '@routes/auth.route';

const router = express.Router();

router.get("/", (_req, res) => {
  return res.json({ message: "Welcome to SRC Platform" })
})

router.use('/auth', authRouter);

export default router;
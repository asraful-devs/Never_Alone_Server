import express from 'express';
import { AuthController } from './auth.controller';

const router = express.Router();

router.get('/login', AuthController.Login);

export const authRoutes = router;

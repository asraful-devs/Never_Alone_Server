import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

// Create User Route
router.post('/create-user', UserController.CreateUser);

export const userRoutes = router;

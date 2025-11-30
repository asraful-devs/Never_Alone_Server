import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

// Create User Route
router.post('/create-user', UserController.CreateUser);

// Get All Users
router.get('/all-users', UserController.GetAllUsers);

//Get Single User
router.get('/get-single-user/:id', UserController.GetSingleUser);

// Update User
router.patch('/update-user/:id', UserController.UpdateUser);

// Delete User
router.delete('/soft-delete-user/:id', UserController.DeleteUser);

export const userRoutes = router;

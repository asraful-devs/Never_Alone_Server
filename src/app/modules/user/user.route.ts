import { Role } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import { fileUploader } from '../../helpers/fileUploader';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';
import { UserVailidation } from './user.validation';

const router = express.Router();

// Create User Route
router.post('/create-user', UserController.CreateUser);

// Get All Users
router.get(
    '/all-users',
    auth(Role.ADMIN, Role.HOST),
    UserController.GetAllUsers
);

//Get Single User
router.get(
    '/get-single-user/:id',
    auth(Role.ADMIN, Role.USER),
    UserController.GetSingleUser
);

// Update User
router.patch(
    '/update-user/:id',
    auth(Role.ADMIN, Role.USER),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserVailidation.updateUserValidationSchema.parse(
            JSON.parse(req.body.data)
        );
        return UserController.UpdateUser(req, res, next);
    }
);

// Delete User
router.delete(
    '/soft-delete-user/:id',
    auth(Role.ADMIN, Role.USER),
    UserController.DeleteUser
);

export const userRoutes = router;

import { Request, Response } from 'express';
import pick from '../../helpers/pick';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

// Create User Controller
const CreateUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createUser(req);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'User created successfully!',
        data: result,
    });
});

// Get All Users Controller
const GetAllUsers = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['name', 'email']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await UserService.getAllUsers(filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});

// Get Single User Controller
const GetSingleUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await UserService.getSingleUser(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User retrieved successfully!',
        data: result,
    });
});

// Update User Controller
const UpdateUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await UserService.updateUser(id, payload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User updated successfully!',
        data: result,
    });
});

// Delete User Controller
const DeleteUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await UserService.deleteUser(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User deleted successfully!',
        data: result,
    });
});

export const UserController = {
    CreateUser,
    GetAllUsers,
    GetSingleUser,
    UpdateUser,
    DeleteUser,
};

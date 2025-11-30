import { Request, Response } from 'express';
import pick from '../../helpers/pick';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';

// Create Admin Controller
const CreateAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.createAdmin(req);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Admin created successfully',
        data: result,
    });
});

// Get All Admin Controller
const GetAllAdmin = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['name', 'email']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await AdminService.getAllAdmin(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admins retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});

// Get Single Admin Controller
const GetSingleAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getSingleAdmin(req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admin retrieved successfully',
        data: result,
    });
});

// Update Admin Controller
const UpdateAdmin = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await AdminService.updateAdmin(id, req);
    console.log(req.body, 'controller file');
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admin updated successfully',
        data: result,
    });
});

// Delete Admin Controller
const DeleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.deleteAdmin(req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admin deleted successfully',
        data: result,
    });
});

export const AdminController = {
    CreateAdmin,
    GetAllAdmin,
    GetSingleAdmin,
    UpdateAdmin,
    DeleteAdmin,
};

import { Request, Response } from 'express';
import pick from '../../helpers/pick';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HostService } from './host.service';

const CreateHost = catchAsync(async (req: Request, res: Response) => {
    const result = await HostService.createHost(req);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Host created successfully',
        data: result,
    });
});

// Get All Host Controller
const GetAllHost = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['name', 'email']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await HostService.getAllHost(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Hosts retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});

// Get Single Host Controller
const GetSingleHost = catchAsync(async (req: Request, res: Response) => {
    const result = await HostService.getSingleHost(req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Host retrieved successfully',
        data: result,
    });
});

// Get Single Host Controller
const GetSingleHostEmail = catchAsync(async (req: Request, res: Response) => {
    const result = await HostService.getSingleHostEmail(req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Host retrieved successfully',
        data: result,
    });
});

// Update Host Controller
const UpdateHost = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await HostService.updateHost(id, req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Host updated successfully',
        data: result,
    });
});

// Delete Host Controller
const DeleteHost = catchAsync(async (req: Request, res: Response) => {
    const result = await HostService.deleteHost(req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Host deleted successfully',
        data: result,
    });
});

export const HostController = {
    CreateHost,
    GetAllHost,
    GetSingleHost,
    GetSingleHostEmail,
    UpdateHost,
    DeleteHost,
};

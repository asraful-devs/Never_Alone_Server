import { Request, Response } from 'express';
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

export const HostController = {
    CreateHost,
};

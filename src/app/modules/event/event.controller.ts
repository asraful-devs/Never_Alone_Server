import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EventService } from './event.service';

const CreateEvent = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.createEvent(req);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Event created successfully',
        data: result,
    });
});

export const EventController = {
    CreateEvent,
};

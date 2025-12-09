import { Request, Response } from 'express';
import pick from '../../helpers/pick';
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

const GetAllEvents = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, [
        'title',
        'location',
        'category',
        'searchTerm',
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await EventService.getAllEvents(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Events retrieved successfully',
        data: result,
    });
});

const GetSingleEvent = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.getSingleEvent(req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Event retrieved successfully',
        data: result,
    });
});

const UpdateEvent = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.updateEvent(req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Event updated successfully',
        data: result,
    });
});

const DeleteEvent = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.deleteEvent(req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Event deleted successfully',
        data: result,
    });
});

export const EventController = {
    CreateEvent,
    GetAllEvents,
    GetSingleEvent,
    UpdateEvent,
    DeleteEvent,
};

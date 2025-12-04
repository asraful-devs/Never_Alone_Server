import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingService } from './booking.service';

const CreateBooking = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.createBooking(req);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Booking created successfully',
        data: result,
    });
});

const DeleteBooking = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await BookingService.deleteBooking(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Booking deleted successfully',
        data: result,
    });
});

export const BookingController = {
    CreateBooking,
    DeleteBooking,
};

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

export const BookingController = {
    CreateBooking,
};

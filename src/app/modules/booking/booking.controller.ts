import { Request, Response } from 'express';
import pick from '../../helpers/pick';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingService } from './booking.service';

// interface AuthenticatedRequest extends Request {
//     user?: { id: string | number };
// }

const CreateBooking = catchAsync(async (req: Request, res: Response) => {
    req.body.userId = req.user?.personId || req.user?.parsonId;
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

const GetUserBookings = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['email']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await BookingService.getUserBookings(filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User bookings retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const BookingController = {
    CreateBooking,
    DeleteBooking,
    GetUserBookings, // ✅
};

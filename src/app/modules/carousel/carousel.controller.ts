import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CarouselService } from './carousel.service';

const CreateCarousel = catchAsync(async (req: Request, res: Response) => {
    // Logic for creating a carousel item
    const result = await CarouselService.createCarousel(req);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Carousel item created successfully',
        data: result,
    });
});

const GetCarousels = catchAsync(async (req: Request, res: Response) => {
    // Logic for retrieving all carousel items
    const result = await CarouselService.getAllCarousels();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Carousels retrieved successfully',
        data: result,
    });
});

const DeleteCarousel = catchAsync(async (req: Request, res: Response) => {
    // Logic for deleting a carousel item
    const result = await CarouselService.deleteCarousel(req);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Carousel item deleted successfully',
        data: result,
    });
});

export const CarouselController = {
    CreateCarousel,
    GetCarousels,
    DeleteCarousel,
};

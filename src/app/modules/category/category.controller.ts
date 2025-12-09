import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryService } from './category.service';

const CreateCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.createCategory(req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Category created successfully',
        data: result,
    });
});

const GetAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.getAllCategories();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Categories retrieved successfully',
        data: result,
    });
});

const DeleteCategory = catchAsync(async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    // Implement the delete logic here using CategoryService
    const result = await CategoryService.deleteCategory(categoryId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Category with ID ${categoryId} deleted successfully`,
        data: result,
    });
});

export const CategoryController = {
    CreateCategory,
    GetAllCategories,
    DeleteCategory,
};

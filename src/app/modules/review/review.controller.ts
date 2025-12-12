import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";
import pick from "../../helpers/pick";

const CreateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const GetAllReviews = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["email"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ReviewService.getAllReviews(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const DeleteReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.deleteReview(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

export const ReviewController = {
  CreateReview,
  GetAllReviews,
  DeleteReview,
};

import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.valiation";

const router = express.Router();

router.post(
  "/create-review",
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.CreateReview,
);

router.get("/get-all-review", ReviewController.GetAllReviews);

router.delete("/delete-review/:id", ReviewController.DeleteReview);

export const reviewRoutes = router;

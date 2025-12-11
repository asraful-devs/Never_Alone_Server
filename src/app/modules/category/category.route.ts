import express from "express";
import { CategoryController } from "./category.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidation } from "./category.validation";

const router = express.Router();

router.post(
  "/create-category",
  validateRequest(CategoryValidation.CreateCategoryZodSchema),
  CategoryController.CreateCategory,
);

router.get("/get-all-categories", CategoryController.GetAllCategories);

router.delete("/delete-category/:id", CategoryController.DeleteCategory);

export const CategoryRoutes = router;

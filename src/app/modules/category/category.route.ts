import express from 'express';
import { CategoryController } from './category.controller';

const router = express.Router();

router.post('/create-category', CategoryController.CreateCategory);

router.get('/get-all-categories', CategoryController.GetAllCategories);

router.delete('/delete-category/:id', CategoryController.DeleteCategory);

export const CategoryRoutes = router;

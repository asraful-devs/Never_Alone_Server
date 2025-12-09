import { Request } from 'express';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { generateSlug } from '../../utils/slugify';

const createCategory = async (req: Request) => {
    const payload = req.body;

    const slug = generateSlug(payload.name);
    const isExisting = await prisma.category.findFirst({
        where: {
            OR: [{ name: payload.name }, { slug: slug }],
        },
    });

    if (isExisting) {
        throw new ApiError(409, 'Category with this name already exists');
    }

    const result = await prisma.category.create({
        data: {
            ...payload,
            slug: slug,
        },
    });

    return result;
};

const getAllCategories = async () => {
    const categories = await prisma.category.findMany();
    return categories;
};

const deleteCategory = async (categoryId: string) => {
    const isExisting = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });
    if (!isExisting) {
        throw new ApiError(404, 'Category not found');
    }
    await prisma.category.delete({
        where: {
            id: categoryId,
        },
    });
};

export const CategoryService = {
    createCategory,
    getAllCategories,
    deleteCategory,
};

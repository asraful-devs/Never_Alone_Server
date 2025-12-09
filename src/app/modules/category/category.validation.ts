import z from 'zod';

const CreateCategoryZodSchema = z.object({
    name: z.string().nonempty('Category name is required'),
    description: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    isActive: z.boolean().optional(),
});

export const CategoryValidation = {
    CreateCategoryZodSchema,
};

import z from 'zod';

const createCarouselZodSchema = z.object({
    title: z.string().nonempty('Title is required'),
    imageUrl: z.string().url('Image URL must be a valid URL').optional(),
    linkUrl: z.string().url('Link URL must be a valid URL').optional(),
});

export const carouselValidation = {
    createCarouselZodSchema,
};

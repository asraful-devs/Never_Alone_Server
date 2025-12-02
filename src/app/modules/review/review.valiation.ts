import z from 'zod';

const createReviewZodSchema = z.object({
    hostId: z.string().nonempty('Host ID is required'),
    userId: z.string().nonempty('User ID is required'),
    rating: z
        .number()
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating cannot be more than 5'),
    comment: z.string(),
});

export const ReviewValidation = {
    createReviewZodSchema,
};

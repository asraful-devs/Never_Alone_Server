import z from 'zod';

const updateAdminValidationSchema = z.object({
    contactNumber: z.string().optional(),
    profilePhoto: z.string().url('Invalid URL').optional(),
});

export const AdminValidation = {
    updateAdminValidationSchema,
};

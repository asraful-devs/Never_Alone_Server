import z from 'zod';

const createHostZodSchema = z.object({
    name: z.string().nonempty('Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().nonempty('Password is required'),
});

export const HostValidation = {
    createHostZodSchema,
};

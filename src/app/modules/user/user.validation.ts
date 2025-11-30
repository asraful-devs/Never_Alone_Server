import { z } from 'zod';

const createUserValidationSchema = z.object({
    password: z.string().nonempty('Password is required'),
    name: z.string().nonempty('Name is required'),
    email: z.string().email('Invalid email address'),
});

export const UserVailidation = {
    createUserValidationSchema,
};

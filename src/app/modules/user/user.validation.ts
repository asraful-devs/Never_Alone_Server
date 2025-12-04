import { z } from 'zod';

const createUserValidationSchema = z.object({
    name: z.string().nonempty('Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().nonempty('Password is required'),
});

const updateUserValidationSchema = z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    address: z.string().optional(),
    contactNumber: z.string().optional(),
    profilePhoto: z.string().url('Invalid URL').optional(),
});

export const UserVailidation = {
    createUserValidationSchema,
    updateUserValidationSchema,
};

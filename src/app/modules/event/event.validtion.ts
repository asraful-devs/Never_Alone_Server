import z from 'zod';

const createEventZodSchema = z.object({
    title: z.string().nonempty('Title is required'),
    description: z.string().nonempty('Description is required'),
    eventImage: z.string().url('Event Image must be a valid URL').optional(),
    date: z.string().nonempty('Date is required'),
    fee: z.number().nonnegative('Fee is Not Negative'),
    seats: z.number().nonnegative('Seats is Not Negative'),
    location: z.string().nonempty('Location is required'),
    hostId: z.string().nonempty('Host ID is required'),
});

export const EventValidation = {
    createEventZodSchema,
};

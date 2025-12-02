import z from 'zod';

const createEventZodSchema = z.object({
    title: z.string().nonempty('Title is required'),
    description: z.string().nonempty('Description is required'),
    eventImage: z.string().url('Event Image must be a valid URL').optional(),
    startDateTime: z.string().nonempty('Start DateTime is required'),
    endDateTime: z.string().nonempty('End DateTime is required'),
    fee: z.number().nonnegative('Fee is Not Negative'),
    seats: z.number().nonnegative('Seats is Not Negative'),
    location: z.string().nonempty('Location is required'),
    hostId: z.string().nonempty('Host ID is required'),
});

const updateEventZodSchema = z.object({
    title: z.string().nonempty('Title is required').optional(),
    description: z.string().nonempty('Description is required').optional(),
    eventImage: z.string().url('Event Image must be a valid URL').optional(),
    startDateTime: z.string().nonempty('Start DateTime is required').optional(),
    endDateTime: z.string().nonempty('End DateTime is required').optional(),
    fee: z.number().nonnegative('Fee is Not Negative').optional(),
    seats: z.number().nonnegative('Seats is Not Negative').optional(),
    location: z.string().nonempty('Location is required').optional(),
    hostId: z.string().nonempty('Host ID is required').optional(),
});

export const EventValidation = {
    createEventZodSchema,
    updateEventZodSchema,
};

import { Prisma } from '@prisma/client';
import { Request } from 'express';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { fileUploader } from '../../helpers/fileUploader';
import { IOptions, paginationHelper } from '../../helpers/paginationHelper';

const createEvent = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.eventImage = uploadResult?.secure_url;
    }
    const payload = req.body;

    const isHostExisting = await prisma.host.findUnique({
        where: {
            id: payload.hostId,
            isDeleted: false,
        },
    });

    if (!isHostExisting) {
        throw new ApiError(404, 'Host not found');
    }

    console.log(payload);

    const result = await prisma.event.create({
        data: {
            ...payload,
        },
    });
    return result;
};

const getAllEvents = async (
    filters: {
        title?: string;
        location?: string;
        searchTerm?: string;
    },
    options: IOptions
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: ['title', 'location'].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }

    const whereConditions: Prisma.EventWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.event.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                      createdAt: 'desc',
                  },
    });

    const total = await prisma.event.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const getSingleEvent = async (req: Request) => {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
        where: { id },
    });
    return event;
};

const updateEvent = async (req: Request) => {
    const { id } = req.params;

    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.eventImage = uploadResult?.secure_url;
    }
    const payload = req.body;

    const updatedEvent = await prisma.event.update({
        where: { id },
        data: {
            ...payload,
        },
    });
    return updatedEvent;
};

const deleteEvent = async (req: Request) => {
    const { id } = req.params;
    const deletedEvent = await prisma.event.delete({
        where: { id },
    });
    return deletedEvent;
};

export const EventService = {
    createEvent,
    getAllEvents,
    getSingleEvent,
    updateEvent,
    deleteEvent,
};

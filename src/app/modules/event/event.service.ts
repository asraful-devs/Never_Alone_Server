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

    const categoryIsExisting = await prisma.category.findUnique({
        where: {
            id: payload.categoryId,
        },
    });

    if (!categoryIsExisting) {
        throw new ApiError(404, 'Category not found');
    }

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
        category?: string;
        searchTerm?: string;
    },
    options: IOptions
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, category, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: Prisma.QueryMode.insensitive,
                    },
                },
                {
                    location: {
                        contains: searchTerm,
                        mode: Prisma.QueryMode.insensitive,
                    },
                },
            ],
        });
    }

    if (category) {
        andConditions.push({
            category: {
                is: {
                    slug: {
                        equals: category,
                        mode: Prisma.QueryMode.insensitive,
                    },
                },
            },
        });
    }

    if (Object.keys(filterData).length > 0) {
        Object.keys(filterData).forEach((key) => {
            andConditions.push({
                [key]: {
                    equals: (filterData as any)[key],
                },
            });
        });
    }

    const whereConditions: Prisma.EventWhereInput =
        andConditions.length > 0
            ? { AND: andConditions as Prisma.EventWhereInput[] }
            : {};

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
        include: {
            category: true,
            host: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
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

import { Prisma } from '@prisma/client';
import { Request } from 'express';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { IOptions, paginationHelper } from '../../helpers/paginationHelper';

const createReview = async (req: Request) => {
    const payload = req.body;
    // console.log(payload);

    const isUserExisting = await prisma.user.findUnique({
        where: {
            id: payload.userId,
            isDeleted: false,
        },
    });

    if (!isUserExisting) {
        throw new ApiError(404, 'User not found');
    }

    const isHostExisting = await prisma.host.findUnique({
        where: {
            id: payload.hostId,
            isDeleted: false,
        },
    });

    if (!isHostExisting) {
        throw new ApiError(404, 'Host not found');
    }
    const result = await prisma.review.create({
        data: {
            ...payload,
        },
    });
    return result;
};

// Get All Reviews Service
const getAllReviews = async (
    filters: {
        email?: string;
        rating?: number;
        searchTerm?: string;
    },
    options: IOptions
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];

    // Search term condition
    if (searchTerm) {
        andConditions.push({
            OR: ['email', 'comment'].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    // Filter conditions
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

    const whereConditions: Prisma.ReviewWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.review.findMany({
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

    const total = await prisma.review.count({
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

const deleteReview = async (req: Request) => {
    const { id } = req.params;

    const isReviewExisting = await prisma.review.findUnique({
        where: {
            id,
        },
    });

    if (!isReviewExisting) {
        throw new ApiError(404, 'Review not found');
    }
    const result = await prisma.review.delete({
        where: {
            id,
        },
    });
    return result;
};

export const ReviewService = {
    createReview,
    getAllReviews,
    deleteReview,
};

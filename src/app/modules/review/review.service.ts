import { Request } from 'express';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';

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

const getAllReviews = async (req: Request) => {
    const reviews = await prisma.review.findMany({});
    return reviews;
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

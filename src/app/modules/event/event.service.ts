import { Request } from 'express';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { fileUploader } from '../../helpers/fileUploader';

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

export const EventService = {
    createEvent,
};

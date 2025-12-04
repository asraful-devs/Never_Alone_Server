import { Request } from 'express';
import prisma from '../../config/db';
import { fileUploader } from '../../helpers/fileUploader';

const createCarousel = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.imageUrl = uploadResult?.secure_url;
    }

    const payload = req.body;

    const result = await prisma.carousel.create({
        data: {
            ...payload,
        },
    });

    return result;
};

const getAllCarousels = async () => {
    const result = await prisma.carousel.findMany();
    return result;
};

const deleteCarousel = async (req: Request) => {
    const { id } = req.params;

    const result = await prisma.carousel.delete({
        where: { id },
    });
    return result;
};

export const CarouselService = {
    createCarousel,
    getAllCarousels,
    deleteCarousel,
};

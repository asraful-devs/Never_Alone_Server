import experss, { NextFunction, Request, Response } from 'express';
import { fileUploader } from '../../helpers/fileUploader';
import { CarouselController } from './carousel.controller';
import { carouselValidation } from './carousel.validation';

const router = experss.Router();

router.post(
    '/create-carousel',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = carouselValidation.createCarouselZodSchema.parse(
            JSON.parse(req.body.data)
        );
        return CarouselController.CreateCarousel(req, res, next);
    }
);

router.get('/get-all-carousel', CarouselController.GetCarousels);

router.delete('/delete-carousel/:id', CarouselController.DeleteCarousel);

export const carouselRouter = router;

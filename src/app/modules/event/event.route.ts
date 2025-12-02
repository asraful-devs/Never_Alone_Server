import express, { NextFunction, Request, Response } from 'express';
import { fileUploader } from '../../helpers/fileUploader';
import { EventController } from './event.controller';
import { EventValidation } from './event.validtion';

const router = express.Router();

router.post(
    '/create-event',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = EventValidation.createEventZodSchema.parse(
            JSON.parse(req.body.data)
        );
        return EventController.CreateEvent(req, res, next);
    }
);

export const eventRoutes = router;

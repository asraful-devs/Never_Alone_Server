import express, { NextFunction, Request, Response } from 'express';
import { fileUploader } from '../../helpers/fileUploader';
import validateRequest from '../../middlewares/validateRequest';
import { HostController } from './host.controller';
import { HostValidation } from './host.validation';

const router = express.Router();

router.post(
    '/create-host',
    validateRequest(HostValidation.createHostZodSchema),
    HostController.CreateHost
);

router.get('/get-all-host', HostController.GetAllHost);

router.get('/get-single-host/:id', HostController.GetSingleHost);

router.patch(
    '/update-host/:id',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = HostValidation.updateHostZodSchema.parse(
            JSON.parse(req.body.data)
        );
        return HostController.UpdateHost(req, res, next);
    }
);

router.delete('/soft-delete-host/:id', HostController.DeleteHost);

export const hostRoutes = router;

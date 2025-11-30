import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { HostController } from './host.controller';
import { HostValidation } from './host.validation';

const router = express.Router();

router.post(
    '/create-host',
    validateRequest(HostValidation.createHostZodSchema),
    HostController.CreateHost
);

export const hostRoutes = router;

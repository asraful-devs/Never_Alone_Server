import express from 'express';
import { adminRoutes } from '../modules/admin/admin.route';
import { authRoutes } from '../modules/auth/auth.route';
import { hostRoutes } from '../modules/host/host.route';
import { userRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes,
    },
    {
        path: '/host',
        route: hostRoutes,
    },
    {
        path: '/admin',
        route: adminRoutes,
    },
    {
        path: '/auth',
        route: authRoutes,
    },
];

moduleRoutes.forEach((route) =>
    router.use(route.path, route.route as express.Router)
);

export default router;

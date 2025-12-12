// middlewares/auth.ts

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../error/ApiError';
import { JwtHelper } from '../helpers/jwtHelper';

const auth = (...roles: string[]) => {
    return async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ) => {
        try {
            // ✅ Cookie থেকে token নিন (cookie-parser এর জন্য)
            let token = req.cookies?.accessToken;

            // ✅ যদি cookie-parser না থাকে, তাহলে manual parse করুন
            if (!token && req.headers.cookie) {
                const cookies = req.headers.cookie.split('; ');
                const accessTokenCookie = cookies.find((c) =>
                    c.startsWith('accessToken=')
                );
                if (accessTokenCookie) {
                    token = accessTokenCookie.split('=')[1];
                }
            }

            console.log('🔑 Token found:', !!token); // Debug

            if (!token) {
                throw new ApiError(
                    httpStatus.UNAUTHORIZED,
                    'No token provided'
                );
            }

            const verifyUser = JwtHelper.verifyToken(
                token,
                process.env.JWT_ACCESS_SECRET as string
            );

            console.log('✅ Verified user:', verifyUser); // Debug

            req.user = verifyUser; // { parsonId, email, role }

            // Role check
            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new ApiError(
                    httpStatus.FORBIDDEN,
                    `Role ${verifyUser.role} is not authorized to access this resource`
                );
            }

            next();
        } catch (error: any) {
            console.error('❌ Auth error:', error.message);
            next(error);
        }
    };
};

export default auth;

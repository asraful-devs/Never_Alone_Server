import { status } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config/config';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { JwtHelper } from '../../helpers/jwtHelper';

const login = async (req: Request) => {
    const payload = req.body;

    const result = await prisma.person.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: status.ACTIVE,
        },
    });

    const isCorrectPassword = await bcrypt.compare(
        payload.password,
        result.password
    );

    if (!isCorrectPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect!');
    }

    const accessToken = JwtHelper.generateTokens(
        {
            parsonId: result.id,
            email: result.email,
            role: result.role,
        },
        config.jwt.access_secret as Secret,
        config.jwt.access_expires_in as string
    );

    const refreshToken = JwtHelper.generateTokens(
        { parsonId: result.id, email: result.email, role: result.role },
        config.jwt.refresh_secret as Secret,
        config.jwt.refresh_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: result.needsPasswordChange,
    };
};

export const AuthService = {
    login,
};

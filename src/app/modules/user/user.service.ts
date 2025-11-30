import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import config from '../../config/config';
import prisma from '../../config/db';
import { fileUploader } from '../../helpers/fileUploader';
import { IOptions, paginationHelper } from '../../helpers/paginationHelper';

const createUser = async (req: Request) => {
    const payload = req.body;
    // console.log(payload);
    // Logic to create a user in the database
    const hashPassword = await bcrypt.hash(payload.password, config.saltRounds);
    // console.log(hashPassword);

    const result = await prisma.$transaction(
        async (tx: {
            person: {
                create: (arg0: {
                    data: { email: string; password: string; name: string };
                }) => Promise<any>;
            };

            user: {
                create: (arg0: {
                    data: { email: string; name: string };
                }) => Promise<any>;
            };
        }) => {
            await tx.person.create({
                data: {
                    email: payload.email,
                    password: hashPassword,
                    name: payload.name,
                },
            });

            return await tx.user.create({
                data: {
                    email: payload.email,
                    name: payload.name,
                },
            });
        }
    );
    // console.log(result);
    return result;
};

// Get All Users Service
const getAllUsers = async (
    filters: {
        name?: string;
        email?: string;
        searchTerm?: string;
    },
    options: IOptions
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: ['name', 'email'].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }
    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.UserWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                      createdAt: 'desc',
                  },
    });

    const total = await prisma.user.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

// Get Single User Service
const getSingleUser = async (id: string) => {
    const result = await prisma.user.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    return result;
};

// Update User Service
const updateUser = async (id: string, req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.profilePhoto = uploadResult?.secure_url;
    }

    const payload = req.body;

    const result = await prisma.user.update({
        where: {
            id,
            isDeleted: false,
        },
        data: {
            ...payload,
        },
    });
    return result;
};

// Delete User Service

const deleteUser = async (id: string) => {
    const result = await prisma.user.update({
        where: {
            id,
            isDeleted: false,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
};

export const UserService = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};

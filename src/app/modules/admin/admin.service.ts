import { Prisma, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import config from '../../config/config';
import prisma from '../../config/db';
import { fileUploader } from '../../helpers/fileUploader';
import { IOptions, paginationHelper } from '../../helpers/paginationHelper';

const createAdmin = async (req: Request) => {
    const payload = req.body;

    // Logic to create a user in the database
    const hashPassword = await bcrypt.hash(payload.password, config.saltRounds);
    // console.log(hashPassword);

    const result = await prisma.$transaction(
        async (tx: {
            person: {
                create: (arg0: {
                    data: {
                        email: string;
                        password: string;
                        name: string;
                        role: Role;
                    };
                }) => Promise<any>;
            };
            admin: {
                create: (arg0: {
                    data: {
                        email: string;
                        name: string;
                    };
                }) => Promise<any>;
            };
        }) => {
            await tx.person.create({
                data: {
                    email: payload.email,
                    password: hashPassword,
                    name: payload.name,
                    role: Role.ADMIN,
                },
            });

            return await tx.admin.create({
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

// Get All Admin Service
const getAllAdmin = async (
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

    const whereConditions: Prisma.AdminWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.admin.findMany({
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

    const total = await prisma.admin.count({
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

// Get Single Admin Service
const getSingleAdmin = async (req: Request) => {
    const { id } = req.params;
    const admin = await prisma.admin.findUnique({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    return admin;
};

// Update Admin Service
const updateAdmin = async (id: string, req: Request) => {
    console.log(id);
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.profilePhoto = uploadResult && 'secure_url' in uploadResult
            ? uploadResult.secure_url
            : undefined;
    }

    const payload = req.body;

    console.log(payload);

    const updatedAdmin = await prisma.admin.update({
        where: {
            id,
            isDeleted: false,
        },
        data: {
            ...payload,
        },
    });
    return updatedAdmin;
};

// Soft delete implementation Admin
const deleteAdmin = async (req: Request) => {
    const { id } = req.params;
    const deletedAdmin = await prisma.admin.update({
        where: { id: id },
        data: { isDeleted: true },
    });
    return deletedAdmin;
};

export const AdminService = {
    createAdmin,
    getAllAdmin,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin,
};

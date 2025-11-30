import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import config from '../../config/config';
import prisma from '../../config/db';

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

export const AdminService = {
    createAdmin,
};

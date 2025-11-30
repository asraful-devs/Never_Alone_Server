import bcrypt from 'bcrypt';
import { Request } from 'express';
import config from '../../config/config';
import prisma from '../../config/db';

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

export const UserService = {
    createUser,
};

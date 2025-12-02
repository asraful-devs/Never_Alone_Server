import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { stripe } from '../../helpers/stripe';

const createBooking = async (req: Request) => {
    const payload = req.body;

    const isUserExists = await prisma.user.findUnique({
        where: {
            id: payload.userId,
            isDeleted: false,
        },
    });

    if (!isUserExists) {
        throw new ApiError(404, 'User does not exist');
    }

    const isEventExists = await prisma.event.findUnique({
        where: {
            id: payload.eventId,
        },
    });

    if (!isEventExists) {
        throw new ApiError(404, 'Event does not exist');
    }

    const result = await prisma.$transaction(async (tnx: any) => {
        const booking = await tnx.booking.create({
            data: {
                userId: payload.userId,
                eventId: payload.eventId,
            },
        });

        const transactionId = uuidv4();

        const payment = await tnx.payment.create({
            data: {
                bookingId: booking.id,
                amount: isEventExists.fee,
                paymentGatewayData: {},
                transactionId,
            },
        });

        const updateEvent = await tnx.event.update({
            where: {
                id: isEventExists.id,
            },
            data: {
                seats: { decrement: 1 },
                // Add user to the event's users list
                userIds: {
                    push: payload.userId,
                },
            },
        });
        console.log(booking, payment, updateEvent);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: isUserExists.email,
            line_items: [
                {
                    price_data: {
                        currency: 'bdt',
                        product_data: {
                            name: `Events Title :  ${isEventExists.title}`,
                        },
                        unit_amount: (isEventExists.fee ?? 0) * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                bookingId: booking.id,
                paymentId: payment.id,
            },
            success_url: `https://www.programming-hero.com/`,
            cancel_url: `https://next.programming-hero.com/`,
        });

        return { paymentUrl: session.url };
    });

    return result;
};

export const BookingService = {
    createBooking,
};

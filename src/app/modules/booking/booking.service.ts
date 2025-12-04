import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { paymentConfirmationTemplate } from '../../../templates/email';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { stripe } from '../../helpers/stripe';
import emailSender from '../../utils/emailSender';

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

    if (isEventExists.seats <= 0) {
        throw new ApiError(400, 'No seats available for this event');
    }

    if (isEventExists.userIds.includes(payload.userId)) {
        throw new ApiError(
            400,
            'User has already booked this event.You cannot book again'
        );
    }

    const result = await prisma.$transaction(
        async (tnx: any) => {
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
            // console.log(booking, payment, updateEvent);

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

            const emailTemplate = paymentConfirmationTemplate(
                isUserExists,
                isEventExists,
                session.url || ''
            );

            await emailSender(
                isUserExists.email,
                'Complete Your Booking - Never Alone',
                emailTemplate
            );

            return { paymentUrl: session.url };
        },
        {
            timeout: 10000,
        }
    );

    return result;
};

const deleteBooking = async (id: string) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id,
        },
    });

    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    if (booking.paymentStatus === 'PAID') {
        throw new ApiError(
            400,
            'Cannot delete a booking with completed payment'
        );
    }

    const result = await prisma.$transaction(async (tnx: any) => {
        const deletedPayment = await tnx.payment.delete({
            where: {
                bookingId: id,
            },
        });

        const EventData = await tnx.event.findUnique({
            where: {
                id: booking.eventId,
            },
        });

        const updateEvent = await tnx.event.update({
            where: {
                id: booking.eventId,
            },
            data: {
                seats: { increment: 1 },
                userIds: {
                    set: EventData.userIds.filter(
                        (id: string) => id !== booking.userId
                    ),
                },
            },
        });

        const deletedBooking = await tnx.booking.delete({
            where: {
                id,
            },
        });

        return deletedBooking;
    });

    return result;
};

const cancelUnpaidBookings = async () => {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);

    const unPaidBookings = await prisma.booking.findMany({
        where: {
            createdAt: {
                lte: thirtyMinAgo,
            },
            paymentStatus: 'UNPAID',
        },
    });

    if (unPaidBookings.length === 0) {
        return;
    }

    const bookingIdsToCancel = unPaidBookings.map((booking) => booking.id);

    await prisma.$transaction(async (tnx) => {
        await tnx.payment.deleteMany({
            where: {
                bookingId: {
                    in: bookingIdsToCancel,
                },
            },
        });

        await tnx.booking.deleteMany({
            where: {
                id: {
                    in: bookingIdsToCancel,
                },
            },
        });

        const affectedEventIds = [
            ...new Set(unPaidBookings.map((b) => b.eventId)),
        ];

        for (const eventId of affectedEventIds) {
            const cancelledUsersForThisEvent = unPaidBookings
                .filter((booking) => booking.eventId === eventId)
                .map((booking) => booking.userId);

            const currentEvent = await tnx.event.findUnique({
                where: { id: eventId },
                select: { userIds: true },
            });

            if (currentEvent) {
                const updatedUserIds = currentEvent.userIds.filter(
                    (userId: string) =>
                        !cancelledUsersForThisEvent.includes(userId)
                );

                await tnx.event.update({
                    where: { id: eventId },
                    data: {
                        seats: {
                            increment: cancelledUsersForThisEvent.length,
                        },
                        userIds: {
                            set: updatedUserIds,
                        },
                    },
                });
            }
        }
    });
};

export const BookingService = {
    createBooking,
    deleteBooking,
    cancelUnpaidBookings,
};

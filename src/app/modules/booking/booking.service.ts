// booking.service.ts

import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { paymentConfirmationTemplate } from '../../../templates/email';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { IOptions, paginationHelper } from '../../helpers/paginationHelper';
import { stripe } from '../../helpers/stripe';
import emailSender from '../../utils/emailSender';

interface AuthenticatedRequest extends Request {
    user?: {
        parsonId?: string; // ⚠️ Backend এ typo আছে
        personId?: string; // সঠিক spelling
        email: string;
        role: string;
    };
}

const createBooking = async (req: any) => {
    const payload = req.body; //

    // ✅ Step 1: JWT থেকে Person ID নিন
    const personId = req.user?.parsonId || req.user?.personId; // দুটোই চেক করুন

    if (!personId) {
        console.error('❌ JWT user data:', req.user);
        throw new ApiError(401, 'Unauthorized - Please login again');
    }

    console.log('👤 Authenticated Person ID:', personId);

    // ✅ Step 2: Person থেকে User data নিন
    const personWithUser = await prisma.person.findUnique({
        where: {
            id: personId, // ✅ JWT থেকে পাওয়া ID
        },
        include: {
            user: true,
        },
    });

    if (!personWithUser) {
        throw new ApiError(404, 'Person does not exist');
    }

    if (personWithUser.role !== 'USER') {
        throw new ApiError(403, 'Only users can book events');
    }

    if (!personWithUser.user) {
        throw new ApiError(404, 'User profile not found for this person');
    }

    if (personWithUser.user.isDeleted) {
        throw new ApiError(403, 'User account is deleted');
    }

    const userId = personWithUser.user.id;
    const userEmail = personWithUser.user.email;

    console.log('✅ User ID:', userId, '| Email:', userEmail);

    // ✅ Step 3: Event check করুন
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

    // ✅ Duplicate booking check
    if (isEventExists.userIds.includes(userId)) {
        throw new ApiError(
            400,
            'You have already booked this event. Cannot book again'
        );
    }

    // ✅ Step 4: Transaction করুন
    const result = await prisma.$transaction(
        async (tnx: any) => {
            // 1. Booking create
            const booking = await tnx.booking.create({
                data: {
                    userId: userId, // User table এর ID
                    eventId: payload.eventId,
                    paymentStatus: 'UNPAID',
                    status: 'PENDING',
                },
            });

            console.log('✅ Booking created:', booking.id);

            // 2. Payment record create
            const transactionId = uuidv4();
            const payment = await tnx.payment.create({
                data: {
                    bookingId: booking.id,
                    amount: isEventExists.fee,
                    paymentGatewayData: {},
                    transactionId,
                    status: 'UNPAID',
                },
            });

            console.log('✅ Payment created:', payment.id);

            // 3. Event update (seats decrement)
            await tnx.event.update({
                where: {
                    id: isEventExists.id,
                },
                data: {
                    seats: { decrement: 1 },
                    userIds: {
                        push: userId,
                    },
                },
            });

            // 4. Stripe payment session create
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                customer_email: userEmail,
                line_items: [
                    {
                        price_data: {
                            currency: 'bdt',
                            product_data: {
                                name: `Event: ${isEventExists.title}`,
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
                success_url: `${process.env.FRONTEND_URL}/booking/success`,
                cancel_url: `${process.env.FRONTEND_URL}/booking/cancel`,
                // success_url: `https://www.programming-hero.com/`,
                // cancel_url: `https://next.programming-hero.com/`,
            });

            console.log('✅ Stripe session created:', session.id);

            // 5. Send email
            const emailTemplate = paymentConfirmationTemplate(
                personWithUser.user,
                isEventExists,
                session.url || ''
            );

            await emailSender(
                userEmail,
                'Complete Your Booking - Never Alone',
                emailTemplate
            );

            console.log('✅ Email sent to:', userEmail);

            return {
                paymentUrl: session.url,
                bookingId: booking.id,
                transactionId: transactionId,
            };
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

    // ✅ Booking এর paymentStatus check করুন
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

const getUserBookings = async (
    filters: {
        email?: string;
    },
    options: IOptions
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);

    // ✅ Email validation
    if (!filters.email) {
        throw new ApiError(400, 'Email is required');
    }

    console.log('📧 Searching for email:', filters.email);

    // ✅ Step 1: Email দিয়ে User খুঁজুন
    const user = await prisma.user.findUnique({
        where: {
            email: filters.email,
        },
    });

    if (!user) {
        throw new ApiError(404, 'User not found with this email');
    }

    console.log('✅ User found:', user.id);

    // ✅ Step 2: এই User এর সব Bookings নিন
    const whereConditions = {
        userId: user.id,
    };

    const bookings = await prisma.booking.findMany({
        where: whereConditions,
        skip,
        take: limit,
        include: {
            event: {
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    host: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profilePhoto: true,
                            rating: true,
                        },
                    },
                },
            },
            payment: {
                select: {
                    id: true,
                    amount: true,
                    status: true,
                    transactionId: true,
                    createdAt: true,
                },
            },
        },
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                      createdAt: 'desc',
                  },
    });

    // Total count
    const total = await prisma.booking.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: bookings,
    };
};

const cancelUnpaidBookings = async () => {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);

    const unPaidBookings = await prisma.booking.findMany({
        where: {
            createdAt: {
                lte: thirtyMinAgo,
            },
            paymentStatus: 'UNPAID', // ✅ Booking এর paymentStatus
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
    getUserBookings,
    cancelUnpaidBookings,
};

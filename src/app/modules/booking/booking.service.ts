import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../config/db';
import ApiError from '../../error/ApiError';
import { stripe } from '../../helpers/stripe';
import emailSender from './emailSender';

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

            await emailSender(
                isUserExists.email,
                `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Confirmation - Never Alone</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        background-color: #f5f5f5;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 30px 20px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 700;
                    }
                    .content {
                        padding: 30px 20px;
                    }
                    .greeting {
                        font-size: 16px;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .event-details {
                        background-color: #f9f9f9;
                        border-left: 4px solid #667eea;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 4px;
                    }
                    .event-details h3 {
                        margin: 0 0 10px 0;
                        color: #667eea;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .event-title {
                        font-size: 18px;
                        font-weight: 600;
                        color: #333;
                        margin: 0;
                    }
                    .price-section {
                        margin: 20px 0;
                        text-align: center;
                    }
                    .price {
                        font-size: 24px;
                        font-weight: 700;
                        color: #667eea;
                        margin: 10px 0;
                    }
                    .cta-section {
                        margin: 30px 0;
                        text-align: center;
                    }
                    .cta-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 14px 40px;
                        text-decoration: none;
                        border-radius: 6px;
                        font-weight: 600;
                        font-size: 16px;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                    }
                    .cta-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
                    }
                    .info-text {
                        font-size: 14px;
                        color: #666;
                        margin: 20px 0;
                        line-height: 1.8;
                    }
                    .footer {
                        background-color: #f5f5f5;
                        padding: 20px;
                        text-align: center;
                        border-top: 1px solid #e0e0e0;
                        font-size: 12px;
                        color: #999;
                    }
                    .footer a {
                        color: #667eea;
                        text-decoration: none;
                    }
                    .payment-id {
                        background-color: #f0f0f0;
                        padding: 10px;
                        border-radius: 4px;
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        color: #666;
                        margin: 15px 0;
                        word-break: break-all;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>🎉 Event Booking Confirmed</h1>
                    </div>

                    <div class="content">
                        <p class="greeting">Hello <strong>${
                            isUserExists.name || 'Valued Guest'
                        }</strong>,</p>

                        <p class="info-text">
                            Thank you for choosing <strong>Never Alone</strong>! We're excited to have you join us.
                            To complete your booking and secure your spot, please proceed with the payment below.
                        </p>

                        <div class="event-details">
                            <h3>📌 Event Details</h3>
                            <p class="event-title">${isEventExists.title}</p>
                            <p style="margin: 8px 0; color: #666; font-size: 14px;">
                                📅 ${new Date(
                                    isEventExists.startDateTime
                                ).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                            <p style="margin: 8px 0; color: #666; font-size: 14px;">
                                📍 ${isEventExists.location}
                            </p>
                        </div>

                        <div class="price-section">
                            <p style="margin: 0; color: #666; font-size: 14px;">Amount to Pay</p>
                            <div class="price">৳ ${isEventExists.fee}</div>
                        </div>

                        <div class="cta-section">
                            <a href="${session.url}" class="cta-button">
                                🔒 Proceed to Payment
                            </a>
                        </div>

                        <p class="info-text" style="border-top: 1px solid #eee; padding-top: 20px;">
                            <strong>⏰ Important:</strong> Please complete your payment within the next 30 minutes to confirm your booking.
                            Unpaid bookings will be automatically cancelled after 30 minutes.
                        </p>

                        <p class="info-text">
                            If you have any questions or need assistance, feel free to reach out to our support team.
                            <br><br>
                            Best regards,<br>
                            <strong>Never Alone Team</strong>
                        </p>
                    </div>

                    <div class="footer">
                        <p style="margin: 0 0 10px 0;">
                            © 2024 Never Alone Events. All rights reserved.
                        </p>
                        <p style="margin: 0;">
                            <a href="#">Privacy Policy</a> |
                            <a href="#">Terms & Conditions</a> |
                            <a href="#">Contact Us</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
            `
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

    // ১. সব unpaid bookings খুঁজে বের করুন (৭টি booking পাবেন)
    const unPaidBookings = await prisma.booking.findMany({
        where: {
            createdAt: {
                lte: thirtyMinAgo,
            },
            paymentStatus: 'UNPAID',
        },
    });

    if (unPaidBookings.length === 0) {
        console.log('কোন unpaid booking নেই');
        return;
    }

    console.log(`${unPaidBookings.length} টি unpaid booking পাওয়া গেছে`);

    const bookingIdsToCancel = unPaidBookings.map((booking) => booking.id);

    await prisma.$transaction(async (tnx) => {
        // ২. Payment records delete করুন (৭টি payment)
        await tnx.payment.deleteMany({
            where: {
                bookingId: {
                    in: bookingIdsToCancel,
                },
            },
        });

        // ৩. Booking records delete করুন (৭টি booking)
        await tnx.booking.deleteMany({
            where: {
                id: {
                    in: bookingIdsToCancel,
                },
            },
        });

        // ৪. যে events গুলোতে unpaid bookings ছিল, সেগুলো খুঁজে বের করুন
        const affectedEventIds = [
            ...new Set(unPaidBookings.map((b) => b.eventId)),
        ]; // ৩টি unique event ID

        console.log(`${affectedEventIds.length} টি event affected হয়েছে`);

        // ৫. প্রতিটা affected event এর জন্য:
        for (const eventId of affectedEventIds) {
            // এই event এর জন্য কতজন unpaid ছিল তা বের করুন
            const cancelledUsersForThisEvent = unPaidBookings
                .filter((booking) => booking.eventId === eventId)
                .map((booking) => booking.userId);

            console.log(
                `Event ${eventId}: ${cancelledUsersForThisEvent.length} জন user cancel হচ্ছে`
            );

            // বর্তমান event data আনুন
            const currentEvent = await tnx.event.findUnique({
                where: { id: eventId },
                select: { userIds: true },
            });

            if (currentEvent) {
                // Cancelled users বাদ দিয়ে নতুন userIds array তৈরি করুন
                const updatedUserIds = currentEvent.userIds.filter(
                    (userId: string) =>
                        !cancelledUsersForThisEvent.includes(userId)
                );

                // Event update করুন
                await tnx.event.update({
                    where: { id: eventId },
                    data: {
                        seats: {
                            increment: cancelledUsersForThisEvent.length, // যতজন cancel হলো ততগুলো seat বাড়ান
                        },
                        userIds: {
                            set: updatedUserIds, // নতুন user list set করুন
                        },
                    },
                });
            }
        }
    });

    console.log(
        `✅ সফলভাবে ${unPaidBookings.length} টি unpaid booking cancel করা হয়েছে`
    );
};

export const BookingService = {
    createBooking,
    deleteBooking,
    cancelUnpaidBookings,
};

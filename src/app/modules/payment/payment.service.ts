import { PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';
import prisma from '../../config/db';

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
    console.log('📥 Processing webhook event:', event.type);

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;

            const bookingId = session.metadata?.bookingId;
            const paymentId = session.metadata?.paymentId;

            console.log('📋 Metadata:', { bookingId, paymentId });
            console.log('💳 Payment Status:', session.payment_status);

            if (!bookingId || !paymentId) {
                console.error('❌ Missing metadata in session');
                throw new Error('Missing bookingId or paymentId in metadata');
            }

            // Transaction ব্যবহার করে atomically update করুন
            await prisma.$transaction(async (tx) => {
                const paymentStatus =
                    session.payment_status === 'paid'
                        ? PaymentStatus.PAID
                        : PaymentStatus.UNPAID;

                // Booking update
                const updatedBooking = await tx.booking.update({
                    where: { id: bookingId },
                    data: { paymentStatus },
                });
                console.log('✅ Booking updated:', updatedBooking.id);

                // Payment update
                const updatedPayment = await tx.payment.update({
                    where: { id: paymentId },
                    data: {
                        status: paymentStatus,
                        paymentGatewayData: session as any,
                    },
                });
                console.log('✅ Payment updated:', updatedPayment.id);
            });

            break;
        }

        default:
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
};

export const PaymentService = {
    handleStripeWebhookEvent,
};

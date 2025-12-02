import { Request, Response } from 'express';

import config from '../../config/config';
import { stripe } from '../../helpers/stripe';
import catchAsync from '../../utils/catchAsync';
import { PaymentService } from './payment.service';

const handleStripeWebhookEvent = catchAsync(
    async (req: Request, res: Response) => {
        const sig = req.headers['stripe-signature'] as string;
        const webhookSecret = config.stripe.webhookSecret as string;

        if (!sig) {
            console.error('⚠️ No stripe-signature header found');
            return res.status(400).send('No stripe signature found');
        }

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                webhookSecret
            );

            console.log('✅ Webhook verified successfully:', event.type);
        } catch (err: any) {
            console.error(
                '⚠️ Webhook signature verification failed:',
                err.message
            );
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        try {
            await PaymentService.handleStripeWebhookEvent(event);

            return res.status(200).json({ received: true });
        } catch (error: any) {
            console.error('Error processing webhook:', error);
            return res.status(500).json({ error: 'Webhook processing failed' });
        }
    }
);

export const PaymentController = {
    handleStripeWebhookEvent,
};

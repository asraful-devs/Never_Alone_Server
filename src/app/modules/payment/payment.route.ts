import express from 'express';
import { PaymentController } from './payment.controller';

const router = express.Router();

// Webhook route - এটা অবশ্যই আলাদাভাবে handle করতে হবে
router.post('/webhook', PaymentController.handleStripeWebhookEvent);

export const PaymentRoutes = router;

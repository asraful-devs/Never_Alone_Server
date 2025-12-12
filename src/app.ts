import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import cron from 'node-cron';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { BookingService } from './app/modules/booking/booking.service';
import { PaymentController } from './app/modules/payment/payment.controller';
import router from './app/routes';

const app: Application = express();

app.post(
    '/api/v1/payment/webhook',
    express.raw({ type: 'application/json' }),
    PaymentController.handleStripeWebhookEvent
);

// console.log('update stripe')

app.use(
    cors({
        origin: 'https://never-alone-client.onrender.com',
        credentials: true,
    })
);

cron.schedule('* * * * *', () => {
    try {
        console.log('Node cron called at this ', new Date());
        BookingService.cancelUnpaidBookings();
    } catch (err) {
        console.error(err);
    }
});

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: 'Never Alone Server..',
        RunningTime: process.uptime().toFixed(2) + ' seconds',
        Time: new Date().toLocaleTimeString(),
    });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { PaymentController } from './app/modules/payment/payment.controller';
import router from './app/routes';

const app: Application = express();

app.post(
    '/api/v1/payment/webhook',
    express.raw({ type: 'application/json' }),
    PaymentController.handleStripeWebhookEvent
);

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

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

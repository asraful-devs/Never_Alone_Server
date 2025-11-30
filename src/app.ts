import cors from 'cors';
import express, { Application, Request, Response } from 'express';

const app: Application = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: 'Never Alone Server..',
        RunningTime: process.uptime().toFixed(2) + ' seconds',
        Time: new Date().toLocaleTimeString(),
    });
});

export default app;

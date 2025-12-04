import nodemailer from 'nodemailer';
import config from '../config/config';

const emailSender = async (
    email: string,
    subject: string,
    htmlContent: string
) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: config.email.sender,
            pass: config.email.app_pass, // app password
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const info = await transporter.sendMail({
        from: `"Never Alone" <${config.email.sender}>`, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: htmlContent, // html body
        headers: {
            'Content-Type': 'text/html; charset=UTF-8',
        },
    });

    console.log('Email sent:', info.messageId);
    return info;
};

export default emailSender;

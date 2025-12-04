import nodemailer from 'nodemailer';
import config from '../../config/config';

const emailSender = async (email: string, html: string) => {
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
        subject: 'Your Booking Confirmation', // Subject line
        //text: "Hello world?", // plain text body
        html, // html body
    });

    // console.log(info);
};

export default emailSender;

export const paymentConfirmationTemplate = (
    userData: any,
    eventData: any,
    paymentUrl: string
): string => {
    const userName = userData.name || userData.email.split('@')[0];
    const eventDate = new Date(eventData.startDateTime).toLocaleDateString(
        'en-US',
        {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }
    );

    return `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Complete Your Booking - Never Alone</title>
        <style type="text/css">
            body { margin: 0; padding: 0; min-width: 100%; background-color: #f5f5f5; }
            table { border-collapse: collapse; width: 100%; }
            a { color: #667eea; text-decoration: none; }
        </style>
    </head>
    <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
            <tr>
                <td align="center" style="padding:20px;">

                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">

                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
                                <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🎉 Booking Confirmed</h1>
                                <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.95;">Complete payment to secure your spot</p>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td style="padding: 30px 20px;">

                                <!-- Greeting -->
                                <p style="font-size: 15px; color: #333; margin: 0 0 25px 0; line-height: 1.6;">
                                    Hi <strong>${userName}</strong>,
                                </p>

                                <!-- Event Card -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fb; border: 1px solid #e8ecf1; border-radius: 6px; margin: 20px 0;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; color: #667eea; font-weight: 600; letter-spacing: 0.5px;">Event Details</p>
                                            <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #333;">
                                                ${eventData.title}
                                            </p>
                                            <p style="margin: 8px 0; font-size: 13px; color: #666;">
                                                📅 ${eventDate}
                                            </p>
                                            <p style="margin: 8px 0; font-size: 13px; color: #666;">
                                                📍 ${eventData.location}
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Amount -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                    <tr>
                                        <td style="font-size: 13px; color: #999;">Amount to Pay</td>
                                        <td align="right" style="font-size: 13px; color: #999;">Total</td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 8px; font-size: 24px; font-weight: 700; color: #667eea;">৳ ${eventData.fee}</td>
                                        <td align="right" style="padding-top: 8px; font-size: 24px; font-weight: 700; color: #667eea;">৳ ${eventData.fee}</td>
                                    </tr>
                                </table>

                                <!-- Divider -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                    <tr>
                                        <td style="border-top: 1px solid #e0e0e0; height: 1px;"></td>
                                    </tr>
                                </table>

                                <!-- CTA Button -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="${paymentUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 45px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.35);">
                                                Complete Payment →
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Important Notice -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3e6; border-left: 4px solid #ffc107; margin: 25px 0;">
                                    <tr>
                                        <td style="padding: 14px 15px; font-size: 13px; color: #8b6914; line-height: 1.6;">
                                            <strong>⏱️ Pay within 30 minutes</strong> to confirm your booking. Unpaid bookings expire automatically.
                                        </td>
                                    </tr>
                                </table>

                                <!-- Help Text -->
                                <p style="font-size: 12px; color: #999; margin: 25px 0; line-height: 1.6; text-align: center;">
                                    Questions? <a href="#" style="color: #667eea; text-decoration: underline;">Contact support</a>
                                </p>

                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 11px; color: #999;">
                                <p style="margin: 0 0 8px 0;">
                                    © 2024 Never Alone Events. All rights reserved.
                                </p>
                                <p style="margin: 0;">
                                    <a href="#" style="color: #667eea; text-decoration: none;">Privacy</a> •
                                    <a href="#" style="color: #667eea; text-decoration: none;">Terms</a> •
                                    <a href="#" style="color: #667eea; text-decoration: none;">Contact</a>
                                </p>
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
    `;
};

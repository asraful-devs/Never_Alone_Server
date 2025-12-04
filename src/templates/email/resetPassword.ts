export const resetPasswordTemplate = (
    userData: any,
    resetPassLink: string
): string => {
    const username = userData.name || 'User';

    return `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Password Reset - Never Alone</title>
        <style type="text/css">
            body { margin: 0; padding: 0; min-width: 100%; background-color: #f5f5f5; }
            table { border-collapse: collapse; width: 100%; }
            a { color: #ff6b6b; text-decoration: none; }
        </style>
    </head>
    <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
            <tr>
                <td align="center" style="padding:20px;">

                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">

                        <!-- Header Section -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 30px 20px; text-align: center;">
                                <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🔐 Password Reset Request</h1>
                                <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Secure Your Never Alone Account</p>
                            </td>
                        </tr>

                        <!-- Content Section -->
                        <tr>
                            <td style="padding: 30px 20px;">

                                <!-- Greeting -->
                                <p style="font-size: 16px; color: #333; margin-bottom: 20px; line-height: 1.6;">
                                    Hello <strong>${username}</strong>,
                                </p>

                                <!-- Info Text -->
                                <p style="font-size: 14px; color: #666; margin: 15px 0; line-height: 1.8;">
                                    We received a request to reset your password for your <strong>Never Alone</strong> account. If you didn't request this, you can safely ignore this email.
                                </p>

                                <!-- Warning Box -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3cd; border-left: 4px solid #ffc107; margin: 20px 0;">
                                    <tr>
                                        <td style="padding: 15px; font-size: 14px; color: #856404; line-height: 1.6;">
                                            <strong style="color: #d39e00;">⚠️ Security Alert:</strong> This link will expire in 10 minutes for your security. If you don't act now, you'll need to request a new password reset.
                                        </td>
                                    </tr>
                                </table>

                                <!-- CTA Button -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="${resetPassLink}" style="display: inline-block; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);">
                                                🔓 Reset Your Password
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Link Text -->
                                <p style="font-size: 14px; color: #666; text-align: center; margin: 20px 0; line-height: 1.6;">
                                    <em>or copy and paste this link in your browser:</em><br />
                                    <small style="word-break: break-all; color: #999; font-size: 12px;">
                                        ${resetPassLink}
                                    </small>
                                </p>

                                <!-- Steps Section -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-left: 4px solid #ff6b6b; margin: 20px 0;">
                                    <tr>
                                        <td style="padding: 15px;">
                                            <h3 style="margin: 0 0 10px 0; color: #ff6b6b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">📋 What to Do Next</h3>
                                            <p style="margin: 10px 0; font-size: 14px; color: #555;">
                                                <span style="display: inline-block; width: 24px; height: 24px; background-color: #ff6b6b; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; margin-right: 8px; font-size: 12px;">1</span>
                                                Click the "Reset Your Password" button above
                                            </p>
                                            <p style="margin: 10px 0; font-size: 14px; color: #555;">
                                                <span style="display: inline-block; width: 24px; height: 24px; background-color: #ff6b6b; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; margin-right: 8px; font-size: 12px;">2</span>
                                                Enter your new password (make it strong and unique)
                                            </p>
                                            <p style="margin: 10px 0; font-size: 14px; color: #555;">
                                                <span style="display: inline-block; width: 24px; height: 24px; background-color: #ff6b6b; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; margin-right: 8px; font-size: 12px;">3</span>
                                                Confirm your new password
                                            </p>
                                            <p style="margin: 10px 0; font-size: 14px; color: #555;">
                                                <span style="display: inline-block; width: 24px; height: 24px; background-color: #ff6b6b; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; margin-right: 8px; font-size: 12px;">4</span>
                                                Log in with your new password
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Security Tips -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f4f8; border-left: 4px solid #17a2b8; margin: 20px 0;">
                                    <tr>
                                        <td style="padding: 15px; font-size: 13px; color: #0c5460; line-height: 1.6;">
                                            <strong style="color: #0c5460;">🛡️ Security Tips:</strong>
                                            <ul style="margin: 10px 0; padding-left: 20px;">
                                                <li>Use a combination of uppercase, lowercase, numbers, and symbols</li>
                                                <li>Avoid using common words or personal information</li>
                                                <li>Never share your password with anyone</li>
                                                <li>If you didn't request this, contact our support team immediately</li>
                                            </ul>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Divider -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                                    <tr>
                                        <td style="border-top: 1px solid #e0e0e0; height: 1px;"></td>
                                    </tr>
                                </table>

                                <!-- Closing Message -->
                                <p style="font-size: 14px; color: #666; margin: 15px 0; line-height: 1.8;">
                                    If you have any questions or need further assistance, please don't hesitate to contact our support team.
                                    <br /><br />
                                    Best regards,<br />
                                    <strong>The Never Alone Team</strong>
                                </p>
                            </td>
                        </tr>

                        <!-- Footer Section -->
                        <tr>
                            <td style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999;">
                                <p style="margin: 0 0 10px 0;">
                                    © 2024 Never Alone. All rights reserved.
                                </p>
                                <p style="margin: 0; font-size: 12px;">
                                    <a href="#" style="color: #ff6b6b; text-decoration: none;">Privacy Policy</a> |
                                    <a href="#" style="color: #ff6b6b; text-decoration: none;">Terms & Conditions</a> |
                                    <a href="#" style="color: #ff6b6b; text-decoration: none;">Contact Support</a>
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

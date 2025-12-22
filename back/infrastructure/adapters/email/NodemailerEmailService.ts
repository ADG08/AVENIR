import nodemailer from 'nodemailer';
import { EmailService } from '../../../domain/services/EmailService';

export class NodemailerEmailService implements EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        const transportConfig: any = {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
        };

        // Only add auth if credentials are provided (for production SMTP)
        // Mailpit/MailHog don't need authentication in development
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            transportConfig.auth = {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            };
        }

        this.transporter = nodemailer.createTransport(transportConfig);
    }

    async sendWelcomeEmail(
        to: string,
        firstName: string,
        lastName: string,
        identityNumber: string
    ): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_FROM || 'noreply@avenir-bank.com',
            to,
            subject: 'Bienvenue chez AVENIR Bank - Welcome to AVENIR Bank',
            html: `
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Bienvenue chez AVENIR Bank</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
                        <tr>
                            <td align="center">
                                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color: #004d91; padding: 40px 20px; text-align: center;">
                                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 300;">AVENIR Bank</h1>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <h2 style="color: #004d91; font-size: 24px; font-weight: 400; margin: 0 0 20px 0;">
                                                Bienvenue, ${firstName} ${lastName} !
                                            </h2>

                                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                Nous sommes ravis de vous accueillir chez AVENIR Bank. Votre compte a été créé avec succès !
                                            </p>

                                            <div style="background-color: #f8f9fa; border-left: 4px solid #004d91; padding: 20px; margin: 20px 0;">
                                                <p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
                                                    <strong>Votre numéro d'identité :</strong>
                                                </p>
                                                <p style="color: #004d91; font-size: 20px; font-weight: bold; margin: 0; letter-spacing: 1px;">
                                                    ${identityNumber}
                                                </p>
                                            </div>

                                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                                Vous pouvez maintenant vous connecter à votre espace client en utilisant ce numéro d'identité et le code secret que vous avez défini lors de votre inscription.
                                            </p>

                                            <div style="text-align: center; margin: 30px 0;">
                                                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login"
                                                   style="display: inline-block; background-color: #004d91; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 4px; font-size: 16px; font-weight: 500;">
                                                    Se connecter
                                                </a>
                                            </div>

                                            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />

                                            <h3 style="color: #004d91; font-size: 18px; font-weight: 400; margin: 0 0 15px 0;">
                                                Welcome, ${firstName} ${lastName}!
                                            </h3>

                                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                We are delighted to welcome you to AVENIR Bank. Your account has been successfully created!
                                            </p>

                                            <div style="background-color: #f8f9fa; border-left: 4px solid #004d91; padding: 20px; margin: 20px 0;">
                                                <p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
                                                    <strong>Your identity number:</strong>
                                                </p>
                                                <p style="color: #004d91; font-size: 20px; font-weight: bold; margin: 0; letter-spacing: 1px;">
                                                    ${identityNumber}
                                                </p>
                                            </div>

                                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                                You can now log in to your client area using this identity number and the passcode you set during registration.
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                                            <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                                                Si vous n'êtes pas à l'origine de cette inscription, veuillez ignorer cet email.
                                            </p>
                                            <p style="color: #666666; font-size: 14px; margin: 0;">
                                                If you did not create this account, please ignore this email.
                                            </p>
                                            <p style="color: #999999; font-size: 12px; margin: 20px 0 0 0;">
                                                © ${new Date().getFullYear()} AVENIR Bank. Tous droits réservés. All rights reserved.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
            text: `
Bienvenue chez AVENIR Bank / Welcome to AVENIR Bank

Bonjour ${firstName} ${lastName},

Nous sommes ravis de vous accueillir chez AVENIR Bank. Votre compte a été créé avec succès !

Votre numéro d'identité : ${identityNumber}

Vous pouvez maintenant vous connecter à votre espace client en utilisant ce numéro d'identité et le code secret que vous avez défini lors de votre inscription.

Connectez-vous sur : ${process.env.FRONTEND_URL || 'http://localhost:3000'}/login

---

Hello ${firstName} ${lastName},

We are delighted to welcome you to AVENIR Bank. Your account has been successfully created!

Your identity number: ${identityNumber}

You can now log in to your client area using this identity number and the passcode you set during registration.

Log in at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/login

---

Si vous n'êtes pas à l'origine de cette inscription, veuillez ignorer cet email.
If you did not create this account, please ignore this email.

© ${new Date().getFullYear()} AVENIR Bank. Tous droits réservés. All rights reserved.
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Welcome email sent to ${to}`);
        } catch (error) {
            console.error('Error sending welcome email:', error);
            throw new Error('Failed to send welcome email');
        }
    }

    async sendVerificationEmail(
        to: string,
        firstName: string,
        verificationToken: string
    ): Promise<void> {
        const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: process.env.SMTP_FROM || 'noreply@avenir-bank.com',
            to,
            subject: 'Vérifiez votre email - Verify your email | AVENIR Bank',
            html: `
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Vérification de votre email</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
                        <tr>
                            <td align="center">
                                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color: #004d91; padding: 40px 20px; text-align: center;">
                                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 300;">AVENIR Bank</h1>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <h2 style="color: #004d91; font-size: 24px; font-weight: 400; margin: 0 0 20px 0;">
                                                Bienvenue ${firstName} !
                                            </h2>

                                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                Merci de vous être inscrit chez AVENIR Bank. Pour activer votre compte et accéder à tous nos services, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous.
                                            </p>

                                            <div style="text-align: center; margin: 30px 0;">
                                                <a href="${verificationLink}"
                                                   style="display: inline-block; background-color: #004d91; color: #ffffff; text-decoration: none; padding: 16px 50px; border-radius: 4px; font-size: 16px; font-weight: 500;">
                                                    Vérifier mon email
                                                </a>
                                            </div>

                                            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                                                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
                                            </p>
                                            <p style="color: #004d91; font-size: 13px; word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">
                                                ${verificationLink}
                                            </p>

                                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                                                <p style="color: #856404; font-size: 14px; margin: 0;">
                                                    ⚠️ Ce lien expirera dans 24 heures pour des raisons de sécurité.
                                                </p>
                                            </div>

                                            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />

                                            <h3 style="color: #004d91; font-size: 18px; font-weight: 400; margin: 0 0 15px 0;">
                                                Welcome ${firstName}!
                                            </h3>

                                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                Thank you for signing up with AVENIR Bank. To activate your account and access all our services, please verify your email address by clicking the button above.
                                            </p>

                                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                                                <p style="color: #856404; font-size: 14px; margin: 0;">
                                                    ⚠️ This link will expire in 24 hours for security reasons.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                                            <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                                                Si vous n'avez pas créé de compte, veuillez ignorer cet email.
                                            </p>
                                            <p style="color: #666666; font-size: 14px; margin: 0;">
                                                If you did not create an account, please ignore this email.
                                            </p>
                                            <p style="color: #999999; font-size: 12px; margin: 20px 0 0 0;">
                                                © ${new Date().getFullYear()} AVENIR Bank. Tous droits réservés. All rights reserved.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
            text: `
Vérification de votre email / Email Verification

Bonjour ${firstName},

Merci de vous être inscrit chez AVENIR Bank. Pour activer votre compte, veuillez cliquer sur le lien suivant :

${verificationLink}

Ce lien expirera dans 24 heures pour des raisons de sécurité.

---

Hello ${firstName},

Thank you for signing up with AVENIR Bank. To activate your account, please click on the following link:

${verificationLink}

This link will expire in 24 hours for security reasons.

---

Si vous n'avez pas créé de compte, veuillez ignorer cet email.
If you did not create an account, please ignore this email.

© ${new Date().getFullYear()} AVENIR Bank. Tous droits réservés. All rights reserved.
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${to}`);
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new Error('Failed to send verification email');
        }
    }
}

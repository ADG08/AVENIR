export interface EmailService {
    sendWelcomeEmail(to: string, firstName: string, lastName: string, identityNumber: string): Promise<void>;
    sendVerificationEmail(to: string, firstName: string, verificationToken: string): Promise<void>;
}

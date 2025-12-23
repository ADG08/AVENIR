import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AccountRepository } from "../../../domain/repositories/AccountRepository";
import { EmailService } from "../../../domain/services/EmailService";
import { randomUUID, randomBytes } from "crypto";
import * as bcrypt from "bcrypt";
import { UserState } from "../../../domain/enumerations/UserState";
import { UserRole } from "../../../domain/enumerations/UserRole";
import { RegisterUserRequest } from "../../requests/RegisterUserRequest";
import { RegisterUserResponse, RegisterUserResponseMapper } from "../../responses/RegisterUserResponse";
import { UserAlreadyExistsError } from "../../../domain/errors/UserAlreadyExistsError";
import { Account } from "../../../domain/entities/Account";
import { AccountType } from "../../../domain/enumerations/AccountType";

export class RegisterUserUseCase {
    private readonly SALT_ROUNDS = 10;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly accountRepository: AccountRepository,
        private readonly emailService: EmailService
    ) {}

    async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
        const existingUser = await this.userRepository.getByEmail(request.email);
        if (existingUser) {
            throw new UserAlreadyExistsError(request.email);
        }

        const identityNumber = this.generateIdentityNumber();
        const hashedPasscode = await bcrypt.hash(request.passcode, this.SALT_ROUNDS);
        const verificationToken = this.generateVerificationToken();

        const user = new User(
            randomUUID(),
            request.firstName,
            request.lastName,
            request.email,
            identityNumber,
            hashedPasscode,
            UserRole.CLIENT,
            UserState.INACTIVE,
            [],
            [],
            [],
            new Date(),
            verificationToken,
            undefined
        );

        await this.userRepository.add(user);

        // Generate unique IBAN and card number
        const iban = await this.generateUniqueIban();
        const cardNumber = await this.generateUniqueCardNumber();

        // Create a default current account for the new user
        const account = new Account(
            randomUUID(),
            user.id,
            iban,
            `Compte courant de ${user.firstName} ${user.lastName}`,
            AccountType.CURRENT,
            0.00,
            'EUR',
            cardNumber,
            `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`,
            this.generateCardExpiryDate(),
            this.generateCardCvv(),
            null,
            [],
            new Date()
        );

        await this.accountRepository.create(account);

        try {
            await this.emailService.sendVerificationEmail(
                user.email,
                user.firstName,
                verificationToken
            );
        } catch (error) {
            console.error("Failed to send verification email:", error);
            throw new Error("Failed to send verification email. Please try again.");
        }

        return RegisterUserResponseMapper.toResponse();
    }

    private generateIdentityNumber(): string {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${timestamp}${random}`;
    }

    private generateVerificationToken(): string {
        return randomBytes(32).toString('hex');
    }

    private generateIban(): string {
        // Generate a French IBAN (FR + 2 check digits + 23 digits)
        // Format: FRxx xxxx xxxx xxxx xxxx xxxx xxx
        const countryCode = 'FR';
        const checkDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        const bankCode = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        const branchCode = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        const accountNumber = Math.floor(Math.random() * 100000000000).toString().padStart(11, '0');
        const key = Math.floor(Math.random() * 100).toString().padStart(2, '0');

        return `${countryCode}${checkDigits}${bankCode}${branchCode}${accountNumber}${key}`;
    }

    private generateCardNumber(): string {
        // Generate a 16-digit card number (Visa format starts with 4)
        const prefix = '4';
        const randomDigits = Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0');
        return `${prefix}${randomDigits}`;
    }

    private generateCardExpiryDate(): string {
        // Generate expiry date 5 years from now (MM/YY format)
        const now = new Date();
        const expiryYear = (now.getFullYear() + 5) % 100;
        const expiryMonth = Math.floor(Math.random() * 12) + 1;
        return `${expiryMonth.toString().padStart(2, '0')}/${expiryYear.toString().padStart(2, '0')}`;
    }

    private generateCardCvv(): string {
        // Generate a 3-digit CVV
        return Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }

    private async generateUniqueIban(): Promise<string> {
        let iban: string;
        let attempts = 0;
        const maxAttempts = 10;

        do {
            iban = this.generateIban();
            const existingAccount = await this.accountRepository.findByIban(iban);

            if (!existingAccount) {
                return iban;
            }

            attempts++;
            if (attempts >= maxAttempts) {
                throw new Error('Unable to generate unique IBAN after multiple attempts');
            }
        } while (true);
    }

    private async generateUniqueCardNumber(): Promise<string> {
        let cardNumber: string;
        let attempts = 0;
        const maxAttempts = 10;

        do {
            cardNumber = this.generateCardNumber();
            const existingAccount = await this.accountRepository.findByCardNumber(cardNumber);

            if (!existingAccount) {
                return cardNumber;
            }

            attempts++;
            if (attempts >= maxAttempts) {
                throw new Error('Unable to generate unique card number after multiple attempts');
            }
        } while (true);
    }
}

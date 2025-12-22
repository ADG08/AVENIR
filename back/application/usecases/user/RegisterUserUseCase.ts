import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { EmailService } from "../../../domain/services/EmailService";
import { randomUUID, randomBytes } from "crypto";
import * as bcrypt from "bcrypt";
import { UserState } from "../../../domain/enumerations/UserState";
import { UserRole } from "../../../domain/enumerations/UserRole";
import { RegisterUserRequest } from "../../requests/RegisterUserRequest";
import { RegisterUserResponse, RegisterUserResponseMapper } from "../../responses/RegisterUserResponse";
import { UserAlreadyExistsError } from "../../../domain/errors/UserAlreadyExistsError";

export class RegisterUserUseCase {
    private readonly SALT_ROUNDS = 10;

    constructor(
        private readonly userRepository: UserRepository,
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
}

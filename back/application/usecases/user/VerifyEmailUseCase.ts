import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { EmailService } from "../../../domain/services/EmailService";
import { UserState } from "../../../domain/enumerations/UserState";
import { VerifyEmailRequest } from "../../requests/VerifyEmailRequest";
import { VerifyEmailResponse, VerifyEmailResponseMapper } from "../../responses/VerifyEmailResponse";
import {
    InvalidVerificationTokenError,
    EmailAlreadyVerifiedError,
    VerificationTokenExpiredError
} from "../../../domain/errors";

export class VerifyEmailUseCase {
    private readonly TOKEN_EXPIRATION_HOURS = 24;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailService: EmailService
    ) {}

    async execute(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
        const user = await this.userRepository.getByVerificationToken(request.token);

        if (!user) {
            throw new InvalidVerificationTokenError();
        }

        if (user.verifiedAt) {
            throw new EmailAlreadyVerifiedError();
        }

        const tokenAge = Date.now() - user.createdAt.getTime();
        const maxAge = this.TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000;

        if (tokenAge > maxAge) {
            throw new VerificationTokenExpiredError();
        }

        const verifiedUser = new User(
            user.id,
            user.firstName,
            user.lastName,
            user.email,
            user.identityNumber,
            user.passcode,
            user.role,
            UserState.ACTIVE,
            user.accounts,
            user.loans,
            user.orders,
            user.createdAt,
            undefined,
            new Date()
        );

        await this.userRepository.update(verifiedUser);

        try {
            await this.emailService.sendWelcomeEmail(
                verifiedUser.email,
                verifiedUser.firstName,
                verifiedUser.lastName,
                verifiedUser.identityNumber
            );
        } catch (error) {
            console.error("Failed to send welcome email:", error);
        }

        return VerifyEmailResponseMapper.toResponse(verifiedUser);
    }
}

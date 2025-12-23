import { User } from "../../domain/entities/User";

export interface VerifyEmailResponse {
    success: boolean;
    message: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        identityNumber: string;
        role: string;
    };
}

export class VerifyEmailResponseMapper {
    static toResponse(user: User): VerifyEmailResponse {
        return {
            success: true,
            message: "Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.",
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                identityNumber: user.identityNumber,
                role: user.role,
            }
        };
    }
}

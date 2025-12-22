export interface RegisterUserResponse {
    success: boolean;
    message: string;
}

export class RegisterUserResponseMapper {
    static toResponse(): RegisterUserResponse {
        return {
            success: true,
            message: "Un email de vérification a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification pour activer votre compte."
        };
    }
}

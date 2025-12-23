export interface LoginUserResponse {
    success: boolean;
    message: string;
}

export class LoginUserResponseMapper {
    static toResponse(): LoginUserResponse {
        return {
            success: true,
            message: "Connexion réussie. Bienvenue !",
        };
    }
}

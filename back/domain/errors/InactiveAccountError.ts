import { DomainError } from "./DomainError";

export class InactiveAccountError extends DomainError {
    constructor() {
        super("Votre compte n'est pas encore activé. Veuillez vérifier votre email.");
    }
}

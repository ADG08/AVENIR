import { DomainError } from "./DomainError";

export class InvalidCredentialsError extends DomainError {
    constructor() {
        super("Numéro d'identité ou code secret incorrect.");
    }
}

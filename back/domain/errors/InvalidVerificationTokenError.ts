import { DomainError } from "./DomainError";

export class InvalidVerificationTokenError extends DomainError {
    constructor() {
        super("Invalid or expired verification token");
    }
}

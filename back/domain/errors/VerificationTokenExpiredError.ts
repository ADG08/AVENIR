import { DomainError } from "./DomainError";

export class VerificationTokenExpiredError extends DomainError {
    constructor() {
        super("Verification token has expired. Please request a new one.");
    }
}

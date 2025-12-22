import { DomainError } from "./DomainError";

export class EmailAlreadyVerifiedError extends DomainError {
    constructor() {
        super("Email already verified");
    }
}

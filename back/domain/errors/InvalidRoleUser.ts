import { DomainError } from "./DomainError";

export class InvalidRoleUser extends DomainError {
    constructor() {
        super("Role invalide.");
    }
}

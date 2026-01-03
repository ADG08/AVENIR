import { DomainError } from './DomainError';

export class DuplicateSavingTypeError extends DomainError {
    constructor(savingType: string) {
        super(`You already have a savings account of type ${savingType}. You can only have one account per saving type.`);
    }
}


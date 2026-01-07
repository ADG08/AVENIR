import { AccountRepository } from "../../../domain/repositories/AccountRepository";
import { UpdateAccountNameRequest } from "../../requests/UpdateAccountNameRequest";
import { AccountNotFoundError } from "../../../domain/errors/AccountNotFoundError";
import { UnauthorizedAccountAccessError } from "../../../domain/errors/UnauthorizedAccountAccessError";
import { AccountType } from "@avenir/shared/enums/AccountType";
import { ValidationError } from "../../errors/ValidationError";

export class UpdateAccountNameUseCase {
    constructor(private readonly accountRepository: AccountRepository) {}

    async execute(request: UpdateAccountNameRequest): Promise<void> {
        if (!request.name || request.name.trim().length === 0) {
            throw new ValidationError('Account name is required and cannot be empty');
        }

        const account = await this.accountRepository.getById(request.id);
        if (!account) {
            throw new AccountNotFoundError(request.id);
        }

        if (account.userId !== request.userId) {
            throw new UnauthorizedAccountAccessError();
        }

        if (account.type === AccountType.SAVINGS) {
            throw new ValidationError('Savings account names cannot be changed. The name is determined by the saving rate.');
        }

        await this.accountRepository.updateName(request.id, request.name.trim());
    }
}

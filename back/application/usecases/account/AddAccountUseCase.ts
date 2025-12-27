import { AccountRepository } from "../../../domain/repositories/AccountRepository";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AccountFactory } from "../../../domain/services/AccountFactory";
import { randomUUID } from "crypto";
import { AddAccountRequest } from "../../requests/AddAccountRequest";
import { AddAccountResponse, AddAccountResponseMapper } from "../../responses/AddAccountResponse";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { DuplicateSavingTypeError } from "../../../domain/errors/DuplicateSavingTypeError";
import { AccountType } from "@avenir/shared/enums/AccountType";

export class AddAccountUseCase {
    private readonly accountFactory: AccountFactory;

    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly userRepository: UserRepository
    ) {
        this.accountFactory = new AccountFactory(accountRepository);
    }

    async execute(request: AddAccountRequest): Promise<AddAccountResponse> {
        const user = await this.userRepository.getById(request.userId);
        if (!user) {
            throw new UserNotFoundError(request.userId);
        }

        if (request.type === AccountType.SAVINGS && request.savingType) {
            const userAccounts = await this.accountRepository.getByUserId(request.userId);
            const existingSavingsAccount = userAccounts.find(
                (acc) => acc.type === AccountType.SAVINGS && acc.savingType === request.savingType
            );

            if (existingSavingsAccount) {
                throw new DuplicateSavingTypeError(request.savingType);
            }
        }

        const holderName = `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`;
        const account = await this.accountFactory.createAccount(
            randomUUID(),
            user.id,
            request.name || `Compte ${request.type}`,
            request.type,
            holderName,
            request.savingType || null
        );

        const savedAccount = await this.accountRepository.add(account);
        return AddAccountResponseMapper.toResponse(savedAccount);
    }
}

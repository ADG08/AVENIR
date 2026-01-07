import { TransactionRepository } from '../../../domain/repositories/TransactionRepository';
import { AccountRepository } from '../../../domain/repositories/AccountRepository';
import { GetTransactionsRequest } from '../../requests/GetTransactionsRequest';
import { GetTransactionsResponse, GetTransactionsResponseMapper } from '../../responses/GetTransactionsResponse';
import { AccountNotFoundError } from '../../../domain/errors/AccountNotFoundError';
import { UnauthorizedAccountAccessError } from '../../../domain/errors/UnauthorizedAccountAccessError';

export class GetTransactionsUseCase {
    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly accountRepository: AccountRepository
    ) {}

    async execute(request: GetTransactionsRequest): Promise<GetTransactionsResponse[]> {
        if (request.accountId) {
            const account = await this.accountRepository.getById(request.accountId);
            if (!account) {
                throw new AccountNotFoundError(request.accountId);
            }
            if (account.userId !== request.userId) {
                throw new UnauthorizedAccountAccessError();
            }
            const transactions = await this.transactionRepository.getByAccountId(request.accountId);
            return GetTransactionsResponseMapper.toResponseList(transactions);
        }

        const transactions = await this.transactionRepository.getByUserId(request.userId);
        return GetTransactionsResponseMapper.toResponseList(transactions);
    }
}

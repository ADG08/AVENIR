import { TransactionRepository } from '../../../domain/repositories/TransactionRepository';
import { AccountRepository } from '../../../domain/repositories/AccountRepository';
import { CreateTransactionRequest } from '../../requests/CreateTransactionRequest';
import { CreateTransactionResponse, CreateTransactionResponseMapper } from '../../responses/CreateTransactionResponse';
import { AccountNotFoundError } from '../../../domain/errors/AccountNotFoundError';
import { UnauthorizedAccountAccessError } from '../../../domain/errors/UnauthorizedAccountAccessError';
import { ValidationError } from '../../errors/ValidationError';
import { TransactionType, SavingTypeMaxAmount } from '@avenir/shared/enums';
import { Transaction } from '../../../domain/entities/Transaction';
import { Account } from '../../../domain/entities/Account';
import { AccountType } from '@avenir/shared/enums/AccountType';
import { randomUUID } from 'crypto';

export class CreateTransactionUseCase {
    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly accountRepository: AccountRepository
    ) {}

    async execute(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
        if (!request.fromAccountId) {
            throw new ValidationError('From account ID is required');
        }

        const fromAccount = await this.accountRepository.getById(request.fromAccountId);
        if (!fromAccount) {
            throw new AccountNotFoundError(request.fromAccountId);
        }

        // Ensure the fromAccount belongs to the user (security check)
        if (fromAccount.userId !== request.userId) {
            throw new UnauthorizedAccountAccessError();
        }

        let toAccount: Account | null = null;

        // Handle different transaction types
        if (request.type === TransactionType.DEPOSIT) {
            // For deposits, toAccountId can be the same as fromAccountId or omitted
            if (request.toAccountId) {
                toAccount = await this.accountRepository.getById(request.toAccountId);
                if (!toAccount) {
                    throw new AccountNotFoundError(request.toAccountId);
                }
                // For deposits, toAccount must belong to the user
                if (toAccount.userId !== request.userId) {
                    throw new UnauthorizedAccountAccessError();
                }
            } else {
                // If no toAccountId provided, use fromAccount for deposit
                toAccount = fromAccount;
            }

            // Validate savings account limits
            this.validateSavingsAccountLimit(toAccount, request.amount);
        } else if (request.type === TransactionType.TRANSFER) {
            // For transfers, toAccountId is required
            if (!request.toAccountId) {
                throw new ValidationError('Transfer requires a destination account');
            }

            toAccount = await this.accountRepository.getById(request.toAccountId);
            if (!toAccount) {
                throw new AccountNotFoundError(request.toAccountId);
            }

            // Ensure fromAccount and toAccount are different
            if (fromAccount.id === toAccount.id) {
                throw new ValidationError('Cannot transfer to the same account');
            }

            // Check sufficient balance for transfer
            if (fromAccount.balance < request.amount) {
                throw new ValidationError('Insufficient balance');
            }

            // Validate savings account limits
            this.validateSavingsAccountLimit(toAccount, request.amount);
        } else {
            throw new ValidationError('Invalid transaction type');
        }

        const transaction = new Transaction(
            randomUUID(),
            fromAccount,
            toAccount,
            request.amount,
            request.description || null,
            request.type,
            new Date()
        );

        await this.updateAccountBalances(transaction);
        const savedTransaction = await this.transactionRepository.add(transaction);

        return CreateTransactionResponseMapper.toResponse(savedTransaction);
    }

    private validateSavingsAccountLimit(account: Account, amount: number): void {
        if (account.type === AccountType.SAVINGS && account.savingType) {
            const maxAmount = SavingTypeMaxAmount[account.savingType];
            if (maxAmount && maxAmount > 0) {
                const newBalance = account.balance + amount;
                if (newBalance > maxAmount) {
                    const remaining = maxAmount - account.balance;
                    throw new ValidationError(
                        `Le solde du compte d'épargne ne peut pas dépasser ${maxAmount}€. ` +
                        `Solde actuel: ${account.balance}€, vous pouvez ajouter au maximum ${remaining}€`
                    );
                }
            }
        }
    }

    private async updateAccountBalances(transaction: Transaction): Promise<void> {
        switch (transaction.type) {
            case TransactionType.DEPOSIT:
                await this.accountRepository.updateBalance(
                    transaction.toAccount.id,
                    transaction.amount
                );
                break;
                
            case TransactionType.TRANSFER:
                await this.accountRepository.updateBalance(
                    transaction.fromAccount.id,
                    -transaction.amount
                );
                await this.accountRepository.updateBalance(
                    transaction.toAccount.id,
                    transaction.amount
                );
                break;
        }
    }
}

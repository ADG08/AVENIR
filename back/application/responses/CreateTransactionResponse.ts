import { Transaction } from '../../domain/entities/Transaction';
import { TransactionType } from '@avenir/shared/enums';

export type CreateTransactionResponse = {
    readonly id: string;
    readonly fromAccountId: string;
    readonly toAccountId: string;
    readonly amount: number;
    readonly description: string | null;
    readonly type: TransactionType;
    readonly createdAt: Date;
};

export class CreateTransactionResponseMapper {
    static toResponse(transaction: Transaction): CreateTransactionResponse {
        return {
            id: transaction.id,
            fromAccountId: transaction.fromAccount.id,
            toAccountId: transaction.toAccount.id,
            amount: transaction.amount,
            description: transaction.description,
            type: transaction.type,
            createdAt: transaction.createdAt,
        };
    }
}

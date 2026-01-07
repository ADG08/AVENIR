import { Transaction } from '../../domain/entities/Transaction';
import { TransactionType } from '@avenir/shared/enums';

export type GetTransactionsResponse = {
    readonly id: string;
    readonly fromAccountId: string;
    readonly toAccountId: string;
    readonly amount: number;
    readonly description: string | null;
    readonly type: TransactionType;
    readonly createdAt: Date;
};

export class GetTransactionsResponseMapper {
    static toResponse(transaction: Transaction): GetTransactionsResponse {
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

    static toResponseList(transactions: Transaction[]): GetTransactionsResponse[] {
        return transactions.map(transaction => this.toResponse(transaction));
    }
}

import { TransactionType } from '@avenir/shared/enums';

export type CreateTransactionRequest = {
    readonly userId: string;
    readonly fromAccountId: string;
    readonly toAccountId?: string;
    readonly amount: number;
    readonly description?: string;
    readonly type: TransactionType;
};

import { Transaction } from '../entities/Transaction';

export interface TransactionRepository {
    add(transaction: Transaction): Promise<Transaction>;
    getById(id: string): Promise<Transaction | null>;
    getByAccountId(accountId: string): Promise<Transaction[]>;
    getByUserId(userId: string): Promise<Transaction[]>;
}


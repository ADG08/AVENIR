import mysql, { RowDataPacket } from 'mysql2/promise';
import { Transaction } from '../../../../domain/entities/Transaction';
import { TransactionRepository } from '../../../../domain/repositories/TransactionRepository';
import { TransactionType } from '@avenir/shared/enums';
import { AccountRepository } from '../../../../domain/repositories/AccountRepository';

export class MySQLTransactionRepository implements TransactionRepository {
    constructor(
        private pool: mysql.Pool,
        private accountRepository: AccountRepository
    ) {}

    async add(transaction: Transaction): Promise<Transaction> {
        const fromAccountId = transaction.fromAccount.id;
        const toAccountId = transaction.toAccount.id;
        
        const query = `
            INSERT INTO transactions (id, from_account_id, to_account_id, type, amount, description, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        try {
            await this.pool.execute(query, [
                transaction.id,
                fromAccountId,
                toAccountId,
                transaction.type,
                transaction.amount,
                transaction.description,
                transaction.createdAt
            ]);

            return transaction;
        } catch (error) {
            throw error;
        }
    }

    async getById(id: string): Promise<Transaction | null> {
        const query = `
            SELECT t.*, COALESCE(a_from.user_id, a_to.user_id) as user_id
            FROM transactions t
            LEFT JOIN accounts a_from ON t.from_account_id = a_from.id
            LEFT JOIN accounts a_to ON t.to_account_id = a_to.id
            WHERE t.id = ?
        `;

        try {
            const [rows] = await this.pool.execute(query, [id]);
            const result = rows as RowDataPacket[];
            if (result.length === 0) return null;

            return await this.mapRowToTransaction(result[0]);
        } catch (error) {
            throw error;
        }
    }

    async getByAccountId(accountId: string): Promise<Transaction[]> {
        const query = `
            SELECT t.*, COALESCE(a_from.user_id, a_to.user_id) as user_id
            FROM transactions t
            LEFT JOIN accounts a_from ON t.from_account_id = a_from.id
            LEFT JOIN accounts a_to ON t.to_account_id = a_to.id
            WHERE t.from_account_id = ? OR t.to_account_id = ?
            ORDER BY t.created_at DESC
        `;

        try {
            const [rows] = await this.pool.execute(query, [accountId, accountId]);
            const result = rows as RowDataPacket[];
            const transactions: Transaction[] = [];

            for (const row of result) {
                const transaction = await this.mapRowToTransaction(row);
                transactions.push(transaction);
            }

            return transactions;
        } catch (error) {
            throw error;
        }
    }

    async getByUserId(userId: string): Promise<Transaction[]> {
        const query = `
            SELECT DISTINCT t.*, COALESCE(a_from.user_id, a_to.user_id) as user_id
            FROM transactions t
            LEFT JOIN accounts a_from ON t.from_account_id = a_from.id
            LEFT JOIN accounts a_to ON t.to_account_id = a_to.id
            WHERE a_from.user_id = ? OR a_to.user_id = ?
            ORDER BY t.created_at DESC
        `;

        try {
            const [rows] = await this.pool.execute(query, [userId, userId]);
            const result = rows as RowDataPacket[];
            const transactions: Transaction[] = [];

            for (const row of result) {
                const transaction = await this.mapRowToTransaction(row);
                transactions.push(transaction);
            }

            return transactions;
        } catch (error) {
            throw error;
        }
    }


    private async mapRowToTransaction(row: RowDataPacket): Promise<Transaction> {
        // With the new status system, accounts are never deleted (only marked as INACTIVE)
        // However, we still handle NULL cases for backward compatibility with old data
        if (!row.from_account_id) {
            throw new Error(`Transaction ${row.id} has no from_account_id`);
        }

        const fromAccount = await this.accountRepository.getById(row.from_account_id);
        if (!fromAccount) {
            throw new Error(`From Account ${row.from_account_id} not found for transaction ${row.id}`);
        }

        // Use to_account_id if available, otherwise use fromAccount (for same account deposits)
        let toAccount = fromAccount;
        if (row.to_account_id && row.to_account_id !== row.from_account_id) {
            const toAccountData = await this.accountRepository.getById(row.to_account_id);
            if (!toAccountData) {
                throw new Error(`To Account ${row.to_account_id} not found for transaction ${row.id}`);
            }
            toAccount = toAccountData;
        }

        return new Transaction(
            row.id,
            fromAccount,
            toAccount,
            parseFloat(String(row.amount)),
            row.description,
            row.type as TransactionType,
            new Date(row.created_at)
        );
    }
}


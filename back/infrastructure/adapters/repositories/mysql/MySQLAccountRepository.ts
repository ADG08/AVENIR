import mysql, { RowDataPacket } from 'mysql2/promise';
import { Account } from '../../../../domain/entities/Account';
import { AccountRepository } from '../../../../domain/repositories/AccountRepository';
import { AccountType, AccountStatus } from '@avenir/shared/enums';
import { SavingType } from '@avenir/shared/enums/SavingType';

export class MySQLAccountRepository implements AccountRepository {
    constructor(private pool: mysql.Pool) { }

    async add(account: Account): Promise<Account> {
        const query = `
            INSERT INTO accounts (
                id, user_id, iban, name, type, balance, currency,
                card_number, card_holder_name, card_expiry_date, card_cvv,
                saving_type, status, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        try {
            await this.pool.execute(query, [
                account.id,
                account.userId,
                account.iban,
                account.name,
                account.type,
                account.balance,
                account.currency,
                account.cardNumber,
                account.cardHolderName,
                account.cardExpiryDate,
                account.cardCvv,
                account.savingType,
                account.status || AccountStatus.ACTIVE,
                account.createdAt
            ]);

            return account;
        } catch (error) {
            console.error('MySQL error adding account:', error);
            throw error;
        }
    }

    async getById(id: string): Promise<Account | null> {
        const query = 'SELECT * FROM accounts WHERE id = ?';

        try {
            const [rows] = await this.pool.execute(query, [id]);
            const accounts = rows as RowDataPacket[];

            if (accounts.length === 0) return null;

            return this.mapRowToAccount(accounts[0]);
        } catch (error) {
            console.error('MySQL error getting account:', error);
            throw error;
        }
    }

    async getByUserId(userId: string): Promise<Account[]> {
        // Only return ACTIVE accounts for normal queries
        const query = 'SELECT * FROM accounts WHERE user_id = ? AND status = ? ORDER BY created_at DESC';

        try {
            const [rows] = await this.pool.execute(query, [userId, AccountStatus.ACTIVE]);
            const accounts = rows as RowDataPacket[];

            return accounts.map(row => this.mapRowToAccount(row));
        } catch (error) {
            console.error('MySQL error getting accounts by user:', error);
            throw error;
        }
    }

    async getByIban(iban: string): Promise<Account | null> {
        const query = 'SELECT * FROM accounts WHERE iban = ?';

        try {
            const [rows] = await this.pool.execute(query, [iban]);
            const accounts = rows as RowDataPacket[];

            if (accounts.length === 0) return null;

            return this.mapRowToAccount(accounts[0]);
        } catch (error) {
            console.error('MySQL error getting account by IBAN:', error);
            throw error;
        }
    }

    async getByCardNumber(cardNumber: string): Promise<Account | null> {
        const query = 'SELECT * FROM accounts WHERE card_number = ?';

        try {
            const [rows] = await this.pool.execute(query, [cardNumber]);
            const accounts = rows as RowDataPacket[];

            if (accounts.length === 0) return null;

            return this.mapRowToAccount(accounts[0]);
        } catch (error) {
            console.error('MySQL error getting account by card number:', error);
            throw error;
        }
    }

    async updateName(accountId: string, name: string | null): Promise<Account> {
        const query = `
            UPDATE accounts
            SET name = ?
            WHERE id = ?
        `;

        try {
            await this.pool.execute(query, [name, accountId]);
            const account = await this.getById(accountId);
            if (!account) {
                throw new Error(`Account ${accountId} not found`);
            }

            return account;
        } catch (error) {
            console.error('MySQL error updating account name:', error);
            throw error;
        }
    }

    async updateBalance(accountId: string, amount: number): Promise<Account> {
        const query = `
            UPDATE accounts
            SET balance = balance + ?
            WHERE id = ?
        `;

        try {
            await this.pool.execute(query, [amount, accountId]);
            const account = await this.getById(accountId);
            if (!account) {
                throw new Error(`Account ${accountId} not found`);
            }
            return account;
        } catch (error) {
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        // Mark account as INACTIVE instead of deleting it
        try {
            await this.pool.execute('UPDATE accounts SET status = ? WHERE id = ?', [AccountStatus.INACTIVE, id]);
        } catch (error) {
            console.error('MySQL error removing account:', error);
            throw error;
        }
    }

    private mapRowToAccount(row: RowDataPacket): Account {
        return new Account(
            row.id,
            row.user_id,
            row.iban,
            row.name,
            row.type as AccountType,
            parseFloat(String(row.balance)),
            row.currency,
            row.card_number,
            row.card_holder_name,
            row.card_expiry_date,
            row.card_cvv,
            row.saving_type as SavingType | null,
            (row.status as AccountStatus) || AccountStatus.ACTIVE,
            [],
            new Date(row.created_at)
        );
    }
}

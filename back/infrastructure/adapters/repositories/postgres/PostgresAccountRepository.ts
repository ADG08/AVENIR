import { Pool } from 'pg';
import { Account } from '../../../../domain/entities/Account';
import { AccountRepository } from '../../../../domain/repositories/AccountRepository';
import { AccountType, AccountStatus } from '@avenir/shared/enums';
import { SavingType } from '@avenir/shared/enums/SavingType';

export class PostgresAccountRepository implements AccountRepository {
    constructor(private pool: Pool) { }

    async add(account: Account): Promise<Account> {
        const query = `
            INSERT INTO accounts (
                id, user_id, iban, name, type, balance, currency,
                card_number, card_holder_name, card_expiry_date, card_cvv,
                saving_type, status, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `;

        try {
            const result = await this.pool.query(query, [
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

            return this.mapRowToAccount(result.rows[0]);
        } catch (error) {
            console.error('PostgreSQL error adding account:', error);
            throw error;
        }
    }

    async getById(id: string): Promise<Account | null> {
        // Allow getting both ACTIVE and INACTIVE accounts by ID (for transactions, etc.)
        const query = 'SELECT * FROM accounts WHERE id = $1';

        try {
            const result = await this.pool.query(query, [id]);
            if (result.rows.length === 0) return null;

            return this.mapRowToAccount(result.rows[0]);
        } catch (error) {
            console.error('PostgreSQL error getting account:', error);
            throw error;
        }
    }

    async getByUserId(userId: string): Promise<Account[]> {
        // Only return ACTIVE accounts for normal queries
        const query = 'SELECT * FROM accounts WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC';

        try {
            const result = await this.pool.query(query, [userId, AccountStatus.ACTIVE]);
            return result.rows.map(row => this.mapRowToAccount(row));
        } catch (error) {
            console.error('PostgreSQL error getting accounts by user:', error);
            throw error;
        }
    }

    async getByIban(iban: string): Promise<Account | null> {
        const query = 'SELECT * FROM accounts WHERE iban = $1';

        try {
            const result = await this.pool.query(query, [iban]);
            if (result.rows.length === 0) return null;

            return this.mapRowToAccount(result.rows[0]);
        } catch (error) {
            console.error('PostgreSQL error getting account by IBAN:', error);
            throw error;
        }
    }

    async getByCardNumber(cardNumber: string): Promise<Account | null> {
        const query = 'SELECT * FROM accounts WHERE card_number = $1';

        try {
            const result = await this.pool.query(query, [cardNumber]);
            if (result.rows.length === 0) return null;

            return this.mapRowToAccount(result.rows[0]);
        } catch (error) {
            console.error('PostgreSQL error getting account by card number:', error);
            throw error;
        }
    }

    async updateName(accountId: string, name: string | null): Promise<Account> {
        const query = `
            UPDATE accounts
            SET name = $2
            WHERE id = $1
            RETURNING *
        `;

        try {
            const result = await this.pool.query(query, [accountId, name]);
            if (result.rows.length === 0) {
                throw new Error(`Account ${accountId} not found`);
            }

            return this.mapRowToAccount(result.rows[0]);
        } catch (error) {
            console.error('PostgreSQL error updating account name:', error);
            throw error;
        }
    }

    async updateBalance(accountId: string, amount: number): Promise<Account> {
        const query = `
            UPDATE accounts
            SET balance = balance + $1
            WHERE id = $2
            RETURNING *
        `;

        try {
            const result = await this.pool.query(query, [amount, accountId]);
            if (result.rows.length === 0) {
                throw new Error(`Account ${accountId} not found`);
            }
            return this.mapRowToAccount(result.rows[0]);
        } catch (error) {
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        // Mark account as INACTIVE instead of deleting it
        try {
            await this.pool.query('UPDATE accounts SET status = $1 WHERE id = $2', [AccountStatus.INACTIVE, id]);
        } catch (error) {
            console.error('PostgreSQL error removing account:', error);
            throw error;
        }
    }

    private mapRowToAccount(row: any): Account {
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

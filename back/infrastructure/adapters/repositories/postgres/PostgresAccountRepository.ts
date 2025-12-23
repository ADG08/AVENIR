import { Pool } from 'pg';
import { Account } from '../../../../domain/entities/Account';
import { AccountRepository } from '../../../../domain/repositories/AccountRepository';
import { AccountType } from '../../../../domain/enumerations/AccountType';
import { RowDataPacket } from 'mysql2/promise';

export class PostgresAccountRepository implements AccountRepository {
    constructor(private pool: Pool) { }

    async create(account: Account): Promise<Account> {
        const query = `
            INSERT INTO accounts (
                id, user_id, iban, name, type, balance, currency,
                card_number, card_holder_name, card_expiry_date, card_cvv,
                saving_rate_id, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
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
                account.savingRate?.id || null,
                account.createdAt
            ]);

            return this.mapRowToAccount(result.rows[0]);
        } catch (error) {
            console.error('PostgreSQL error creating account:', error);
            throw error;
        }
    }

    async findById(id: string): Promise<Account | null> {
        const query = 'SELECT * FROM accounts WHERE id = $1';

        try {
            const result = await this.pool.query(query, [id]);
            if (result.rows.length === 0) return null;

            return this.mapRowToAccount(result.rows[0]);
        } catch (error) {
            console.error('PostgreSQL error finding account:', error);
            throw error;
        }
    }

    async findByUserId(userId: string): Promise<Account[]> {
        const query = 'SELECT * FROM accounts WHERE user_id = $1 ORDER BY created_at DESC';

        try {
            const result = await this.pool.query(query, [userId]);
            return result.rows.map(row => this.mapRowToAccount(row));
        } catch (error) {
            console.error('PostgreSQL error finding accounts by user:', error);
            throw error;
        }
    }

    async findByIban(iban: string): Promise<Account | null> {
        const query = 'SELECT * FROM accounts WHERE iban = $1';

        try {
            const result = await this.pool.query(query, [iban]);
            if (result.rows.length === 0) return null;

            return this.mapRowToAccount(result.rows[0]);
        } catch (error) {
            console.error('PostgreSQL error finding account by IBAN:', error);
            throw error;
        }
    }

    async findByCardNumber(cardNumber: string): Promise<Account | null> {
        const query = 'SELECT * FROM accounts WHERE card_number = $1';

        try {
            const result = await this.pool.query(query, [cardNumber]);
            if (result.rows.length === 0) return null;

            return this.mapRowToAccount(result.rows[0]);
        } catch (error) {
            console.error('PostgreSQL error finding account by card number:', error);
            throw error;
        }
    }

    async update(account: Account): Promise<Account> {
        const query = `
            UPDATE accounts
            SET iban = $2, name = $3, type = $4, balance = $5, currency = $6,
                card_number = $7, card_holder_name = $8, card_expiry_date = $9,
                card_cvv = $10, saving_rate_id = $11
            WHERE id = $1
            RETURNING *
        `;

        try {
            const result = await this.pool.query(query, [
                account.id,
                account.iban,
                account.name,
                account.type,
                account.balance,
                account.currency,
                account.cardNumber,
                account.cardHolderName,
                account.cardExpiryDate,
                account.cardCvv,
                account.savingRate?.id || null
            ]);

            return this.mapRowToAccount(result.rows[0]);
        } catch (error) {
            console.error('PostgreSQL error updating account:', error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.pool.query('DELETE FROM accounts WHERE id = $1', [id]);
        } catch (error) {
            console.error('PostgreSQL error deleting account:', error);
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
            parseFloat(row.balance),
            row.currency,
            row.card_number,
            row.card_holder_name,
            row.card_expiry_date,
            row.card_cvv,
            null,
            [],
            new Date(row.created_at)
        );
    }
}

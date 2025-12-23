import mysql, { RowDataPacket } from 'mysql2/promise';
import { Account } from '../../../../domain/entities/Account';
import { AccountRepository } from '../../../../domain/repositories/AccountRepository';
import { AccountType } from '../../../../domain/enumerations/AccountType';

export class MySQLAccountRepository implements AccountRepository {
    constructor(private pool: mysql.Pool) { }

    async create(account: Account): Promise<Account> {
        const query = `
            INSERT INTO accounts (
                id, user_id, iban, name, type, balance, currency,
                card_number, card_holder_name, card_expiry_date, card_cvv,
                saving_rate_id, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                account.savingRate?.id || null,
                account.createdAt
            ]);

            return account;
        } catch (error) {
            console.error('MySQL error creating account:', error);
            throw error;
        }
    }

    async findById(id: string): Promise<Account | null> {
        const query = 'SELECT * FROM accounts WHERE id = ?';

        try {
            const [rows] = await this.pool.execute(query, [id]);
            const accounts = rows as RowDataPacket[];

            if (accounts.length === 0) return null;

            return this.mapRowToAccount(accounts[0]);
        } catch (error) {
            console.error('MySQL error finding account:', error);
            throw error;
        }
    }

    async findByUserId(userId: string): Promise<Account[]> {
        const query = 'SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at DESC';

        try {
            const [rows] = await this.pool.execute(query, [userId]);
            const accounts = rows as RowDataPacket[];

            return accounts.map(row => this.mapRowToAccount(row));
        } catch (error) {
            console.error('MySQL error finding accounts by user:', error);
            throw error;
        }
    }

    async findByIban(iban: string): Promise<Account | null> {
        const query = 'SELECT * FROM accounts WHERE iban = ?';

        try {
            const [rows] = await this.pool.execute(query, [iban]);
            const accounts = rows as RowDataPacket[];

            if (accounts.length === 0) return null;

            return this.mapRowToAccount(accounts[0]);
        } catch (error) {
            console.error('MySQL error finding account by IBAN:', error);
            throw error;
        }
    }

    async findByCardNumber(cardNumber: string): Promise<Account | null> {
        const query = 'SELECT * FROM accounts WHERE card_number = ?';

        try {
            const [rows] = await this.pool.execute(query, [cardNumber]);
            const accounts = rows as RowDataPacket[];

            if (accounts.length === 0) return null;

            return this.mapRowToAccount(accounts[0]);
        } catch (error) {
            console.error('MySQL error finding account by card number:', error);
            throw error;
        }
    }

    async update(account: Account): Promise<Account> {
        const query = `
            UPDATE accounts
            SET iban = ?, name = ?, type = ?, balance = ?, currency = ?,
                card_number = ?, card_holder_name = ?, card_expiry_date = ?,
                card_cvv = ?, saving_rate_id = ?
            WHERE id = ?
        `;

        try {
            await this.pool.execute(query, [
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
                account.id
            ]);

            return account;
        } catch (error) {
            console.error('MySQL error updating account:', error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.pool.execute('DELETE FROM accounts WHERE id = ?', [id]);
        } catch (error) {
            console.error('MySQL error deleting account:', error);
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

import { Pool as MySQLPool } from 'mysql2/promise';
import { User } from '../../../../domain/entities/User';
import { UserRepository } from '../../../../domain/repositories/UserRepository';
import { UserRole } from '../../../../domain/enumerations/UserRole';
import { UserState } from '../../../../domain/enumerations/UserState';

export class MySQLUserRepository implements UserRepository {
    constructor(private pool: MySQLPool) {}

    async add(user: User): Promise<User> {
        const insertQuery = `
            INSERT INTO users (id, first_name, last_name, email, identity_number, passcode, role, state, verification_token, verified_at, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        try {
            await this.pool.execute(insertQuery, [
                user.id,
                user.firstName,
                user.lastName,
                user.email,
                user.identityNumber,
                user.passcode,
                user.role,
                user.state,
                user.verificationToken || null,
                user.verifiedAt || null,
                user.createdAt
            ]);
            return user;
        } catch (error) {
            console.error('MySQL error:', error);
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        try {
            await this.pool.execute('DELETE FROM users WHERE id = ?', [id]);
        } catch (error) {
            console.error('MySQL error:', error);
            throw error;
        }
    }

    async update(user: User): Promise<void> {
        const query = `
            UPDATE users
            SET first_name = ?, last_name = ?, email = ?, 
                identity_number = ?, passcode = ?, role = ?, state = ?
            WHERE id = ?
        `;
        
        try {
            await this.pool.execute(query, [
                user.firstName,
                user.lastName,
                user.email,
                user.identityNumber,
                user.passcode,
                user.role,
                user.state,
                user.id
            ]);
        } catch (error) {
            console.error('MySQL error:', error);
            throw error;
        }
    }

    async getById(id: string): Promise<User | null> {
        try {
            const [rows] = await this.pool.execute('SELECT * FROM users WHERE id = ?', [id]);
            const results = rows as any[];
            return results.length === 0 ? null : this.mapRowToUser(results[0]);
        } catch (error) {
            console.error('MySQL error:', error);
            throw error;
        }
    }

    async getByEmail(email: string): Promise<User | null> {
        try {
            const [rows] = await this.pool.execute('SELECT * FROM users WHERE email = ?', [email]);
            const results = rows as any[];
            return results.length === 0 ? null : this.mapRowToUser(results[0]);
        } catch (error) {
            console.error('MySQL error:', error);
            throw error;
        }
    }

    async getByIdentityNumber(identityNumber: string): Promise<User | null> {
        try {
            const [rows] = await this.pool.execute('SELECT * FROM users WHERE identity_number = ?', [identityNumber]);
            const results = rows as any[];
            return results.length === 0 ? null : this.mapRowToUser(results[0]);
        } catch (error) {
            console.error('MySQL error:', error);
            throw error;
        }
    }

    async getAll(): Promise<User[]> {
        try {
            const [rows] = await this.pool.execute('SELECT * FROM users ORDER BY created_at DESC');
            const results = rows as any[];
            return results.map(row => this.mapRowToUser(row));
        } catch (error) {
            console.error('MySQL error:', error);
            throw error;
        }
    }

    async getByVerificationToken(token: string): Promise<User | null> {
        try {
            const [rows] = await this.pool.execute('SELECT * FROM users WHERE verification_token = ?', [token]);
            const results = rows as any[];
            return results.length === 0 ? null : this.mapRowToUser(results[0]);
        } catch (error) {
            console.error('MySQL error:', error);
            throw error;
        }
    }

    private mapRowToUser(row: any): User {
        return new User(
            row.id,
            row.first_name,
            row.last_name,
            row.email,
            row.identity_number,
            row.passcode,
            row.role as UserRole,
            row.state as UserState,
            [],
            [],
            [],
            new Date(row.created_at),
            row.verification_token,
            row.verified_at ? new Date(row.verified_at) : undefined
        );
    }
}


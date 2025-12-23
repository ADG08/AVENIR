import { Account } from '../entities/Account';

export interface AccountRepository {
    create(account: Account): Promise<Account>;
    findById(id: string): Promise<Account | null>;
    findByUserId(userId: string): Promise<Account[]>;
    findByIban(iban: string): Promise<Account | null>;
    findByCardNumber(cardNumber: string): Promise<Account | null>;
    update(account: Account): Promise<Account>;
    delete(id: string): Promise<void>;
}

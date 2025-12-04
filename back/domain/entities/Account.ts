import { User } from "./User";
import { AccountType } from "../enum/Account/Type";
import { Transaction } from "./Transaction";
import { SavingRate } from "./SavingRate";

export class Account {
    public constructor(
        public readonly id: string,
        public readonly user: User,
        public readonly iban: string,
        public readonly name: string | null,
        public readonly type: AccountType,
        public readonly balance: number,
        public readonly savingRate: SavingRate | null,
        public readonly transactions: Array<Transaction> = [],
        
        public readonly createdAt: Date,
    ) {}
}   
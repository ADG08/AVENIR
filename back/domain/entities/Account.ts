import { AccountType } from "../enumerations/AccountType";
import { Transaction } from "./Transaction";
import { SavingRate } from "./SavingRate";

export class Account {
    constructor(
        readonly id: string,
        readonly userId: string,
        readonly iban: string,
        readonly name: string | null,
        readonly type: AccountType,
        readonly balance: number,
        readonly currency: string,
        readonly cardNumber: string | null,
        readonly cardHolderName: string | null,
        readonly cardExpiryDate: string | null,
        readonly cardCvv: string | null,
        readonly savingRate: SavingRate | null,
        readonly transactions: Transaction[] = [],
        readonly createdAt: Date,
    ) {}
}
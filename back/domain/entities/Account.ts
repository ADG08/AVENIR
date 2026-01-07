import { AccountType } from "@avenir/shared/enums/AccountType";
import { AccountStatus } from "@avenir/shared/enums/AccountStatus";
import { Transaction } from "./Transaction";
import { SavingType } from "@avenir/shared/enums/SavingType";


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
        readonly savingType: SavingType | null,
        readonly status: AccountStatus,
        readonly transactions: Transaction[] = [],
        readonly createdAt: Date,
    ) {}
}
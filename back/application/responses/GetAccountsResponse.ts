import { Account } from "../../domain/entities/Account";
import { SavingType, AccountStatus } from "@avenir/shared/enums";

export type GetAccountsResponse = {
    readonly id: string;
    readonly userId: string;
    readonly iban: string;
    readonly name: string | null;
    readonly type: string;
    readonly balance: number;
    readonly currency: string;
    readonly cardNumber: string | null;
    readonly cardHolderName: string | null;
    readonly cardExpiryDate: string | null;
    readonly savingType: SavingType | null;
    readonly status: AccountStatus;
    readonly createdAt: Date;
};

export class GetAccountsResponseMapper {
    static toResponse(account: Account): GetAccountsResponse {
        return {
            id: account.id,
            userId: account.userId,
            iban: account.iban,
            name: account.name,
            type: account.type,
            balance: account.balance,
            currency: account.currency,
            cardNumber: account.cardNumber,
            cardHolderName: account.cardHolderName,
            cardExpiryDate: account.cardExpiryDate,
            savingType: account.savingType,
            status: account.status,
            createdAt: account.createdAt,
        };
    }

    static toResponseList(accounts: Account[]): GetAccountsResponse[] {
        return accounts.map(account => this.toResponse(account));
    }
}

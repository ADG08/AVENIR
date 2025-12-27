import { Account } from "../../domain/entities/Account";
import { SavingType } from "@avenir/shared/enums/SavingType";

export interface AddAccountResponse {
    id: string;
    userId: string;
    iban: string;
    name: string | null;
    type: string;
    balance: number;
    savingType: SavingType | null;
    createdAt: Date;
}

export class AddAccountResponseMapper {
    static toResponse(account: Account): AddAccountResponse {
        return {
            id: account.id,
            userId: account.userId,
            iban: account.iban,
            name: account.name,
            type: account.type,
            balance: account.balance,
            savingType: account.savingType,
            createdAt: account.createdAt,
        };
    }
}


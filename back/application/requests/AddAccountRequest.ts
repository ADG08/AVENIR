import { AccountType } from "@avenir/shared/enums/AccountType";
import { SavingType } from "@avenir/shared/enums/SavingType";

export interface AddAccountRequest {
    userId: string;
    name?: string;
    type: AccountType;
    savingType?: SavingType;
}


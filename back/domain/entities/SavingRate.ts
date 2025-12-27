import { User } from "./User";
import { SavingType } from "@avenir/shared/enums/SavingType";

export class SavingRate {
    public constructor(
        public readonly id: string,
        public readonly savingType: SavingType,
        public readonly director: User,
        public readonly rate: number,
        public readonly createdAt: Date,
    ) {}
}
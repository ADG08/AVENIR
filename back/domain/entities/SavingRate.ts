import { SavingRateName } from "../enum/SavingRate/Name";
import { User } from "./User";

export class SavingRate {
    public constructor(
        public readonly id: string,
        public readonly name: SavingRateName,
        public readonly director: User,
        public readonly rate: number,
        public readonly createdAt: Date,
    ) {}
}
import { UserRole } from "../enum/User/Role";
import { UserState } from "../enum/User/State";
import { Account } from "./Account";
import { Loan } from "./Loan";
import { Order } from "./Order";

export class User {
    public constructor(
        public readonly id: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly identityNumber: string,
        public readonly passcode: string,
        public readonly role: UserRole,
        public readonly state: UserState,
        public readonly accounts: Array<Account> = [],
        public readonly loans: Array<Loan> = [],
        public readonly orders: Array<Order> = [],

        public readonly createdAt: Date,
    ) {}
}

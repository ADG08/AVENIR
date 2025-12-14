import { User } from "./User";

export class Message {
    constructor(
        readonly id: string,
        readonly chatId: string,
        readonly sender: User,
        readonly content: string,
        readonly isRead: boolean,
        readonly createdAt: Date,
    ) {}
}
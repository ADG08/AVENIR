import { Message } from "../../domain/entities/Message";

export class MessageResponse {
    constructor(
        readonly id: string,
        readonly chatId: string,
        readonly senderId: string,
        readonly senderName: string,
        readonly senderRole: string,
        readonly content: string,
        readonly isRead: boolean,
        readonly createdAt: Date,
    ) {}

    static fromMessage(message: Message): MessageResponse {
        return new MessageResponse(
            message.id,
            message.chatId,
            message.sender.id,
            `${message.sender.firstName} ${message.sender.lastName}`,
            message.sender.role,
            message.content,
            message.isRead,
            message.createdAt,
        );
    }
}

import { Chat } from "../../domain/entities/Chat";

export class ChatResponse {
    constructor(
        readonly id: string,
        readonly clientId: string,
        readonly clientName: string,
        readonly isMyClient: boolean,
        readonly advisorId: string | null,
        readonly advisorName: string | null,
        readonly status: string,
        readonly lastMessage: string | null,
        readonly lastMessageAt: Date | null,
        readonly unreadCount: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}

    static fromChat(chat: Chat, unreadCount: number = 0, isMyClient: boolean = false): ChatResponse {
        const lastMessage = chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1]
            : null;

        return new ChatResponse(
            chat.id,
            chat.client.id,
            `${chat.client.firstName} ${chat.client.lastName}`,
            isMyClient,
            chat.advisor?.id || null,
            chat.advisor ? `${chat.advisor.firstName} ${chat.advisor.lastName}` : null,
            chat.status,
            lastMessage?.content || null,
            lastMessage?.createdAt || null,
            unreadCount,
            chat.createdAt,
            chat.updatedAt,
        );
    }
}

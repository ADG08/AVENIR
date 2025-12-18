import { ChatRepository } from "@avenir/domain/repositories/ChatRepository";
import { UserRepository } from "@avenir/domain/repositories/UserRepository";
import { TransferChatRequest } from "../../requests";
import { ChatResponse } from "../../responses";
import { Chat } from "@avenir/domain/entities/Chat";
import { ChatNotFoundError, UserNotFoundError, UnauthorizedChatAccessError } from "@avenir/domain/errors";
import { UserRole } from "@avenir/domain/enumerations/UserRole";
import { ChatStatus } from "@avenir/domain/enumerations/ChatStatus";

export class TransferChatUseCase {
    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async execute(request: TransferChatRequest): Promise<ChatResponse> {
        const chat = await this.chatRepository.getById(request.chatId);
        if (!chat) {
            throw new ChatNotFoundError();
        }

        if (request.currentAdvisorId) {
            if (chat.advisor?.id !== request.currentAdvisorId) {
                throw new UnauthorizedChatAccessError();
            }
        }

        const newAdvisor = await this.userRepository.getById(request.newAdvisorId);
        if (!newAdvisor) {
            throw new UserNotFoundError(request.newAdvisorId);
        }

        if (newAdvisor.role !== UserRole.ADVISOR) {
            throw new Error("Target user must be an advisor");
        }

        const updatedChat = new Chat(
            chat.id,
            chat.client,
            newAdvisor,
            chat.advisor ? chat.status : ChatStatus.ACTIVE,
            chat.messages,
            chat.createdAt,
            new Date()
        );

        await this.chatRepository.update(updatedChat);

        return ChatResponse.fromChat(updatedChat);
    }
}

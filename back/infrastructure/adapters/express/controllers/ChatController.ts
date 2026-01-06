import { Request, Response } from 'express';

export class ChatController {
    constructor(
        private readonly createChatUseCase: any,
        private readonly getChatsUseCase: any,
        private readonly getChatByIdUseCase: any,
        private readonly getChatMessagesUseCase: any,
        private readonly markChatMessagesAsReadUseCase: any,
        private readonly transferChatUseCase: any,
        private readonly closeChatUseCase: any,
        private readonly chatRepository: any,
        private readonly messageRepository: any,
        private readonly userRepository: any
    ) {}
}

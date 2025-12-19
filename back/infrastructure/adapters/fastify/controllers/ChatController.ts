import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateChatUseCase } from '@avenir/application/usecases/chat/CreateChatUseCase';
import { GetChatsUseCase } from '@avenir/application/usecases/chat/GetChatsUseCase';
import { GetChatByIdUseCase } from '@avenir/application/usecases/chat/GetChatByIdUseCase';
import { GetChatMessagesUseCase } from '@avenir/application/usecases/chat/GetChatMessagesUseCase';
import { MarkChatMessagesAsReadUseCase } from '@avenir/application/usecases/chat/MarkChatMessagesAsReadUseCase';
import { TransferChatUseCase } from '@avenir/application/usecases/chat/TransferChatUseCase';
import { CloseChatUseCase } from '@avenir/application/usecases/chat/CloseChatUseCase';
import { CreateChatRequest } from '@avenir/application/requests';
import { GetChatsRequest } from '@avenir/application/requests';
import { TransferChatRequest } from '@avenir/application/requests';
import { ChatNotFoundError } from '@avenir/domain/errors';
import { UnauthorizedChatAccessError } from '@avenir/domain/errors';
import { ValidationError } from '@avenir/application/errors';
import { UserRole } from '@avenir/domain/enumerations/UserRole';
import { ChatRepository } from '@avenir/domain/repositories/ChatRepository';
import { webSocketService } from '../../services/WebSocketService';
import {
    createChatSchema,
    getChatsSchema,
    getChatByIdSchema,
    closeChatSchema,
} from '@avenir/shared/schemas/chat.schema';
import { ZodError } from 'zod';

export class ChatController {
    constructor(
        private readonly createChatUseCase: CreateChatUseCase,
        private readonly getChatsUseCase: GetChatsUseCase,
        private readonly getChatByIdUseCase: GetChatByIdUseCase,
        private readonly getChatMessagesUseCase: GetChatMessagesUseCase,
        private readonly markChatMessagesAsReadUseCase: MarkChatMessagesAsReadUseCase,
        private readonly transferChatUseCase: TransferChatUseCase,
        private readonly closeChatUseCase: CloseChatUseCase,
        private readonly chatRepository: ChatRepository
    ) {}

    async createChat(request: FastifyRequest<{ Body: CreateChatRequest }>, reply: FastifyReply) {
        try {
            const validatedData = createChatSchema.parse(request.body);
            const createChatRequest: CreateChatRequest = validatedData as CreateChatRequest;
            const response = await this.createChatUseCase.execute(createChatRequest);
            return reply.code(201).send(response);
        } catch (error) {
            if (error instanceof ZodError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
                });
            }

            if (error instanceof ValidationError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.message,
                });
            }

            return reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async getChats(request: FastifyRequest<{ Querystring: { userId: string; userRole: string } }>, reply: FastifyReply) {
        try {
            const validatedData = getChatsSchema.parse({
                userId: request.query.userId,
                userRole: request.query.userRole,
            });
            const getChatsRequest: GetChatsRequest = {
                userId: validatedData.userId,
                userRole: validatedData.userRole as UserRole,
            };

            const response = await this.getChatsUseCase.execute(getChatsRequest);
            return reply.code(200).send(response);
        } catch (error) {
            if (error instanceof ZodError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
                });
            }

            if (error instanceof ValidationError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.message,
                });
            }

            return reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async getChatById(
        request: FastifyRequest<{ Params: { chatId: string }; Querystring: { userId: string; userRole: string } }>,
        reply: FastifyReply
    ) {
        try {
            const validatedData = getChatByIdSchema.parse({
                chatId: request.params.chatId,
                userId: request.query.userId,
            });
            const response = await this.getChatByIdUseCase.execute({
                chatId: validatedData.chatId,
                userId: validatedData.userId,
                userRole: request.query.userRole as UserRole,
            });

            return reply.code(200).send(response);
        } catch (error) {
            if (error instanceof ChatNotFoundError) {
                return reply.code(404).send({
                    error: 'Chat not found',
                    message: error.message,
                });
            }

            if (error instanceof UnauthorizedChatAccessError) {
                return reply.code(403).send({
                    error: 'Forbidden',
                    message: error.message,
                });
            }

            if (error instanceof ValidationError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.message,
                });
            }

            return reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async getChatMessages(request: FastifyRequest<{ Params: { chatId: string }; Querystring: { userId: string } }>, reply: FastifyReply) {
        try {
            const { chatId } = request.params;
            const { userId } = request.query;

            const response = await this.getChatMessagesUseCase.execute(chatId, userId);
            return reply.code(200).send(response);
        } catch (error) {
            if (error instanceof ChatNotFoundError) {
                return reply.code(404).send({
                    error: 'Chat not found',
                    message: error.message,
                });
            }

            if (error instanceof ValidationError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.message,
                });
            }

            return reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async assignOrTransferChat(
        request: FastifyRequest<{
            Params: { chatId: string };
            Body: { advisorId: string; currentUserId?: string }
        }>,
        reply: FastifyReply
    ) {
        try {
            const transferChatRequest = new TransferChatRequest(
                request.params.chatId,
                request.body.currentUserId,
                request.body.advisorId
            );

            const response = await this.transferChatUseCase.execute(transferChatRequest);
            return reply.code(200).send(response);
        } catch (error) {
            if (error instanceof ChatNotFoundError) {
                return reply.code(404).send({
                    error: 'Chat not found',
                    message: error.message,
                });
            }

            if (error instanceof UnauthorizedChatAccessError) {
                return reply.code(403).send({
                    error: 'Unauthorized',
                    message: error.message,
                });
            }

            if (error instanceof ValidationError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.message,
                });
            }

            return reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async markChatMessagesAsRead(
        request: FastifyRequest<{ Params: { chatId: string }; Querystring: { userId: string } }>,
        reply: FastifyReply
    ) {
        try {
            await this.markChatMessagesAsReadUseCase.execute(
                request.params.chatId,
                request.query.userId
            );
            return reply.code(200).send({ success: true });
        } catch (error) {
            if (error instanceof ChatNotFoundError) {
                return reply.code(404).send({
                    error: 'Chat not found',
                    message: error.message,
                });
            }

            if (error instanceof ValidationError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.message,
                });
            }

            return reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async closeChat(
        request: FastifyRequest<{
            Params: { chatId: string };
            Body: { userId: string; userRole?: string }
        }>,
        reply: FastifyReply
    ) {
        try {
            const validatedData = closeChatSchema.parse({
                chatId: request.params.chatId,
                userId: request.body.userId,
                userRole: request.body.userRole || 'ADVISOR',
            });

            const chat = await this.chatRepository.getById(validatedData.chatId);

            if (!chat) {
                return reply.code(404).send({
                    error: 'Chat not found',
                    message: 'Chat not found',
                });
            }

            await this.closeChatUseCase.execute({
                chatId: validatedData.chatId,
                userId: validatedData.userId,
                userRole: validatedData.userRole,
            });

            const participantIds: string[] = [];
            if (chat.client?.id) {
                participantIds.push(chat.client.id);
            }
            if (chat.advisor?.id) {
                participantIds.push(chat.advisor.id);
            }
            webSocketService.notifyChatClosed(validatedData.chatId, participantIds);

            return reply.code(200).send({ success: true, message: 'Chat closed successfully' });
        } catch (error) {
            if (error instanceof ZodError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
                });
            }

            if (error instanceof ChatNotFoundError) {
                return reply.code(404).send({
                    error: 'Chat not found',
                    message: error.message,
                });
            }

            if (error instanceof UnauthorizedChatAccessError) {
                return reply.code(403).send({
                    error: 'Unauthorized',
                    message: error.message,
                });
            }

            if (error instanceof ValidationError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.message,
                });
            }

            return reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}

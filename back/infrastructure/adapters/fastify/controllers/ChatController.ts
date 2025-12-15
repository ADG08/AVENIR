import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateChatUseCase } from '@avenir/application/usecases/chat/CreateChatUseCase';
import { GetChatsUseCase } from '@avenir/application/usecases/chat/GetChatsUseCase';
import { GetChatByIdUseCase } from '@avenir/application/usecases/chat/GetChatByIdUseCase';
import { GetChatMessagesUseCase } from '@avenir/application/usecases/chat/GetChatMessagesUseCase';
import { MarkChatMessagesAsReadUseCase } from '@avenir/application/usecases/chat/MarkChatMessagesAsReadUseCase';
import { TransferChatUseCase } from '@avenir/application/usecases/chat/TransferChatUseCase';
import { CreateChatRequest } from '@avenir/application/requests';
import { GetChatsRequest } from '@avenir/application/requests';
import { TransferChatRequest } from '@avenir/application/requests';
import { ChatNotFoundError } from '@avenir/domain/errors';
import { UnauthorizedChatAccessError } from '@avenir/domain/errors';
import { ValidationError } from '@avenir/application/errors';
import { UserRole } from '@avenir/domain/enumerations/UserRole';

export class ChatController {
    constructor(
        private readonly createChatUseCase: CreateChatUseCase,
        private readonly getChatsUseCase: GetChatsUseCase,
        private readonly getChatByIdUseCase: GetChatByIdUseCase,
        private readonly getChatMessagesUseCase: GetChatMessagesUseCase,
        private readonly markChatMessagesAsReadUseCase: MarkChatMessagesAsReadUseCase,
        private readonly transferChatUseCase: TransferChatUseCase
    ) {}

    async createChat(request: FastifyRequest<{ Body: CreateChatRequest }>, reply: FastifyReply) {
        try {
            const createChatRequest: CreateChatRequest = request.body;
            const response = await this.createChatUseCase.execute(createChatRequest);
            return reply.code(201).send(response);
        } catch (error) {
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
            const getChatsRequest: GetChatsRequest = {
                userId: request.query.userId,
                userRole: request.query.userRole as UserRole,
            };

            const response = await this.getChatsUseCase.execute(getChatsRequest);
            return reply.code(200).send(response);
        } catch (error) {
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
            const response = await this.getChatByIdUseCase.execute({
                chatId: request.params.chatId,
                userId: request.query.userId,
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

    async transferChat(request: FastifyRequest<{ Body: TransferChatRequest }>, reply: FastifyReply) {
        try {
            const transferChatRequest: TransferChatRequest = request.body;
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
}

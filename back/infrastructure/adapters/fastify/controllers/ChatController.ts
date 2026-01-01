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
import { ChatRepository } from '@avenir/domain/repositories/ChatRepository';
import { MessageRepository } from '@avenir/domain/repositories/MessageRepository';
import { UserRepository } from '@avenir/domain/repositories/UserRepository';
import { webSocketService } from '../../services/WebSocketService';
import {
    createChatSchema,
    getChatByIdSchema,
    closeChatSchema, UserRole,
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
        private readonly chatRepository: ChatRepository,
        private readonly messageRepository: MessageRepository,
        private readonly userRepository: UserRepository
    ) {}

    async createChat(request: FastifyRequest<{ Body: { initialMessage: string } }>, reply: FastifyReply) {
        try {
            if (!request.user) {
                return reply.code(401).send({
                    error: 'Unauthorized',
                    message: 'User not authenticated',
                });
            }

            const validatedData = createChatSchema.parse(request.body);
            const createChatRequest = new CreateChatRequest(
                validatedData.initialMessage,
                request.user.userId
            );

            const response = await this.createChatUseCase.execute(createChatRequest);

            // Envoyer les notifications WebSocket après la création
            const connectedAdvisors = webSocketService.getConnectedAdvisors();
            const connectedDirectors = webSocketService.getConnectedDirectors();
            const recipientIds = [...connectedAdvisors, ...connectedDirectors];

            if (recipientIds.length > 0) {
                webSocketService.notifyChatCreated(
                    response.id,
                    recipientIds,
                    {
                        id: response.id,
                        clientId: response.clientId,
                        clientName: response.clientName,
                        advisorId: response.advisorId,
                        advisorName: response.advisorName,
                        status: response.status,
                        lastMessage: response.lastMessage,
                        lastMessageAt: response.lastMessageAt,
                        unreadCount: response.unreadCount,
                        createdAt: response.createdAt,
                        updatedAt: response.updatedAt,
                    }
                );
            } else {
                console.log('No advisors/directors connected to notify');
            }

            reply.code(201).send(response);
        } catch (error) {
            if (error instanceof ZodError) {
                reply.code(400).send({
                    error: 'Validation error',
                    message: error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
                });
                return;
            }

            if (error instanceof ValidationError) {
                reply.code(400).send({
                    error: 'Validation error',
                    message: error.message,
                });
                return;
            }

            reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async getChats(request: FastifyRequest, reply: FastifyReply) {
        try {
            if (!request.user) {
                return reply.code(401).send({
                    error: 'Unauthorized',
                    message: 'User not authenticated',
                });
            }

            const user = await this.userRepository.getById(request.user.userId);

            if (!user) {
                return reply.code(404).send({
                    error: 'User not found',
                    message: 'User not found',
                });
            }

            const getChatsRequest: GetChatsRequest = {
                userId: request.user.userId,
                userRole: user.role,
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
        request: FastifyRequest<{ Params: { chatId: string } }>,
        reply: FastifyReply
    ) {
        try {
            if (!request.user) {
                return reply.code(401).send({
                    error: 'Unauthorized',
                    message: 'User not authenticated',
                });
            }

            const validatedData = getChatByIdSchema.parse({
                chatId: request.params.chatId,
            });

            const user = await this.userRepository.getById(request.user.userId);

            if (!user) {
                return reply.code(404).send({
                    error: 'User not found',
                    message: 'User not found',
                });
            }

            const response = await this.getChatByIdUseCase.execute({
                chatId: validatedData.chatId,
                userId: request.user.userId,
                userRole: user.role,
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

    async getChatMessages(request: FastifyRequest<{ Params: { chatId: string } }>, reply: FastifyReply) {
        try {
            if (!request.user) {
                return reply.code(401).send({
                    error: 'Unauthorized',
                    message: 'User not authenticated',
                });
            }

            const { chatId } = request.params;
            const userId = request.user.userId;

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
            Body: { newAdvisorId?: string; advisorId?: string; currentUserId?: string }
        }>,
        reply: FastifyReply
    ) {
        try {
            if (!request.user) {
                return reply.code(401).send({
                    error: 'Unauthorized',
                    message: 'User not authenticated',
                });
            }

            const targetAdvisorId = request.body.newAdvisorId || request.body.advisorId;

            if (!targetAdvisorId) {
                return reply.code(400).send({
                    error: 'Bad Request',
                    message: 'newAdvisorId or advisorId is required',
                });
            }

            const chatBefore = await this.chatRepository.getById(request.params.chatId);
            const oldAdvisorId = chatBefore?.advisor?.id;
            const isTransfer = !!oldAdvisorId;

            const currentUser = await this.userRepository.getById(request.user.userId);

            if (!currentUser) {
                return reply.code(404).send({
                    error: 'User not found',
                    message: 'User not found',
                });
            }

            const currentAdvisorId = currentUser.role === UserRole.ADVISOR ? request.user.userId : undefined;

            const transferChatRequest = new TransferChatRequest(
                request.params.chatId,
                currentAdvisorId,
                targetAdvisorId
            );

            const response = await this.transferChatUseCase.execute(transferChatRequest);

            const chatAfter = await this.chatRepository.getById(request.params.chatId);

            if (chatAfter) {
                const participantIds: Set<string> = new Set();
                if (chatAfter.client?.id) {
                    participantIds.add(chatAfter.client.id);
                }
                if (oldAdvisorId && oldAdvisorId !== targetAdvisorId) {
                    participantIds.add(oldAdvisorId);
                }
                if (targetAdvisorId) {
                    participantIds.add(targetAdvisorId);
                }
                if (request.user.userId) {
                    participantIds.add(request.user.userId);
                }
                const connectedDirectors = webSocketService.getConnectedDirectors();
                connectedDirectors.forEach(directorId => {
                    participantIds.add(directorId);
                });

                const finalParticipantIds = Array.from(participantIds);

                if (isTransfer) {
                    const newAdvisor = chatAfter.advisor;
                    webSocketService.notifyChatTransferred(
                        request.params.chatId,
                        finalParticipantIds,
                        {
                            newAdvisorId: targetAdvisorId,
                            newAdvisorName: newAdvisor ? `${newAdvisor.firstName} ${newAdvisor.lastName}` : ''
                        }
                    );

                    const messages = await this.messageRepository.getByChatId(request.params.chatId);
                    if (messages && messages.length > 0) {
                        const lastMessage = messages[messages.length - 1];
                        if (lastMessage.type === 'SYSTEM') {
                            console.log('[ChatTransfer] Sending SYSTEM message notification');
                            webSocketService.notifyNewMessage(
                                request.params.chatId,
                                finalParticipantIds,
                                {
                                    id: lastMessage.id,
                                    chatId: lastMessage.chatId,
                                    senderId: lastMessage.sender.id,
                                    senderName: `${lastMessage.sender.firstName} ${lastMessage.sender.lastName}`,
                                    senderRole: lastMessage.sender.role,
                                    content: lastMessage.content,
                                    isRead: lastMessage.isRead,
                                    type: lastMessage.type,
                                    createdAt: lastMessage.createdAt.toISOString(),
                                }
                            );
                        }
                    }
                } else {
                    const clientId = chatAfter.client?.id || '';
                    webSocketService.notifyChatAssigned(
                        request.params.chatId,
                        clientId,
                        targetAdvisorId
                    );
                }
            }

            reply.code(200).send(response);
        } catch (error) {
            if (error instanceof ChatNotFoundError) {
                reply.code(404).send({
                    error: 'Chat not found',
                    message: error.message,
                });
                return;
            }

            if (error instanceof UnauthorizedChatAccessError) {
                reply.code(403).send({
                    error: 'Unauthorized',
                    message: error.message,
                });
                return;
            }

            if (error instanceof ValidationError) {
                reply.code(400).send({
                    error: 'Validation error',
                    message: error.message,
                });
                return;
            }

            reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async markChatMessagesAsRead(
        request: FastifyRequest<{ Params: { chatId: string } }>,
        reply: FastifyReply
    ) {
        try {
            if (!request.user) {
                return reply.code(401).send({
                    error: 'Unauthorized',
                    message: 'User not authenticated',
                });
            }

            const userId = request.user.userId;

            await this.markChatMessagesAsReadUseCase.execute(
                request.params.chatId,
                userId
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
        request: FastifyRequest<{ Params: { chatId: string } }>,
        reply: FastifyReply
    ) {
        try {
            if (!request.user) {
                return reply.code(401).send({
                    error: 'Unauthorized',
                    message: 'User not authenticated',
                });
            }

            const validatedData = closeChatSchema.parse({
                chatId: request.params.chatId,
            });

            const chat = await this.chatRepository.getById(validatedData.chatId);

            if (!chat) {
                reply.code(404).send({
                    error: 'Chat not found',
                    message: 'Chat not found',
                });
                return;
            }

            const user = await this.userRepository.getById(request.user.userId);

            if (!user) {
                reply.code(404).send({
                    error: 'User not found',
                    message: 'User not found',
                });
                return;
            }

            await this.closeChatUseCase.execute({
                chatId: validatedData.chatId,
                userId: request.user.userId,
                userRole: user.role,
            });

            const participantIds: string[] = [];
            if (chat.client?.id) {
                participantIds.push(chat.client.id);
            }
            if (chat.advisor?.id) {
                participantIds.push(chat.advisor.id);
            }
            webSocketService.notifyChatClosed(validatedData.chatId, participantIds);

            reply.code(200).send({ success: true, message: 'Chat closed successfully' });
        } catch (error) {
            if (error instanceof ZodError) {
                reply.code(400).send({
                    error: 'Validation error',
                    message: error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
                });
                return;
            }

            if (error instanceof ChatNotFoundError) {
                reply.code(404).send({
                    error: 'Chat not found',
                    message: error.message,
                });
                return;
            }

            if (error instanceof UnauthorizedChatAccessError) {
                reply.code(403).send({
                    error: 'Unauthorized',
                    message: error.message,
                });
                return;
            }

            if (error instanceof ValidationError) {
                reply.code(400).send({
                    error: 'Validation error',
                    message: error.message,
                });
                return;
            }

            reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}

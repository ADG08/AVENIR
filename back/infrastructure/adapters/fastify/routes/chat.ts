import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ChatController } from '../controllers/ChatController';
import { CreateChatRequest } from '@avenir/application/requests';
import { webSocketService } from '../../services/WebSocketService';
import { MessageRepository } from '@avenir/domain/repositories/MessageRepository';
import { ChatRepository } from '@avenir/domain/repositories/ChatRepository';

export async function chatRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions & {
        chatController: ChatController;
        messageRepository: MessageRepository;
        chatRepository: ChatRepository;
    }
) {
    const { chatController, messageRepository, chatRepository } = options;

    fastify.post(
        '/chats',
        async (request: FastifyRequest<{ Body: CreateChatRequest }>, reply: FastifyReply) => {
            return chatController.createChat(request, reply);
        }
    );

    fastify.get(
        '/chats',
        async (
            request: FastifyRequest<{ Querystring: { userId: string; userRole: string } }>,
            reply: FastifyReply
        ) => {
            return chatController.getChats(request, reply);
        }
    );

    fastify.get(
        '/chats/:chatId',
        async (
            request: FastifyRequest<{ Params: { chatId: string }; Querystring: { userId: string; userRole: string } }>,
            reply: FastifyReply
        ) => {
            return chatController.getChatById(request, reply);
        }
    );

    fastify.get(
        '/chats/:chatId/messages',
        async (
            request: FastifyRequest<{ Params: { chatId: string }; Querystring: { userId: string } }>,
            reply: FastifyReply
        ) => {
            return chatController.getChatMessages(request, reply);
        }
    );

    fastify.put(
        '/chats/:chatId/transfer',
        async (
            request: FastifyRequest<{
                Params: { chatId: string };
                Body: { newAdvisorId: string; currentUserId: string }
            }>,
            reply: FastifyReply
        ) => {
            try {
                const chatBefore = await chatRepository.getById(request.params.chatId);
                const oldAdvisorId = chatBefore?.advisor?.id;

                const transferChatRequest = {
                    params: { chatId: request.params.chatId },
                    body: {
                        advisorId: request.body.newAdvisorId,
                        currentUserId: request.body.currentUserId
                    }
                };

                let transferResponse: any;
                let transferError: any;
                const fakeReply = {
                    code: (statusCode: number) => ({
                        send: (response: any) => {
                            if (statusCode === 200) {
                                transferResponse = response;
                            } else {
                                transferError = { statusCode, response };
                            }
                            return response;
                        }
                    })
                } as any;

                try {
                    await chatController.assignOrTransferChat(transferChatRequest as any, fakeReply);
                } catch (controllerError) {
                    console.error('Controller threw an error:', controllerError);
                    return reply.code(500).send({
                        error: 'Internal server error',
                        message: controllerError instanceof Error ? controllerError.message : 'Unknown error'
                    });
                }

                if (transferError) {
                    return reply.code(transferError.statusCode).send(transferError.response);
                }

                if (!transferResponse) {
                    return reply.code(500).send({
                        error: 'Internal server error',
                        message: 'Transfer completed but no response received'
                    });
                }

                const chatAfter = await chatRepository.getById(request.params.chatId);

                if (chatAfter) {
                    const participantIds: Set<string> = new Set();

                    if (chatAfter.client?.id) {
                        participantIds.add(chatAfter.client.id);
                    }

                    if (oldAdvisorId) {
                        if (oldAdvisorId !== request.body.newAdvisorId) {
                            participantIds.add(oldAdvisorId);
                        }
                    } else {
                        console.log('No old advisor found');
                    }

                    if (request.body.newAdvisorId) {
                        participantIds.add(request.body.newAdvisorId);
                    }

                    if (request.body.currentUserId) {
                        participantIds.add(request.body.currentUserId);
                    }

                    const connectedDirectors = webSocketService.getConnectedDirectors();
                    for (const directorId of connectedDirectors) {
                        participantIds.add(directorId);
                    }

                    const finalParticipantIds = Array.from(participantIds);

                    const newAdvisor = chatAfter.advisor;
                    const payload = {
                        newAdvisorId: request.body.newAdvisorId,
                        newAdvisorName: newAdvisor ? `${newAdvisor.firstName} ${newAdvisor.lastName}` : ''
                    };

                    webSocketService.notifyChatTransferred(
                        request.params.chatId,
                        finalParticipantIds,
                        payload
                    );

                    const messages = await messageRepository.getByChatId(request.params.chatId);
                    if (messages.length > 0) {
                        const lastMessage = messages[messages.length - 1];
                        if (lastMessage.type === 'SYSTEM') {
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
                    } else {
                        console.log('No messages found after reloading from repository');
                    }
                }
                return reply.code(200).send(transferResponse);

            } catch (error) {
                return reply.code(500).send({
                    error: 'Internal server error',
                    message: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
    );

    fastify.put(
        '/chats/:chatId/assign',
        async (
            request: FastifyRequest<{
                Params: { chatId: string };
                Body: { advisorId: string }
            }>,
            reply: FastifyReply
        ) => {
            try {
                const chatBefore = await chatRepository.getById(request.params.chatId);
                const oldAdvisorId = chatBefore?.advisor?.id;
                const isTransfer = !!oldAdvisorId;

                const result = await chatController.assignOrTransferChat(
                    {
                        params: { chatId: request.params.chatId },
                        body: { advisorId: request.body.advisorId }
                    } as any,
                    reply
                );

                if (reply.statusCode === 200) {
                    const chatAfter = await chatRepository.getById(request.params.chatId);

                    if (isTransfer && chatAfter) {
                        const participantIds: Set<string> = new Set();
                        if (chatAfter.client?.id) {
                            participantIds.add(chatAfter.client.id);
                        }
                        if (oldAdvisorId && oldAdvisorId !== request.body.advisorId) {
                            participantIds.add(oldAdvisorId);
                        }
                        if (request.body.advisorId) {
                            participantIds.add(request.body.advisorId);
                        }

                        const connectedDirectors = webSocketService.getConnectedDirectors();
                        connectedDirectors.forEach(directorId => {
                            participantIds.add(directorId);
                        });

                        const finalParticipantIds = Array.from(participantIds);

                        // Envoyer notification de transfert
                        const newAdvisor = chatAfter.advisor;
                        webSocketService.notifyChatTransferred(
                            request.params.chatId,
                            finalParticipantIds,
                            {
                                newAdvisorId: request.body.advisorId,
                                newAdvisorName: newAdvisor ? `${newAdvisor.firstName} ${newAdvisor.lastName}` : ''
                            }
                        );

                        const messages = await messageRepository.getByChatId(request.params.chatId);

                        if (messages.length > 0) {
                            const lastMessage = messages[messages.length - 1];
                            if (lastMessage.type === 'SYSTEM') {
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
                        const clientId = chatAfter?.client?.id || '';
                        webSocketService.notifyChatAssigned(
                            request.params.chatId,
                            clientId,
                            request.body.advisorId
                        );
                    }
                }

                return result;
            } catch (error) {
                throw error;
            }
        }
    );

    fastify.put(
        '/chats/:chatId/messages/read',
        async (
            request: FastifyRequest<{ Params: { chatId: string }; Querystring: { userId: string } }>,
            reply: FastifyReply
        ) => {
            return chatController.markChatMessagesAsRead(request, reply);
        }
    );

    fastify.put(
        '/chats/:chatId/close',
        async (
            request: FastifyRequest<{
                Params: { chatId: string };
                Body: { userId: string; userRole?: string }
            }>,
            reply: FastifyReply
        ) => {
            const result = await chatController.closeChat(request, reply);

            if (reply.statusCode === 200) {
                webSocketService.notifyChatClosed(request.params.chatId, [request.body.userId]);
            }

            return result;
        }
    );
}


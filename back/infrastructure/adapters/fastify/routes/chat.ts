import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ChatController } from '../controllers/ChatController';
import { CloseChatUseCase } from '@avenir/application/usecases/chat/CloseChatUseCase';
import { CreateChatRequest } from '@avenir/application/requests';
import { ChatNotFoundError, UnauthorizedChatAccessError } from '@avenir/domain/errors';
import { ValidationError } from '@avenir/application/errors';
import { webSocketService } from '../../services/WebSocketService';

export async function chatRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions & {
        chatController: ChatController;
        closeChatUseCase: CloseChatUseCase;
    }
) {
    const { chatController, closeChatUseCase } = options;

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
            const result = await chatController.assignOrTransferChat(
                {
                    params: { chatId: request.params.chatId },
                    body: {
                        advisorId: request.body.newAdvisorId,
                        currentUserId: request.body.currentUserId
                    }
                } as any,
                reply
            );

            if (reply.statusCode === 200) {
                webSocketService.notifyChatTransferred(
                    request.params.chatId,
                    [request.body.currentUserId],
                    request.body.newAdvisorId
                );
            }

            return result;
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
            const result = await chatController.assignOrTransferChat(
                {
                    params: { chatId: request.params.chatId },
                    body: { advisorId: request.body.advisorId }
                } as any,
                reply
            );

            if (reply.statusCode === 200) {
                webSocketService.notifyChatAssigned(
                    request.params.chatId,
                    '',
                    request.body.advisorId
                );
            }

            return result;
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
            request: FastifyRequest<{ Params: { chatId: string }; Querystring: { userId: string; userRole: string } }>,
            reply: FastifyReply
        ) => {
            try {
                await closeChatUseCase.execute({
                    chatId: request.params.chatId,
                    userId: request.query.userId,
                    userRole: request.query.userRole,
                });

                // Notifier via WebSocket
                webSocketService.notifyChatClosed(request.params.chatId, [request.query.userId]);

                return reply.code(200).send({ success: true, message: 'Chat closed successfully' });
            } catch (error) {
                if (error instanceof ChatNotFoundError) {
                    return reply.code(404).send({ error: 'Chat not found', message: (error as Error).message });
                }
                if (error instanceof UnauthorizedChatAccessError) {
                    return reply.code(403).send({ error: 'Unauthorized', message: (error as Error).message });
                }
                if (error instanceof ValidationError) {
                    return reply.code(400).send({ error: 'Validation error', message: (error as Error).message });
                }
                return reply.code(500).send({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
            }
        }
    );
}


import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ChatController } from '../controllers/ChatController';
import { CreateChatRequest } from '@avenir/application/requests';
import { webSocketService } from '../../services/WebSocketService';

export async function chatRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions & {
        chatController: ChatController;
    }
) {
    const { chatController } = options;

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


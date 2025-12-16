import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ChatController } from '../controllers/ChatController';
import { CloseChatUseCase } from '@avenir/application/usecases/chat/CloseChatUseCase';
import { AssignAdvisorUseCase } from '@avenir/application/usecases/chat/AssignAdvisorUseCase';
import { CreateChatRequest } from '@avenir/application/requests';
import { TransferChatRequest } from '@avenir/application/requests';
import { ChatNotFoundError, UnauthorizedChatAccessError } from '@avenir/domain/errors';
import { ValidationError } from '@avenir/application/errors';
import { webSocketService } from '../../services/WebSocketService';

export async function chatRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions & {
        chatController: ChatController;
        closeChatUseCase: CloseChatUseCase;
        assignAdvisorUseCase: AssignAdvisorUseCase;
    }
) {
    const { chatController, closeChatUseCase, assignAdvisorUseCase } = options;

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

    fastify.post(
        '/chats/transfer',
        async (request: FastifyRequest<{ Body: TransferChatRequest }>, reply: FastifyReply) => {
            return chatController.transferChat(request, reply);
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

    fastify.post(
        '/chats/assign',
        async (request: FastifyRequest<{ Body: { chatId: string; advisorId: string } }>, reply: FastifyReply) => {
            try {
                await assignAdvisorUseCase.execute({
                    chatId: request.body.chatId,
                    advisorId: request.body.advisorId,
                });

                // Notifier via WebSocket
                webSocketService.notifyChatAssigned(request.body.chatId, '', request.body.advisorId);

                return reply.code(200).send({ success: true, message: 'Advisor assigned successfully' });
            } catch (error) {
                if (error instanceof ChatNotFoundError) {
                    return reply.code(404).send({ error: 'Chat not found', message: (error as Error).message });
                }
                if (error instanceof ValidationError) {
                    return reply.code(400).send({ error: 'Validation error', message: (error as Error).message });
                }
                return reply.code(500).send({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
            }
        }
    );
}


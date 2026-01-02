import {FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest} from 'fastify';
import { ChatController } from '../controllers/ChatController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function chatRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions & {
        chatController: ChatController;
    }
) {
    const { chatController } = options;

    fastify.post(
        '/chats',
        { preHandler: authMiddleware },
        async (request: FastifyRequest, reply: FastifyReply) => {
            return chatController.createChat(request as any, reply);
        }
    );

    fastify.get(
        '/chats',
        { preHandler: authMiddleware },
        async (request: FastifyRequest, reply: FastifyReply) => {
            return chatController.getChats(request as any, reply);
        }
    );

    fastify.get(
        '/chats/:chatId',
        { preHandler: authMiddleware },
        async (request, reply) => {
            return chatController.getChatById(request as any, reply);
        }
    );

    fastify.get(
        '/chats/:chatId/messages',
        { preHandler: authMiddleware },
        async (request, reply) => {
            return chatController.getChatMessages(request as any, reply);
        }
    );

    fastify.put(
        '/chats/:chatId/transfer',
        { preHandler: authMiddleware },
        async (request, reply) => {
            return chatController.assignOrTransferChat(request as any, reply);
        }
    );

    fastify.put(
        '/chats/:chatId/assign',
        { preHandler: authMiddleware },
        async (request, reply) => {
            return chatController.assignOrTransferChat(request as any, reply);
        }
    );

    fastify.put(
        '/chats/:chatId/messages/read',
        { preHandler: authMiddleware },
        async (request, reply) => {
            return chatController.markChatMessagesAsRead(request as any, reply);
        }
    );

    fastify.put(
        '/chats/:chatId/close',
        { preHandler: authMiddleware },
        async (request, reply) => {
            return chatController.closeChat(request as any, reply);
        }
    );
}

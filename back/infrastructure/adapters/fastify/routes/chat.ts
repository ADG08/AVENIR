import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ChatController } from '../controllers/ChatController';
import { CreateChatRequest } from '@avenir/application/requests';
import { TransferChatRequest } from '@avenir/application/requests';

export async function chatRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions & { chatController: ChatController }
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
}


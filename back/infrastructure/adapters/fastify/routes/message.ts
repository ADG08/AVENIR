import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { MessageController } from '../controllers/MessageController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function messageRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions & { messageController: MessageController }
) {
    const { messageController } = options;

    fastify.post(
        '/messages',
        { preHandler: authMiddleware },
        async (request, reply) => {
            return messageController.sendMessage(request as any, reply);
        }
    );

    fastify.put(
        '/messages/:messageId/read',
        { preHandler: authMiddleware },
        async (request, reply) => {
            return messageController.markAsRead(request as any, reply);
        }
    );
}

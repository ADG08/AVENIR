import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { NotificationController } from '../controllers/NotificationController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function notificationRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions & {
    notificationController: NotificationController;
  }
) {
  const { notificationController } = options;

  fastify.get(
    '/notifications',
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return notificationController.getNotifications(request, reply);
    }
  );

  fastify.put<{ Params: { notificationId: string } }>(
    '/notifications/:notificationId/read',
    { preHandler: authMiddleware },
    async (request, reply) => {
      return notificationController.markAsRead(request, reply);
    }
  );

  fastify.put(
    '/notifications/mark-all-read',
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return notificationController.markAllAsRead(request, reply);
    }
  );

  fastify.delete<{ Params: { notificationId: string } }>(
    '/notifications/:notificationId',
    { preHandler: authMiddleware },
    async (request, reply) => {
      return notificationController.deleteNotification(request, reply);
    }
  );
}

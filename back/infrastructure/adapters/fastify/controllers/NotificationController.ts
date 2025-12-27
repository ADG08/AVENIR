import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateNotificationUseCase } from '@avenir/application/usecases/notification/CreateNotificationUseCase';
import { GetNotificationsUseCase } from '@avenir/application/usecases/notification/GetNotificationsUseCase';
import { MarkNotificationAsReadUseCase } from '@avenir/application/usecases/notification/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '@avenir/application/usecases/notification/MarkAllNotificationsAsReadUseCase';
import { DeleteNotificationUseCase } from '@avenir/application/usecases/notification/DeleteNotificationUseCase';

export class NotificationController {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly markAllNotificationsAsReadUseCase: MarkAllNotificationsAsReadUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase
  ) {}

  async getNotifications(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const notifications = await this.getNotificationsUseCase.execute(
        request.user.userId
      );

      return reply.code(200).send(notifications);
    } catch (error) {
      console.error('Error getting notifications:', error);
      return reply.code(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async markAsRead(
    request: FastifyRequest<{ Params: { notificationId: string } }>,
    reply: FastifyReply
  ) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      await this.markNotificationAsReadUseCase.execute(
        request.params.notificationId
      );

      return reply.code(200).send({ success: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return reply.code(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async markAllAsRead(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      await this.markAllNotificationsAsReadUseCase.execute(request.user.userId);

      return reply.code(200).send({ success: true });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return reply.code(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deleteNotification(
    request: FastifyRequest<{ Params: { notificationId: string } }>,
    reply: FastifyReply
  ) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      await this.deleteNotificationUseCase.execute(request.params.notificationId);

      return reply.code(204).send();
    } catch (error) {
      console.error('Error deleting notification:', error);
      return reply.code(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

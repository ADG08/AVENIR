import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateNotificationUseCase } from '@avenir/application/usecases/notification/CreateNotificationUseCase';
import { GetNotificationsUseCase } from '@avenir/application/usecases/notification/GetNotificationsUseCase';
import { MarkNotificationAsReadUseCase } from '@avenir/application/usecases/notification/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '@avenir/application/usecases/notification/MarkAllNotificationsAsReadUseCase';
import { DeleteNotificationUseCase } from '@avenir/application/usecases/notification/DeleteNotificationUseCase';
import { NotificationResponse } from '@avenir/application/responses/NotificationResponse';
import { sendNotificationSchema } from '@avenir/shared/schemas/notification.schema';
import { z } from 'zod';

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

      const notificationsResponse = NotificationResponse.fromNotifications(notifications);

      return reply.code(200).send(notificationsResponse);
    } catch (error) {
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
      return reply.code(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async createCustomNotification(
    request: FastifyRequest<{
      Body: {
        userId: string;
        title: string;
        message: string;
        type: string;
        advisorName?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const { title, message, type } = sendNotificationSchema.parse(request.body);
      const { userId, advisorName } = request.body;

      const notification = await this.createNotificationUseCase.execute(
        userId,
        title,
        message,
        type as any,
        advisorName || null,
        null
      );

      const notificationResponse = NotificationResponse.fromNotification(notification);

      // La notification SSE est gérée dans CreateNotificationUseCase

      return reply.code(201).send(notificationResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation error',
          message: error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
        });
      }

      return reply.code(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

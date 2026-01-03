import { Notification } from '@avenir/domain/entities/Notification';
import { NotificationRepository } from '@avenir/domain/repositories/NotificationRepository';
import { NotificationType } from '@avenir/shared/enums';
import { randomUUID } from 'crypto';
import { SSEService } from '@avenir/infrastructure/adapters/services/SSEService';
import { NotificationResponse } from '../../responses/NotificationResponse';

export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly sseService: SSEService
  ) {}

  async execute(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    advisorName: string | null = null,
    newsId: string | null = null
  ): Promise<Notification> {
    const notification = new Notification(
      randomUUID(),
      userId,
      title,
      message,
      type,
      advisorName,
      false,
      new Date(),
      newsId
    );

    const createdNotification = await this.notificationRepository.addNotification(notification);

    const notificationResponse = NotificationResponse.fromNotification(createdNotification);
    this.sseService.notifyNotificationCreated(userId, notificationResponse.toWebSocketPayload());

    return createdNotification;
  }
}

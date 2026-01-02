import { Notification } from '@avenir/domain/entities/Notification';
import { NotificationRepository } from '@avenir/domain/repositories/NotificationRepository';
import { NotificationType } from '@avenir/shared/enums';
import { randomUUID } from 'crypto';

export class CreateNotificationUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

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

    return await this.notificationRepository.addNotification(notification);
  }
}

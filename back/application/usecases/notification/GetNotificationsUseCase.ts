import { Notification } from '@avenir/domain/entities/Notification';
import { NotificationRepository } from '@avenir/domain/repositories/NotificationRepository';

export class GetNotificationsUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.getNotificationsByUserId(userId);
  }
}

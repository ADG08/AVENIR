import { NotificationRepository } from '@avenir/domain/repositories/NotificationRepository';

export class DeleteNotificationUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(notificationId: string): Promise<void> {
    await this.notificationRepository.deleteNotification(notificationId);
  }
}

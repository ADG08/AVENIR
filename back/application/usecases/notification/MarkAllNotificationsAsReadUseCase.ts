import { NotificationRepository } from '@avenir/domain/repositories/NotificationRepository';

export class MarkAllNotificationsAsReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(userId: string): Promise<void> {
    await this.notificationRepository.markAllNotificationsAsRead(userId);
  }
}

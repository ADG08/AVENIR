import { Notification } from '@avenir/domain/entities/Notification';
import { NotificationType } from '@avenir/shared/enums';

export class NotificationResponse {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  advisorName: string | null;
  read: boolean;
  createdAt: Date;
  newsId: string | null;

  constructor(notification: Notification) {
    this.id = notification.id;
    this.userId = notification.userId;
    this.title = notification.title;
    this.message = notification.message;
    this.type = notification.type;
    this.advisorName = notification.advisorName;
    this.read = notification.isRead;
    this.createdAt = notification.createdAt;
    this.newsId = notification.newsId || null;
  }

  static fromNotification(notification: Notification): NotificationResponse {
    return new NotificationResponse(notification);
  }

  static fromNotifications(notifications: Notification[]): NotificationResponse[] {
    return notifications.map(notification => new NotificationResponse(notification));
  }

  toWebSocketPayload() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      message: this.message,
      type: this.type,
      advisorName: this.advisorName,
      read: this.read,
      createdAt: this.createdAt.toISOString(),
      newsId: this.newsId,
    };
  }
}

import { Notification } from '@avenir/domain/entities/Notification';
import { NotificationRepository } from '@avenir/domain/repositories/NotificationRepository';
import { NotificationType } from '@avenir/shared/enums';

export class MySQLNotificationRepository implements NotificationRepository {
  constructor(private readonly db: any) {}

  async addNotification(notification: Notification): Promise<Notification> {
    const query = `
      INSERT INTO notifications (id, user_id, title, message, type, advisor_name, \`read\`, created_at, news_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      notification.id,
      notification.userId,
      notification.title,
      notification.message,
      notification.type,
      notification.advisorName,
      notification.isRead,
      notification.createdAt,
      notification.newsId ?? null,
    ];

    await this.db.query(query, values);

    return notification;
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await this.db.query(query, [userId]);

    return rows.map(
      (row: any) =>
        new Notification(
          row.id,
          row.user_id,
          row.title,
          row.message,
          row.type as NotificationType,
          row.advisor_name,
          row.read,
          new Date(row.created_at),
          row.news_id
        )
    );
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const query = `
      UPDATE notifications
      SET \`read\` = true
      WHERE id = ?
    `;

    await this.db.query(query, [notificationId]);
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const query = `
      UPDATE notifications
      SET \`read\` = true
      WHERE user_id = ?
    `;

    await this.db.query(query, [userId]);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const query = `
      DELETE FROM notifications
      WHERE id = ?
    `;

    await this.db.query(query, [notificationId]);
  }
}

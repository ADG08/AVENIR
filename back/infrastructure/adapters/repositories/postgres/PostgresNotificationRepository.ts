import { Notification } from '@avenir/domain/entities/Notification';
import { NotificationRepository } from '@avenir/domain/repositories/NotificationRepository';
import { NotificationType } from '@avenir/shared/enums';

export class PostgresNotificationRepository implements NotificationRepository {
  constructor(private readonly db: any) {}

  async addNotification(notification: Notification): Promise<Notification> {
    const query = `
      INSERT INTO notifications (id, user_id, title, message, type, advisor_name, read, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      notification.id,
      notification.userId,
      notification.title,
      notification.message,
      notification.type,
      notification.advisorName,
      notification.read,
      notification.createdAt,
    ];

    const result = await this.db.query(query, values);
    const row = result.rows[0];

    return new Notification(
      row.id,
      row.user_id,
      row.title,
      row.message,
      row.type as NotificationType,
      row.advisor_name,
      row.read,
      new Date(row.created_at)
    );
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await this.db.query(query, [userId]);

    return result.rows.map(
      (row: any) =>
        new Notification(
          row.id,
          row.user_id,
          row.title,
          row.message,
          row.type as NotificationType,
          row.advisor_name,
          row.read,
          new Date(row.created_at)
        )
    );
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const query = `
      UPDATE notifications
      SET read = true
      WHERE id = $1
    `;

    await this.db.query(query, [notificationId]);
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const query = `
      UPDATE notifications
      SET read = true
      WHERE user_id = $1
    `;

    await this.db.query(query, [userId]);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const query = `
      DELETE FROM notifications
      WHERE id = $1
    `;

    await this.db.query(query, [notificationId]);
  }
}


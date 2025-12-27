import { Notification } from '@/types/notification';
import { NotificationType } from '@avenir/shared/enums';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface NotificationResponse {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  advisorName: string | null;
  read: boolean;
  createdAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await fetch(`${API_URL}/api/notifications`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Failed to fetch notifications');
  }

  const notificationsData: NotificationResponse[] = await response.json();

  return notificationsData.map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    advisorName: notification.advisorName ?? undefined,
    read: notification.read,
    createdAt: new Date(notification.createdAt),
  }));
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
    method: 'PUT',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Failed to mark notification as read');
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/api/notifications/mark-all-read`, {
    method: 'PUT',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Failed to mark all notifications as read');
  }
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/notifications/${notificationId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Failed to delete notification');
  }
};

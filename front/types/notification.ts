import { NotificationType } from '@avenir/shared/enums';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
  advisorName?: string | null;
  newsId?: string | null;
}

import { NotificationType } from '@avenir/shared/enums';

export class Notification {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly message: string,
    public readonly type: NotificationType,
    public readonly advisorName: string | null,
    public readonly read: boolean,
    public readonly createdAt: Date
  ) {}
}

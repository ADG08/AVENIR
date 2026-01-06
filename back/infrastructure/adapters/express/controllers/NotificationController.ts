import { Request, Response } from 'express';

export class NotificationController {
    constructor(
        private readonly createNotificationUseCase: any,
        private readonly getNotificationsUseCase: any,
        private readonly markNotificationAsReadUseCase: any,
        private readonly markAllNotificationsAsReadUseCase: any,
        private readonly deleteNotificationUseCase: any
    ) {}
}

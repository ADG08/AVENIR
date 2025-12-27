import { NewsRepository } from '@avenir/domain/repositories/NewsRepository';
import { UserRepository } from '@avenir/domain/repositories/UserRepository';
import { NotificationRepository } from '@avenir/domain/repositories/NotificationRepository';
import { CreateNewsRequest } from '../../requests/CreateNewsRequest';
import { NewsResponse } from '../../responses/NewsResponse';
import { News } from '@avenir/domain/entities/News';
import { Notification } from '@avenir/domain/entities/Notification';
import { UserRole, NotificationType } from '@avenir/shared/enums';
import { UserNotFoundError } from '@avenir/domain/errors';
import { ValidationError } from '../../errors';
import { randomUUID } from 'crypto';

export class CreateNewsUseCase {
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(request: CreateNewsRequest): Promise<NewsResponse> {
    const user = await this.userRepository.getById(request.authorId);

    if (!user) {
      throw new UserNotFoundError(`User with id ${request.authorId} not found`);
    }

    if (user.role !== UserRole.ADVISOR) {
      throw new ValidationError('Only advisors can create news');
    }

    const newsId = randomUUID();
    const now = new Date();
    const authorName = `${user.firstName} ${user.lastName}`;

    const news = new News(
      newsId,
      request.title,
      request.description,
      request.authorId,
      authorName,
      now,
      now
    );

    const createdNews = await this.newsRepository.addNews(news);

    const allUsers = await this.userRepository.getAll();
    const clients = allUsers.filter((u) => u.role === UserRole.CLIENT);

    const notificationPromises = clients.map((client) => {
      const notification = new Notification(
          randomUUID(),
          client.id,
          'Nouvelle actualité',
          request.title,
          NotificationType.INFO,
          authorName,
          false,
          now
      );
      return this.notificationRepository.addNotification(notification);
    });

    await Promise.all(notificationPromises);

    return NewsResponse.fromNews(createdNews);
  }
}

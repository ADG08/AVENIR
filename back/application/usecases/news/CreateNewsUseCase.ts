import { NewsRepository } from '@avenir/domain/repositories/NewsRepository';
import { UserRepository } from '@avenir/domain/repositories/UserRepository';
import { CreateNewsRequest } from '../../requests/CreateNewsRequest';
import { NewsResponse } from '../../responses/NewsResponse';
import { News } from '@avenir/domain/entities/News';
import { UserRole } from '@avenir/shared/enums';
import { UserNotFoundError } from '@avenir/domain/errors';
import { ValidationError } from '../../errors';
import { randomUUID } from 'crypto';

export class CreateNewsUseCase {
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly userRepository: UserRepository
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
    return NewsResponse.fromNews(createdNews);
  }
}

import { NewsRepository } from '@avenir/domain/repositories/NewsRepository';
import { UserRepository } from '@avenir/domain/repositories/UserRepository';
import { DeleteNewsRequest } from '../../requests/DeleteNewsRequest';
import { UserRole } from '@avenir/domain/enumerations/UserRole';
import {NewsNotFoundError, UnauthorizedNewsAccessError, UserNotFoundError} from "../../../domain/errors";

export class DeleteNewsUseCase {
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(request: DeleteNewsRequest): Promise<void> {
    const news = await this.newsRepository.getNewsById(request.newsId);
    if (!news) {
      throw new NewsNotFoundError(request.newsId);
    }

    const user = await this.userRepository.getById(request.userId);
    if (!user) {
      throw new UserNotFoundError(request.userId);
    }

    if (user.role !== UserRole.ADVISOR) {
      throw new UnauthorizedNewsAccessError();
    }

    await this.newsRepository.removeNews(request.newsId);
  }
}

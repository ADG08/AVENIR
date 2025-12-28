import { NewsRepository } from '@avenir/domain/repositories/NewsRepository';
import { GetNewsByIdRequest } from '../../requests/GetNewsByIdRequest';
import { NewsResponse } from '../../responses/NewsResponse';
import { NewsNotFoundError } from '@avenir/domain/errors';

export class GetNewsByIdUseCase {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(request: GetNewsByIdRequest): Promise<NewsResponse> {
    const news = await this.newsRepository.getNewsById(request.newsId);

    if (!news) {
      throw new NewsNotFoundError(request.newsId);
    }

    return NewsResponse.fromNews(news);
  }
}

import { NewsRepository } from '@avenir/domain/repositories/NewsRepository';
import { GetAllNewsRequest } from '../../requests/GetAllNewsRequest';
import { NewsResponse } from '../../responses/NewsResponse';

export class GetAllNewsUseCase {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(request: GetAllNewsRequest): Promise<NewsResponse[]> {
    const newsList = await this.newsRepository.getAllNewsOrderedByDate();

    if (request.limit !== undefined || request.offset !== undefined) {
      const offset = request.offset || 0;
      const limit = request.limit || newsList.length;
      const paginatedNews = newsList.slice(offset, offset + limit);
      return NewsResponse.fromNewsList(paginatedNews);
    }

    return NewsResponse.fromNewsList(newsList);
  }
}

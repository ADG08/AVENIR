import { NewsRepository } from '@avenir/domain/repositories/NewsRepository';
import { GetAllNewsRequest } from '../../requests/GetAllNewsRequest';
import { NewsResponse } from '../../responses/NewsResponse';

export class GetAllNewsUseCase {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(request: GetAllNewsRequest): Promise<NewsResponse[]> {
    const newsList = await this.newsRepository.getAllNewsOrderedByDate();

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentNews = newsList.filter(news => news.createdAt >= threeMonthsAgo);

    if (request.limit !== undefined || request.offset !== undefined) {
      const offset = request.offset || 0;
      const limit = request.limit || recentNews.length;
      const paginatedNews = recentNews.slice(offset, offset + limit);
      return NewsResponse.fromNewsList(paginatedNews);
    }

    return NewsResponse.fromNewsList(recentNews);
  }
}

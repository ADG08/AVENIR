import { News } from '@avenir/domain/entities/News';

export class NewsResponse {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly authorId: string,
    public readonly authorName: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static fromNews(news: News): NewsResponse {
    return new NewsResponse(
      news.id,
      news.title,
      news.description,
      news.authorId,
      news.authorName,
      news.createdAt,
      news.updatedAt
    );
  }

  static fromNewsList(newsList: News[]): NewsResponse[] {
    return newsList.map((news) => NewsResponse.fromNews(news));
  }

  toApiDto() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      authorId: this.authorId,
      authorName: this.authorName,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

import { News } from "../entities/News";

export interface NewsRepository {
  getNewsById(id: string): Promise<News | null>;
  getAllNews(): Promise<News[]>;
  getAllNewsOrderedByDate(): Promise<News[]>;
  getNewsByAuthorId(authorId: string): Promise<News[]>;
  addNews(news: News): Promise<News>;
  updateNews(news: News): Promise<void>;
  removeNews(id: string): Promise<void>;
}

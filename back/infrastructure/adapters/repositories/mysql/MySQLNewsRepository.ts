import { Pool as MySQLPool } from 'mysql2/promise';
import { News } from '../../../../domain/entities/News';
import { NewsRepository } from '../../../../domain/repositories/NewsRepository';

export class MySQLNewsRepository implements NewsRepository {
  constructor(private pool: MySQLPool) {}

  async addNews(news: News): Promise<News> {
    const insertQuery = `
      INSERT INTO news (id, title, description, author_id, author_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await this.pool.execute(insertQuery, [
        news.id,
        news.title,
        news.description,
        news.authorId,
        news.authorName,
        news.createdAt,
        news.updatedAt,
      ]);
      return news;
    } catch (error) {
      console.error('Erreur MySQL:', error);
      throw error;
    }
  }

  async removeNews(id: string): Promise<void> {
    try {
      await this.pool.execute('DELETE FROM news WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erreur MySQL:', error);
      throw error;
    }
  }

  async updateNews(news: News): Promise<void> {
    const query = `
      UPDATE news
      SET title = ?, description = ?, author_id = ?, author_name = ?, updated_at = ?
      WHERE id = ?
    `;

    try {
      await this.pool.execute(query, [
        news.title,
        news.description,
        news.authorId,
        news.authorName,
        new Date(),
        news.id,
      ]);
    } catch (error) {
      console.error('Erreur MySQL:', error);
      throw error;
    }
  }

  async getNewsById(id: string): Promise<News | null> {
    try {
      const [rows] = await this.pool.execute<any[]>(
        'SELECT * FROM news WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return new News(
        row.id,
        row.title,
        row.description,
        row.author_id,
        row.author_name,
        new Date(row.created_at),
        new Date(row.updated_at)
      );
    } catch (error) {
      console.error('Erreur MySQL:', error);
      throw error;
    }
  }

  async getAllNews(): Promise<News[]> {
    try {
      const [rows] = await this.pool.execute<any[]>('SELECT * FROM news');

      return rows.map(
        (row) =>
          new News(
            row.id,
            row.title,
            row.description,
            row.author_id,
            row.author_name,
            new Date(row.created_at),
            new Date(row.updated_at)
          )
      );
    } catch (error) {
      console.error('Erreur MySQL:', error);
      throw error;
    }
  }

  async getAllNewsOrderedByDate(): Promise<News[]> {
    try {
      const [rows] = await this.pool.execute<any[]>(
        'SELECT * FROM news ORDER BY created_at DESC'
      );

      return rows.map(
        (row) =>
          new News(
            row.id,
            row.title,
            row.description,
            row.author_id,
            row.author_name,
            new Date(row.created_at),
            new Date(row.updated_at)
          )
      );
    } catch (error) {
      console.error('Erreur MySQL:', error);
      throw error;
    }
  }

  async getNewsByAuthorId(authorId: string): Promise<News[]> {
    try {
      const [rows] = await this.pool.execute<any[]>(
        'SELECT * FROM news WHERE author_id = ? ORDER BY created_at DESC',
        [authorId]
      );

      return rows.map(
        (row) =>
          new News(
            row.id,
            row.title,
            row.description,
            row.author_id,
            row.author_name,
            new Date(row.created_at),
            new Date(row.updated_at)
          )
      );
    } catch (error) {
      console.error('Erreur MySQL:', error);
      throw error;
    }
  }
}

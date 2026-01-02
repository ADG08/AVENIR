import { Pool } from 'pg';
import { News } from '../../../../domain/entities/News';
import { NewsRepository } from '../../../../domain/repositories/NewsRepository';

export class PostgresNewsRepository implements NewsRepository {
  constructor(private pool: Pool) {}

  async addNews(news: News): Promise<News> {
    const insertQuery = `
      INSERT INTO news (id, title, description, author_id, author_name, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    try {
      await this.pool.query(insertQuery, [
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
      console.error('Erreur PostgreSQL:', error);
      throw error;
    }
  }

  async removeNews(id: string): Promise<void> {
    try {
      await this.pool.query('DELETE FROM news WHERE id = $1', [id]);
    } catch (error) {
      console.error('Erreur PostgreSQL:', error);
      throw error;
    }
  }

  async updateNews(news: News): Promise<void> {
    const query = `
      UPDATE news
      SET title = $1, description = $2, author_id = $3, author_name = $4, updated_at = $5
      WHERE id = $6
    `;

    try {
      await this.pool.query(query, [
        news.title,
        news.description,
        news.authorId,
        news.authorName,
        new Date(),
        news.id,
      ]);
    } catch (error) {
      console.error('Erreur PostgreSQL:', error);
      throw error;
    }
  }

  async getNewsById(id: string): Promise<News | null> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM news WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
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
      console.error('Erreur PostgreSQL:', error);
      throw error;
    }
  }

  async getAllNews(): Promise<News[]> {
    try {
      const result = await this.pool.query('SELECT * FROM news');

      return result.rows.map(
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
      console.error('Erreur PostgreSQL:', error);
      throw error;
    }
  }

  async getAllNewsOrderedByDate(): Promise<News[]> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM news ORDER BY created_at DESC'
      );

      return result.rows.map(
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
      console.error('Erreur PostgreSQL:', error);
      throw error;
    }
  }

  async getNewsByAuthorId(authorId: string): Promise<News[]> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM news WHERE author_id = $1 ORDER BY created_at DESC',
        [authorId]
      );

      return result.rows.map(
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
      console.error('Erreur PostgreSQL:', error);
      throw error;
    }
  }
}

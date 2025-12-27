import { News } from '@/types/news';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CreateNewsData {
  title: string;
  description: string;
}

export interface NewsResponse {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export const createNews = async (data: CreateNewsData): Promise<News> => {
  const response = await fetch(`${API_URL}/api/news`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Failed to create news');
  }

  const newsData: NewsResponse = await response.json();

  return {
    id: newsData.id,
    title: newsData.title,
    description: newsData.description,
    authorId: newsData.authorId,
    authorName: newsData.authorName,
    createdAt: new Date(newsData.createdAt),
  };
};

export const getAllNews = async (limit?: number, offset?: number): Promise<News[]> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());

  const url = `${API_URL}/api/news${params.toString() ? `?${params.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Failed to fetch news');
  }

  const newsListData: NewsResponse[] = await response.json();

  return newsListData.map((newsData) => ({
    id: newsData.id,
    title: newsData.title,
    description: newsData.description,
    authorId: newsData.authorId,
    authorName: newsData.authorName,
    createdAt: new Date(newsData.createdAt),
  }));
};


export const deleteNews = async (newsId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/news/${newsId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to delete news' }));
    throw new Error(error.error || error.message || 'Failed to delete news');
  }
};

import { DomainError } from './DomainError';

export class NewsNotFoundError extends DomainError {
  constructor(newsId: string) {
    super(`News with id ${newsId} not found`);
  }
}

import { DomainError } from './DomainError';

export class UnauthorizedNewsAccessError extends DomainError {
  constructor() {
    super('You do not have permission to delete this news');
  }
}

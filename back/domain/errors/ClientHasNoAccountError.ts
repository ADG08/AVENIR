import { DomainError } from './DomainError';

export class ClientHasNoAccountError extends DomainError {
  constructor() {
    super(`Client has no account`);
  }
}

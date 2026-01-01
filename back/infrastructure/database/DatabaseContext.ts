import { UserRepository } from '../../domain/repositories/UserRepository';
import { ChatRepository } from '../../domain/repositories/ChatRepository';
import { MessageRepository } from '../../domain/repositories/MessageRepository';
import { AccountRepository } from '../../domain/repositories/AccountRepository';
import { NewsRepository } from '../../domain/repositories/NewsRepository';
import { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import { LoanRepository } from '../../domain/repositories/LoanRepository';

export interface DatabaseContext {
    userRepository: UserRepository;
    chatRepository: ChatRepository;
    messageRepository: MessageRepository;
    accountRepository: AccountRepository;
    newsRepository: NewsRepository;
    notificationRepository: NotificationRepository;
    loanRepository: LoanRepository;
    close(): Promise<void>;
}

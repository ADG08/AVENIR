import { UserRepository } from '../../domain/repositories/UserRepository';
import { ChatRepository } from '../../domain/repositories/ChatRepository';
import { MessageRepository } from '../../domain/repositories/MessageRepository';
import { AccountRepository } from '../../domain/repositories/AccountRepository';

export interface DatabaseContext {
    userRepository: UserRepository;
    chatRepository: ChatRepository;
    messageRepository: MessageRepository;
    accountRepository: AccountRepository;
    close(): Promise<void>;
}

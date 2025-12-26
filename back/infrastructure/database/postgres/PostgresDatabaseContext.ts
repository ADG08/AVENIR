import { DatabaseContext } from '../DatabaseContext';
import { pool } from './connection';
import { PostgresUserRepository } from '../../adapters/repositories/postgres/PostgresUserRepository';
import { PostgresChatRepository } from '../../adapters/repositories/postgres/PostgresChatRepository';
import { PostgresMessageRepository } from '../../adapters/repositories/postgres/PostgresMessageRepository';
import { PostgresAccountRepository } from '../../adapters/repositories/postgres/PostgresAccountRepository';
import { PostgresNewsRepository } from '../../adapters/repositories/postgres/PostgresNewsRepository';
import { UserRepository } from '@avenir/domain/repositories/UserRepository';
import { ChatRepository } from '@avenir/domain/repositories/ChatRepository';
import { MessageRepository } from '@avenir/domain/repositories/MessageRepository';
import { AccountRepository } from '@avenir/domain/repositories/AccountRepository';
import { NewsRepository } from '@avenir/domain/repositories/NewsRepository';

export class PostgresDatabaseContext implements DatabaseContext {
    public readonly userRepository: UserRepository;
    public readonly chatRepository: ChatRepository;
    public readonly messageRepository: MessageRepository;
    public readonly accountRepository: AccountRepository;
    public readonly newsRepository: NewsRepository;

    constructor() {
        this.userRepository = new PostgresUserRepository(pool);
        this.chatRepository = new PostgresChatRepository(pool);
        this.messageRepository = new PostgresMessageRepository(pool);
        this.accountRepository = new PostgresAccountRepository(pool);
        this.newsRepository = new PostgresNewsRepository(pool);
    }

    async close(): Promise<void> {
        await pool.end();
    }
}

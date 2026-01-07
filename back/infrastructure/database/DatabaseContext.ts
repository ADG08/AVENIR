import { UserRepository } from '../../domain/repositories/UserRepository';
import { ChatRepository } from '../../domain/repositories/ChatRepository';
import { MessageRepository } from '../../domain/repositories/MessageRepository';
import { AccountRepository } from '../../domain/repositories/AccountRepository';
import { StockRepository } from '../../domain/repositories/StockRepository';
import { PortfolioRepository } from '../../domain/repositories/PortfolioRepository';
import { OrderBookRepository } from '../../domain/repositories/OrderBookRepository';
import { TradeRepository } from '../../domain/repositories/TradeRepository';
import { NewsRepository } from '../../domain/repositories/NewsRepository';
import { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import { LoanRepository } from '../../domain/repositories/LoanRepository';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';

export interface DatabaseContext {
    userRepository: UserRepository;
    chatRepository: ChatRepository;
    messageRepository: MessageRepository;
    accountRepository: AccountRepository;
    stockRepository: StockRepository;
    portfolioRepository: PortfolioRepository;
    orderBookRepository: OrderBookRepository;
    tradeRepository: TradeRepository;
    newsRepository: NewsRepository;
    notificationRepository: NotificationRepository;
    loanRepository: LoanRepository;
    transactionRepository: TransactionRepository;
    close(): Promise<void>;
}

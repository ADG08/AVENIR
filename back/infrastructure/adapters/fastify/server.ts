import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health';
import { userRoutes } from './routes/user';
import { authRoutes } from './routes/auth';
import { chatRoutes } from './routes/chat';
import { messageRoutes } from './routes/message';
import { newsRoutes } from './routes/news';
import { websocketRoutes } from './routes/websocket';
import { UserController } from './controllers/UserController';
import { ChatController } from './controllers/ChatController';
import { MessageController } from './controllers/MessageController';
import { NewsController } from './controllers/NewsController';
import { GetUserUseCase } from '@avenir/application/usecases/user/GetUserUseCase';
import { GetUsersUseCase } from '@avenir/application/usecases/user/GetUsersUseCase';
import { AddUserUseCase } from '@avenir/application/usecases/user/AddUserUseCase';
import { RegisterUserUseCase } from '@avenir/application/usecases/user/RegisterUserUseCase';
import { VerifyEmailUseCase } from '@avenir/application/usecases/user/VerifyEmailUseCase';
import { LoginUserUseCase } from '@avenir/application/usecases/user/LoginUserUseCase';
import { GetAdvisorClientsWithChatsAndLoansUseCase } from '@avenir/application/usecases/user/GetAdvisorClientsWithChatsAndLoansUseCase';
import { NodemailerEmailService } from '../email/NodemailerEmailService';
import { CreateChatUseCase } from '@avenir/application/usecases/chat/CreateChatUseCase';
import { GetChatsUseCase } from '@avenir/application/usecases/chat/GetChatsUseCase';
import { GetChatMessagesUseCase } from '@avenir/application/usecases/chat/GetChatMessagesUseCase';
import { TransferChatUseCase } from '@avenir/application/usecases/chat/TransferChatUseCase';
import { SendMessageUseCase } from '@avenir/application/usecases/chat/SendMessageUseCase';
import { CloseChatUseCase } from '@avenir/application/usecases/chat/CloseChatUseCase';
import { CreateNewsUseCase } from '@avenir/application/usecases/news/CreateNewsUseCase';
import { GetAllNewsUseCase } from '@avenir/application/usecases/news/GetAllNewsUseCase';
import { GetNewsByIdUseCase } from '@avenir/application/usecases/news/GetNewsByIdUseCase';
import { DeleteNewsUseCase } from '@avenir/application/usecases/news/DeleteNewsUseCase';
import { CreateNotificationUseCase } from '@avenir/application/usecases/notification/CreateNotificationUseCase';
import { GetNotificationsUseCase } from '@avenir/application/usecases/notification/GetNotificationsUseCase';
import { MarkNotificationAsReadUseCase } from '@avenir/application/usecases/notification/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '@avenir/application/usecases/notification/MarkAllNotificationsAsReadUseCase';
import { DeleteNotificationUseCase } from '@avenir/application/usecases/notification/DeleteNotificationUseCase';
import { NotificationController } from './controllers/NotificationController';
import { notificationRoutes } from './routes/notification';
import { RepositoryFactory } from '../../factories/RepositoryFactory';
import { GetChatByIdUseCase } from "@avenir/application/usecases/chat/GetChatByIdUseCase";
import { MarkMessageAsReadUseCase } from "@avenir/application/usecases/chat/MarkMessageAsReadUseCase";
import { MarkChatMessagesAsReadUseCase } from "@avenir/application/usecases/chat/MarkChatMessagesAsReadUseCase";

const fastify = Fastify({
    logger: true
});

const dbContext = RepositoryFactory.createDatabaseContext();

// Repositories
const userRepository = dbContext.userRepository;
const accountRepository = dbContext.accountRepository;
const chatRepository = dbContext.chatRepository;
const messageRepository = dbContext.messageRepository;
const newsRepository = dbContext.newsRepository;
const notificationRepository = dbContext.notificationRepository;

// User
const emailService = new NodemailerEmailService();
const getUserUseCase = new GetUserUseCase(userRepository);
const getUsersUseCase = new GetUsersUseCase(userRepository);
const addUserUseCase = new AddUserUseCase(userRepository);
const registerUserUseCase = new RegisterUserUseCase(userRepository, accountRepository, emailService);
const verifyEmailUseCase = new VerifyEmailUseCase(userRepository, emailService);
const loginUserUseCase = new LoginUserUseCase(userRepository);
const getAdvisorClientsWithChatsAndLoansUseCase = new GetAdvisorClientsWithChatsAndLoansUseCase(userRepository, chatRepository);
const userController = new UserController(getUserUseCase, getUsersUseCase, addUserUseCase, registerUserUseCase, verifyEmailUseCase, loginUserUseCase, getAdvisorClientsWithChatsAndLoansUseCase);

// Chat
const createChatUseCase = new CreateChatUseCase(chatRepository, messageRepository, userRepository);
const getChatsUseCase = new GetChatsUseCase(chatRepository, messageRepository, userRepository);
const getChatByIdUseCase = new GetChatByIdUseCase(chatRepository, messageRepository);
const getChatMessagesUseCase = new GetChatMessagesUseCase(chatRepository, messageRepository);
const markChatMessagesAsReadUseCase = new MarkChatMessagesAsReadUseCase(chatRepository, messageRepository);
const transferChatUseCase = new TransferChatUseCase(chatRepository, userRepository, messageRepository);
const closeChatUseCase = new CloseChatUseCase(chatRepository);
const sendMessageUseCase = new SendMessageUseCase(chatRepository, messageRepository, userRepository);
const markMessageAsReadUseCase = new MarkMessageAsReadUseCase(messageRepository);

const chatController = new ChatController(
    createChatUseCase,
    getChatsUseCase,
    getChatByIdUseCase,
    getChatMessagesUseCase,
    markChatMessagesAsReadUseCase,
    transferChatUseCase,
    closeChatUseCase,
    chatRepository,
    messageRepository
);

const messageController = new MessageController(sendMessageUseCase, markMessageAsReadUseCase, chatRepository);

// News
const createNewsUseCase = new CreateNewsUseCase(newsRepository, userRepository, notificationRepository);
const getAllNewsUseCase = new GetAllNewsUseCase(newsRepository);
const getNewsByIdUseCase = new GetNewsByIdUseCase(newsRepository);
const deleteNewsUseCase = new DeleteNewsUseCase(newsRepository, userRepository);
const newsController = new NewsController(createNewsUseCase, getAllNewsUseCase, getNewsByIdUseCase, deleteNewsUseCase);

// Notifications
const createNotificationUseCase = new CreateNotificationUseCase(notificationRepository);
const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);
const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepository);
const markAllNotificationsAsReadUseCase = new MarkAllNotificationsAsReadUseCase(notificationRepository);
const deleteNotificationUseCase = new DeleteNotificationUseCase(notificationRepository);
const notificationController = new NotificationController(
    createNotificationUseCase,
    getNotificationsUseCase,
    markNotificationAsReadUseCase,
    markAllNotificationsAsReadUseCase,
    deleteNotificationUseCase
);

async function setupRoutes() {
    await fastify.register(cors, {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    });

    await fastify.register(fastifyCookie);
    await fastify.register(fastifyWebsocket);

    await fastify.register(healthRoutes, { prefix: '/api' });
    await fastify.register(userRoutes, { prefix: '/api', userController });
    await fastify.register(authRoutes, { prefix: '/api/auth', userController });
    await fastify.register(chatRoutes, { prefix: '/api', chatController, messageRepository, chatRepository });
    await fastify.register(messageRoutes, { prefix: '/api', messageController });
    await fastify.register(newsRoutes, { prefix: '/api', newsController });
    await fastify.register(notificationRoutes, { prefix: '/api', notificationController });
    await fastify.register(websocketRoutes, { prefix: '/api' });
}

const start = async () => {
    try {
        await setupRoutes();
        await fastify.listen({ port: 3001, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

const shutdown = async () => {
    try {
        console.log('Shutting down server...');
        await dbContext.close();
        await fastify.close();
        console.log('Server shut down successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();

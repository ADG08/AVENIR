import Fastify from 'fastify';
import { healthRoutes } from './routes/health';
import { userRoutes } from './routes/user';
import { chatRoutes } from './routes/chat';
import { messageRoutes } from './routes/message';
import { UserController } from './controllers/UserController';
import { ChatController } from './controllers/ChatController';
import { MessageController } from './controllers/MessageController';
import { GetUserUseCase } from '@avenir/application/usecases/user/GetUserUseCase';
import { AddUserUseCase } from '@avenir/application/usecases/user/AddUserUseCase';
import { CreateChatUseCase } from '@avenir/application/usecases/chat/CreateChatUseCase';
import { GetChatsUseCase } from '@avenir/application/usecases/chat/GetChatsUseCase';
import { GetChatMessagesUseCase } from '@avenir/application/usecases/chat/GetChatMessagesUseCase';
import { TransferChatUseCase } from '@avenir/application/usecases/chat/TransferChatUseCase';
import { SendMessageUseCase } from '@avenir/application/usecases/chat/SendMessageUseCase';
import { RepositoryFactory } from '../../factories/RepositoryFactory';
import { databaseConfig } from '../../config/database.config';
import {GetChatByIdUseCase} from "@avenir/application/usecases/chat/GetChatByIdUseCase";
import {MarkMessageAsReadUseCase} from "@avenir/application/usecases/chat/MarkMessageAsReadUseCase";
import {MarkChatMessagesAsReadUseCase} from "@avenir/application/usecases/chat/MarkChatMessagesAsReadUseCase";

const fastify = Fastify({ logger: true });
const dbContext = RepositoryFactory.createDatabaseContext();

// User
const userRepository = dbContext.userRepository;
const getUserUseCase = new GetUserUseCase(userRepository);
const addUserUseCase = new AddUserUseCase(userRepository);
const userController = new UserController(getUserUseCase, addUserUseCase);

// Chat
const chatRepository = dbContext.chatRepository;
const messageRepository = dbContext.messageRepository;

const createChatUseCase = new CreateChatUseCase(chatRepository, messageRepository, userRepository);
const getChatsUseCase = new GetChatsUseCase(chatRepository, messageRepository);
const getChatByIdUseCase = new GetChatByIdUseCase(chatRepository, messageRepository);
const getChatMessagesUseCase = new GetChatMessagesUseCase(chatRepository, messageRepository);
const markChatMessagesAsReadUseCase = new MarkChatMessagesAsReadUseCase(chatRepository, messageRepository);
const transferChatUseCase = new TransferChatUseCase(chatRepository, userRepository);
const sendMessageUseCase = new SendMessageUseCase(chatRepository, messageRepository, userRepository);
const markMessageAsReadUseCase = new MarkMessageAsReadUseCase(messageRepository);

const chatController = new ChatController(
    createChatUseCase,
    getChatsUseCase,
    getChatByIdUseCase,
    getChatMessagesUseCase,
    markChatMessagesAsReadUseCase,
    transferChatUseCase
);

const messageController = new MessageController(sendMessageUseCase, markMessageAsReadUseCase);

async function setupRoutes() {
    await fastify.register(healthRoutes, { prefix: '/api' });
    await fastify.register(userRoutes, { prefix: '/api', userController });
    await fastify.register(chatRoutes, { prefix: '/api', chatController });
    await fastify.register(messageRoutes, { prefix: '/api', messageController });
}

const start = async () => {
    try {
        await setupRoutes();
        await fastify.listen({ port: 3000 });
        console.log(`🚀 Serveur http://localhost:3000 (${databaseConfig.type})`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

const shutdown = async () => {
    try {
        await dbContext.close();
        await fastify.close();
        process.exit(0);
    } catch {
        process.exit(1);
    }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();


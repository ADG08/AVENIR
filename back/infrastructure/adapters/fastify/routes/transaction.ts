import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { TransactionController } from '../controllers/TransactionController';
import { authMiddleware } from '../middleware/authMiddleware';
import { CreateTransactionRequest } from '../../../../application/requests';

export async function transactionRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions & { transactionController: TransactionController }
) {
    const { transactionController } = options;

    fastify.get<{ Querystring: { accountId?: string } }>(
        '/transactions',
        { preHandler: authMiddleware },
        async (request, reply) => {
            return transactionController.getTransactions(request, reply);
        }
    );

    fastify.post<{ Body: CreateTransactionRequest }>(
        '/transactions',
        { preHandler: authMiddleware },
        async (request, reply) => {
            return transactionController.createTransaction(request, reply);
        }
    );
}


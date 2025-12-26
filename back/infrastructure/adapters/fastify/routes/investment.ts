import { FastifyInstance } from 'fastify';
import { InvestmentController } from '../controllers/InvestmentController';
import { authMiddleware } from '../middleware/authMiddleware';

interface InvestmentRoutesOptions {
    investmentController: InvestmentController;
}

export async function investmentRoutes(fastify: FastifyInstance, options: InvestmentRoutesOptions) {
    const { investmentController } = options;

    fastify.get<{ Querystring: never }>(
        '/stocks',
        { preHandler: authMiddleware },
        async (request, reply) => investmentController.getStocks(request, reply)
    );

    fastify.get<{ Querystring: never }>(
        '/portfolio',
        { preHandler: authMiddleware },
        async (request, reply) => investmentController.getPortfolio(request, reply)
    );

    fastify.get<{ Querystring: { limit?: string } }>(
        '/trades/recent',
        { preHandler: authMiddleware },
        async (request, reply) => investmentController.getRecentTrades(request, reply)
    );

    fastify.get<{ Querystring: never }>(
        '/balance',
        { preHandler: authMiddleware },
        async (request, reply) => investmentController.getBalance(request, reply)
    );

    fastify.post<{ Body: { stockId: string; quantity: number } }>(
        '/purchase',
        { preHandler: authMiddleware },
        async (request, reply) => investmentController.purchaseStock(request, reply)
    );

    fastify.post<{
        Body: {
            stockId: string;
            side: 'BID' | 'ASK';
            type: 'MARKET' | 'LIMIT';
            quantity: number;
            limitPrice?: number;
        }
    }>(
        '/order',
        { preHandler: authMiddleware },
        async (request, reply) => investmentController.placeOrder(request, reply)
    );

    fastify.get<{ Params: { stockId: string } }>(
        '/orderbook/:stockId',
        { preHandler: authMiddleware },
        async (request, reply) => investmentController.getOrderBook(request, reply)
    );

    fastify.get<{ Params: { stockId: string }; Querystring: { limit?: string } }>(
        '/trades/:stockId',
        { preHandler: authMiddleware },
        async (request, reply) => investmentController.getStockTrades(request, reply)
    );

    fastify.delete<{ Params: { orderId: string } }>(
        '/order/:orderId',
        { preHandler: authMiddleware },
        async (request, reply) => investmentController.cancelOrder(request, reply)
    );

    fastify.get<{ Querystring: { stockId?: string; state?: string } }>(
        '/orders',
        { preHandler: authMiddleware },
        async (request, reply) => investmentController.getUserOrders(request, reply)
    );
}

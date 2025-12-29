import { FastifyInstance } from 'fastify';
import { InvestmentController } from '../controllers/InvestmentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { createRoleMiddleware } from '../middleware/roleMiddleware';
import { UserRepository } from '../../../../domain/repositories/UserRepository';
import { UserRole } from '@avenir/shared/enums/UserRole';

interface InvestmentRoutesOptions {
    investmentController: InvestmentController;
    userRepository: UserRepository;
}

export async function investmentRoutes(fastify: FastifyInstance, options: InvestmentRoutesOptions) {
    const { investmentController, userRepository } = options;

    const directorOnly = createRoleMiddleware(userRepository, UserRole.DIRECTOR);

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

    fastify.get<{ Params: { stockId: string }; Querystring: { period?: string } }>(
        '/prices/:stockId',
        { preHandler: authMiddleware },
        async (request, reply) => investmentController.getStockPrices(request, reply)
    );

    fastify.get<{ Querystring: { period?: string } }>(
        '/portfolio/history',
        { preHandler: authMiddleware },
        async (request, reply) => investmentController.getPortfolioHistory(request, reply)
    );

    fastify.get<{ Querystring: { period?: string } }>(
        '/profits/breakdown',
        { preHandler: authMiddleware },
        async (request, reply) => investmentController.getProfitsBreakdown(request, reply)
    );

    fastify.get<{ Querystring: never }>(
        '/admin/stocks',
        { preHandler: [authMiddleware, directorOnly] },
        async (request, reply) => investmentController.getAllStocksAdmin(request, reply)
    );

    fastify.post<{ Body: any }>(
        '/admin/stocks',
        { preHandler: [authMiddleware, directorOnly] },
        async (request, reply) => investmentController.createStock(request, reply)
    );

    fastify.put<{ Params: { id: string }; Body: any }>(
        '/admin/stocks/:id',
        { preHandler: [authMiddleware, directorOnly] },
        async (request, reply) => investmentController.updateStock(request, reply)
    );

    fastify.delete<{ Params: { id: string } }>(
        '/admin/stocks/:id',
        { preHandler: [authMiddleware, directorOnly] },
        async (request, reply) => investmentController.deleteStock(request, reply)
    );
}

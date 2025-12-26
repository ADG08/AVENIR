import { FastifyRequest, FastifyReply } from 'fastify';
import { StockRepository } from '@avenir/domain/repositories/StockRepository';
import { PortfolioRepository } from '@avenir/domain/repositories/PortfolioRepository';
import { TradeRepository } from '@avenir/domain/repositories/TradeRepository';
import { AccountRepository } from '@avenir/domain/repositories/AccountRepository';
import { UserRepository } from '@avenir/domain/repositories/UserRepository';
import { OrderBookRepository } from '@avenir/domain/repositories/OrderBookRepository';
import { OrderBook } from '@avenir/domain/entities/OrderBook';
import { OrderSide } from '@avenir/domain/enumerations/OrderSide';
import { OrderBookType } from '@avenir/domain/enumerations/OrderBookType';
import { OrderBookState } from '@avenir/domain/enumerations/OrderBookState';
import { OrderMatchingService } from '@avenir/application/services/OrderMatchingService';
import { v4 as uuidv4 } from 'uuid';

export class InvestmentController {
    constructor(
        private stockRepository: StockRepository,
        private portfolioRepository: PortfolioRepository,
        private tradeRepository: TradeRepository,
        private accountRepository: AccountRepository,
        private userRepository: UserRepository,
        private orderBookRepository: OrderBookRepository,
        private orderMatchingService: OrderMatchingService
    ) { }

    async getStocks(request: FastifyRequest, reply: FastifyReply) {
        try {
            const stocks = await this.stockRepository.getAllActive();

            const stocksData = stocks.map(stock => ({
                id: stock.id,
                symbol: stock.symbol,
                name: stock.name,
                currentPrice: stock.currentPrice,
                bestBid: stock.bestBid,
                bestAsk: stock.bestAsk,
                change: 0,
                changePercent: 0,
            }));

            return reply.status(200).send(stocksData);
        } catch (error) {
            console.error('Error fetching stocks:', error);
            return reply.status(500).send({ error: 'Failed to fetch stocks' });
        }
    }

    async getPortfolio(request: FastifyRequest, reply: FastifyReply) {
        try {
            if (!request.user) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const userId = request.user.userId;

            const portfolios = await this.portfolioRepository.getByUserId(userId);

            const positions = portfolios.map(portfolio => ({
                id: portfolio.id,
                stockId: portfolio.stock.id,
                symbol: portfolio.stock.symbol,
                name: portfolio.stock.name,
                quantity: portfolio.quantity,
                averageBuyPrice: portfolio.averageBuyPrice,
                currentPrice: portfolio.stock.currentPrice,
                totalInvested: portfolio.totalInvested,
                currentValue: portfolio.getCurrentValue(),
                profitLoss: portfolio.getProfitLoss(),
                profitLossPercent: portfolio.getProfitLossPercentage(),
            }));

            const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);
            const totalInvested = positions.reduce((sum, pos) => sum + pos.totalInvested, 0);
            const totalProfitLoss = totalValue - totalInvested;
            const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

            const portfolioSummary = {
                totalValue,
                totalInvested,
                totalProfitLoss,
                totalProfitLossPercent,
                positions,
            };

            return reply.status(200).send(portfolioSummary);
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            return reply.status(500).send({ error: 'Failed to fetch portfolio' });
        }
    }

    async getRecentTrades(request: FastifyRequest<{ Querystring: { limit?: string } }>, reply: FastifyReply) {
        try {
            if (!request.user) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const userId = request.user.userId;

            const limit = request.query.limit ? parseInt(request.query.limit) : 20;
            const trades = await this.tradeRepository.getByUserId(userId);

            const recentTrades = trades.slice(0, limit).map(trade => ({
                id: trade.id,
                stockSymbol: trade.stock.symbol,
                quantity: trade.quantity,
                price: trade.price,
                totalValue: trade.getTotalValue(),
                type: trade.buyer.id === userId ? 'BUY' : 'SELL',
                createdAt: trade.createdAt,
            }));

            return reply.status(200).send(recentTrades);
        } catch (error) {
            console.error('Error fetching recent trades:', error);
            return reply.status(500).send({ error: 'Failed to fetch recent trades' });
        }
    }

    async getBalance(request: FastifyRequest, reply: FastifyReply) {
        try {
            if (!request.user) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const userId = request.user.userId;
            const accounts = await this.accountRepository.findByUserId(userId);

            const currentAccount = accounts.find(account => account.type === 'CURRENT');

            if (!currentAccount) {
                return reply.status(404).send({ error: 'Current account not found' });
            }

            return reply.status(200).send({
                balance: currentAccount.balance,
                currency: currentAccount.currency,
                accountId: currentAccount.id,
            });
        } catch (error) {
            console.error('Error fetching balance:', error);
            return reply.status(500).send({ error: 'Failed to fetch balance' });
        }
    }

    async purchaseStock(request: FastifyRequest<{ Body: { stockId: string; quantity: number } }>, reply: FastifyReply) {
        try {
            if (!request.user) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const userId = request.user.userId;
            const { stockId, quantity } = request.body;

            if (!stockId || !quantity || quantity <= 0) {
                return reply.status(400).send({ error: 'Invalid stock ID or quantity' });
            }

            const stock = await this.stockRepository.getById(stockId);
            if (!stock) {
                return reply.status(404).send({ error: 'Stock not found' });
            }

            const accounts = await this.accountRepository.findByUserId(userId);
            const currentAccount = accounts.find(account => account.type === 'CURRENT');

            if (!currentAccount) {
                return reply.status(404).send({ error: 'Current account not found' });
            }

            const TRANSACTION_FEE = 1;
            const totalCost = (stock.currentPrice * quantity) + TRANSACTION_FEE;

            if (currentAccount.balance < totalCost) {
                return reply.status(400).send({
                    error: 'Insufficient balance',
                    required: totalCost,
                    available: currentAccount.balance
                });
            }

            const user = await this.userRepository.getById(userId);
            if (!user) {
                return reply.status(404).send({ error: 'User not found' });
            }

            const now = new Date();

            const buyOrder = new OrderBook(
                uuidv4(),
                stock,
                user,
                OrderSide.BID,
                OrderBookType.MARKET,
                quantity,
                quantity,
                null,
                null,
                OrderBookState.PENDING,
                now,
                now
            );

            await this.orderBookRepository.add(buyOrder);

            await this.orderMatchingService.matchOrders(stockId);

            const updatedOrder = await this.orderBookRepository.getById(buyOrder.id);
            const updatedAccount = await this.accountRepository.findByUserId(userId);
            const newBalance = updatedAccount.find(account => account.type === 'CURRENT')?.balance || 0;

            return reply.status(200).send({
                success: true,
                message: 'Stock purchased successfully',
                trade: {
                    id: buyOrder.id,
                    stockSymbol: stock.symbol,
                    quantity,
                    price: stock.currentPrice,
                    totalCost,
                },
                newBalance,
                orderState: updatedOrder?.state || buyOrder.state,
            });
        } catch (error) {
            console.error('Error purchasing stock:', error);
            return reply.status(500).send({ error: 'Failed to purchase stock' });
        }
    }

    async placeOrder(request: FastifyRequest<{
        Body: {
            stockId: string;
            side: 'BID' | 'ASK';
            type: 'MARKET' | 'LIMIT';
            quantity: number;
            limitPrice?: number;
        }
    }>, reply: FastifyReply) {
        try {
            if (!request.user) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const userId = request.user.userId;
            const { stockId, side, type, quantity, limitPrice } = request.body;

            // Validation
            if (!stockId || !side || !type || !quantity || quantity <= 0) {
                return reply.status(400).send({ error: 'Invalid order parameters' });
            }

            if (type === 'LIMIT' && (!limitPrice || limitPrice <= 0)) {
                return reply.status(400).send({ error: 'Limit price required for LIMIT orders' });
            }

            // Récupérer le stock
            const stock = await this.stockRepository.getById(stockId);
            if (!stock) {
                return reply.status(404).send({ error: 'Stock not found' });
            }

            // Récupérer l'utilisateur
            const user = await this.userRepository.getById(userId);
            if (!user) {
                return reply.status(404).send({ error: 'User not found' });
            }

            // Pour un ordre d'achat, vérifier le solde
            if (side === 'BID') {
                const accounts = await this.accountRepository.findByUserId(userId);
                const currentAccount = accounts.find(account => account.type === 'CURRENT');

                if (!currentAccount) {
                    return reply.status(404).send({ error: 'Current account not found' });
                }

                const TRANSACTION_FEE = 1;
                const estimatedCost = (limitPrice || stock.currentPrice) * quantity + TRANSACTION_FEE;

                if (currentAccount.balance < estimatedCost) {
                    return reply.status(400).send({
                        error: 'Insufficient balance',
                        required: estimatedCost,
                        available: currentAccount.balance
                    });
                }
            }

            // Pour un ordre de vente, vérifier qu'on possède assez d'actions
            if (side === 'ASK') {
                const portfolio = await this.portfolioRepository.getByUserIdAndStockId(userId, stockId);

                if (!portfolio || portfolio.quantity < quantity) {
                    return reply.status(400).send({
                        error: 'Insufficient stock quantity',
                        required: quantity,
                        available: portfolio?.quantity || 0
                    });
                }
            }

            // Déterminer le prix et l'état initial
            let orderPrice: number | null = null;
            let initialState = OrderBookState.PENDING;

            if (type === 'MARKET') {
                // Pour un ordre MARKET, ne pas définir de limite de prix
                // Le matching engine utilisera Infinity pour BID et 0 pour ASK
                orderPrice = null;
            } else {
                // Pour un ordre LIMIT, utiliser le prix spécifié
                orderPrice = limitPrice!;
            }

            const now = new Date();

            // Créer l'ordre
            const order = new OrderBook(
                uuidv4(),
                stock,
                user,
                side === 'BID' ? OrderSide.BID : OrderSide.ASK,
                type === 'MARKET' ? OrderBookType.MARKET : OrderBookType.LIMIT,
                quantity,
                quantity, // remainingQuantity = quantity initialement
                orderPrice,
                null,
                initialState,
                now,
                now
            );

            await this.orderBookRepository.add(order);

            // Lancer le matching
            await this.orderMatchingService.matchOrders(stockId);

            // Récupérer l'ordre mis à jour après le matching
            const updatedOrder = await this.orderBookRepository.getById(order.id);

            // Vérifier si un ordre MARKET a été partiellement exécuté et annulé
            let warningMessage = null;
            let executedQuantity = quantity;

            if (updatedOrder) {
                executedQuantity = quantity - updatedOrder.remainingQuantity;

                // Si c'est un ordre MARKET qui a été annulé avec des shares non exécutées
                if (type === OrderBookType.MARKET && updatedOrder.state === OrderBookState.CANCELLED && updatedOrder.remainingQuantity > 0) {
                    warningMessage = `Partial fill: Only ${executedQuantity.toFixed(2)} shares were executed. ${updatedOrder.remainingQuantity.toFixed(2)} shares cancelled due to insufficient liquidity.`;
                }
            }

            return reply.status(200).send({
                success: true,
                message: warningMessage || 'Order placed successfully',
                warning: warningMessage ? true : false,
                order: {
                    id: updatedOrder?.id || order.id,
                    stockSymbol: stock.symbol,
                    side,
                    type,
                    quantity,
                    executedQuantity,
                    limitPrice: orderPrice,
                    state: updatedOrder?.state || order.state,
                    remainingQuantity: updatedOrder?.remainingQuantity || order.remainingQuantity,
                }
            });
        } catch (error) {
            console.error('Error placing order:', error);
            return reply.status(500).send({ error: 'Failed to place order' });
        }
    }

    async getOrderBook(request: FastifyRequest<{ Params: { stockId: string } }>, reply: FastifyReply) {
        try {
            if (!request.user) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const { stockId } = request.params;

            if (!stockId) {
                return reply.status(400).send({ error: 'Stock ID is required' });
            }

            const stock = await this.stockRepository.getById(stockId);
            if (!stock) {
                return reply.status(404).send({ error: 'Stock not found' });
            }

            const bidOrders = await this.orderBookRepository.getByStockIdAndSide(stockId, OrderSide.BID);
            const askOrders = await this.orderBookRepository.getByStockIdAndSide(stockId, OrderSide.ASK);

            const activeBids = bidOrders
                .filter(order => order.state === OrderBookState.PENDING || order.state === OrderBookState.PARTIAL)
                .sort((a, b) => (b.limitPrice || 0) - (a.limitPrice || 0))
                .map(order => ({
                    id: order.id,
                    price: order.limitPrice,
                    quantity: order.remainingQuantity,
                    type: order.orderType,
                    createdAt: order.createdAt,
                }));

            const activeAsks = askOrders
                .filter(order => order.state === OrderBookState.PENDING || order.state === OrderBookState.PARTIAL)
                .sort((a, b) => (a.limitPrice || 0) - (b.limitPrice || 0))
                .map(order => ({
                    id: order.id,
                    price: order.limitPrice,
                    quantity: order.remainingQuantity,
                    type: order.orderType,
                    createdAt: order.createdAt,
                }));

            return reply.status(200).send({
                stockId,
                stockSymbol: stock.symbol,
                stockName: stock.name,
                currentPrice: stock.currentPrice,
                bestBid: stock.bestBid,
                bestAsk: stock.bestAsk,
                bids: activeBids,
                asks: activeAsks,
            });
        } catch (error) {
            console.error('Error fetching order book:', error);
            return reply.status(500).send({ error: 'Failed to fetch order book' });
        }
    }

    async cancelOrder(request: FastifyRequest<{ Params: { orderId: string } }>, reply: FastifyReply) {
        try {
            if (!request.user) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const userId = request.user.userId;
            const { orderId } = request.params;

            if (!orderId) {
                return reply.status(400).send({ error: 'Order ID is required' });
            }

            const order = await this.orderBookRepository.getById(orderId);

            if (!order) {
                return reply.status(404).send({ error: 'Order not found' });
            }

            if (order.user.id !== userId) {
                return reply.status(403).send({ error: 'Forbidden: You can only cancel your own orders' });
            }

            if (order.state !== OrderBookState.PENDING && order.state !== OrderBookState.PARTIAL) {
                return reply.status(400).send({
                    error: 'Cannot cancel order',
                    reason: `Order is in ${order.state} state`,
                });
            }

            const cancelledOrder = new OrderBook(
                order.id,
                order.stock,
                order.user,
                order.side,
                order.orderType,
                order.quantity,
                order.remainingQuantity,
                order.limitPrice,
                order.stopPrice,
                OrderBookState.CANCELLED,
                order.createdAt,
                new Date()
            );

            await this.orderBookRepository.update(cancelledOrder);

            return reply.status(200).send({
                success: true,
                message: 'Order cancelled successfully',
                order: {
                    id: cancelledOrder.id,
                    state: cancelledOrder.state,
                },
            });
        } catch (error) {
            console.error('Error cancelling order:', error);
            return reply.status(500).send({ error: 'Failed to cancel order' });
        }
    }

    async getUserOrders(request: FastifyRequest<{ Querystring: { stockId?: string; state?: string } }>, reply: FastifyReply) {
        try {
            if (!request.user) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const userId = request.user.userId;
            const { stockId, state } = request.query;

            const allOrders = await this.orderBookRepository.getByUserId(userId);

            let filteredOrders = allOrders;

            if (stockId) {
                filteredOrders = filteredOrders.filter(order => order.stock.id === stockId);
            }

            if (state) {
                const orderState = state.toUpperCase() as keyof typeof OrderBookState;
                filteredOrders = filteredOrders.filter(order => order.state === OrderBookState[orderState]);
            }

            const orders = filteredOrders
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map(order => ({
                    id: order.id,
                    stockId: order.stock.id,
                    stockSymbol: order.stock.symbol,
                    stockName: order.stock.name,
                    side: order.side,
                    type: order.orderType,
                    quantity: order.quantity,
                    remainingQuantity: order.remainingQuantity,
                    limitPrice: order.limitPrice,
                    state: order.state,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                }));

            return reply.status(200).send(orders);
        } catch (error) {
            console.error('Error fetching user orders:', error);
            return reply.status(500).send({ error: 'Failed to fetch user orders' });
        }
    }
}

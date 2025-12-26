import { Pool, RowDataPacket } from 'mysql2/promise';
import { TradeRepository } from '@avenir/domain/repositories/TradeRepository';
import { Trade } from '@avenir/domain/entities/Trade';
import { User } from '@avenir/domain/entities/User';
import { Stock } from '@avenir/domain/entities/Stock';
import { OrderBook } from '@avenir/domain/entities/OrderBook';
import { OrderSide } from '@avenir/domain/enumerations/OrderSide';
import { OrderBookType } from '@avenir/domain/enumerations/OrderBookType';
import { OrderBookState } from '@avenir/domain/enumerations/OrderBookState';
import { Account } from '@avenir/domain/entities/Account';

interface TradeRow extends RowDataPacket {
    id: string;
    stock_id: string;
    buyer_id: string;
    seller_id: string;
    buy_order_id: string;
    sell_order_id: string;
    quantity: string;
    price: string;
    buyer_fee: string;
    seller_fee: string;
    created_at: Date;
}

export class MySQLTradeRepository implements TradeRepository {
    constructor(private pool: Pool) {}

    async add(trade: Trade): Promise<Trade> {
        const query = `
            INSERT INTO trades (id, stock_id, buyer_id, seller_id, buy_order_id, sell_order_id, quantity, price, buyer_fee, seller_fee)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await this.pool.execute(query, [
            trade.id,
            trade.stock.id,
            trade.buyer.id,
            trade.seller.id,
            trade.buyOrder.id,
            trade.sellOrder.id,
            trade.quantity,
            trade.price,
            trade.buyerFee,
            trade.sellerFee,
        ]);
        return trade;
    }

    async getById(id: string): Promise<Trade | null> {
        const [rows] = await this.pool.execute<TradeRow[]>('SELECT * FROM trades WHERE id = ?', [id]);
        return rows.length > 0 ? this.mapRowToTrade(rows[0]) : null;
    }

    async getAll(): Promise<Trade[]> {
        const [rows] = await this.pool.execute<TradeRow[]>('SELECT * FROM trades ORDER BY created_at DESC');
        return rows.map(row => this.mapRowToTrade(row));
    }

    async getByStockId(stockId: string): Promise<Trade[]> {
        const [rows] = await this.pool.execute<TradeRow[]>('SELECT * FROM trades WHERE stock_id = ? ORDER BY created_at DESC', [stockId]);
        return rows.map(row => this.mapRowToTrade(row));
    }

    async getByBuyerId(buyerId: string): Promise<Trade[]> {
        const [rows] = await this.pool.execute<TradeRow[]>('SELECT * FROM trades WHERE buyer_id = ? ORDER BY created_at DESC', [buyerId]);
        return rows.map(row => this.mapRowToTrade(row));
    }

    async getBySellerId(sellerId: string): Promise<Trade[]> {
        const [rows] = await this.pool.execute<TradeRow[]>('SELECT * FROM trades WHERE seller_id = ? ORDER BY created_at DESC', [sellerId]);
        return rows.map(row => this.mapRowToTrade(row));
    }

    async getByUserId(userId: string): Promise<Trade[]> {
        const [rows] = await this.pool.execute<TradeRow[]>(
            'SELECT * FROM trades WHERE buyer_id = ? OR seller_id = ? ORDER BY created_at DESC',
            [userId, userId]
        );
        return rows.map(row => this.mapRowToTrade(row));
    }

    async getRecentTrades(limit: number): Promise<Trade[]> {
        const [rows] = await this.pool.execute<TradeRow[]>(
            'SELECT * FROM trades ORDER BY created_at DESC LIMIT ?',
            [limit]
        );
        return rows.map(row => this.mapRowToTrade(row));
    }

    private mapRowToTrade(row: TradeRow): Trade {
        const buyer = new User(
            row.buyer_id,
            '',
            '',
            '',
            '',
            '',
            'CLIENT',
            'ACTIVE',
            [],
            [],
            [],
            new Date()
        );

        const seller = new User(
            row.seller_id,
            '',
            '',
            '',
            '',
            '',
            'CLIENT',
            'ACTIVE',
            [],
            [],
            [],
            new Date()
        );

        const stock = new Stock(
            row.stock_id,
            '',
            '',
            null,
            0,
            null,
            null,
            null,
            0,
            true,
            [],
            new Date(),
            new Date()
        );

        const buyOrder = new OrderBook(
            row.buy_order_id,
            stock,
            buyer,
            OrderSide.BID,
            OrderBookType.LIMIT,
            0,
            0,
            null,
            null,
            OrderBookState.FILLED,
            new Date(),
            new Date()
        );

        const sellOrder = new OrderBook(
            row.sell_order_id,
            stock,
            seller,
            OrderSide.ASK,
            OrderBookType.LIMIT,
            0,
            0,
            null,
            null,
            OrderBookState.FILLED,
            new Date(),
            new Date()
        );

        return new Trade(
            row.id,
            stock,
            buyer,
            seller,
            buyOrder,
            sellOrder,
            parseFloat(row.quantity),
            parseFloat(row.price),
            parseFloat(row.buyer_fee),
            parseFloat(row.seller_fee),
            new Date(row.created_at)
        );
    }
}

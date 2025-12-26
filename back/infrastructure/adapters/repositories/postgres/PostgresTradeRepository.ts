import { Pool } from 'pg';
import { Trade } from '../../../../domain/entities/Trade';
import { TradeRepository } from '../../../../domain/repositories/TradeRepository';
import { User } from '../../../../domain/entities/User';
import { Stock } from '../../../../domain/entities/Stock';
import { OrderBook } from '../../../../domain/entities/OrderBook';
import { UserRole } from '../../../../domain/enumerations/UserRole';
import { UserState } from '../../../../domain/enumerations/UserState';
import { OrderSide } from '../../../../domain/enumerations/OrderSide';
import { OrderBookType } from '../../../../domain/enumerations/OrderBookType';
import { OrderBookState } from '../../../../domain/enumerations/OrderBookState';

export class PostgresTradeRepository implements TradeRepository {
    constructor(private pool: Pool) {}

    async add(trade: Trade): Promise<Trade> {
        const query = `
            INSERT INTO trades (id, stock_id, buyer_id, seller_id, buy_order_id, sell_order_id, quantity, price, buyer_fee, seller_fee, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;

        try {
            const result = await this.pool.query(query, [
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
                trade.createdAt
            ]);
            return await this.mapRowToTrade(result.rows[0]);
        } catch (error) {
            console.error('PostgreSQL error:', error);
            throw error;
        }
    }

    async getById(id: string): Promise<Trade | null> {
        try {
            const query = `
                SELECT t.*, s.symbol, s.name, s.current_price
                FROM trades t
                JOIN stocks s ON t.stock_id = s.id
                WHERE t.id = $1
            `;
            const result = await this.pool.query(query, [id]);
            return result.rows.length === 0 ? null : await this.mapRowToTrade(result.rows[0]);
        } catch (error) {
            console.error('PostgreSQL error:', error);
            throw error;
        }
    }

    async getByStockId(stockId: string): Promise<Trade[]> {
        try {
            const query = `
                SELECT t.*, s.symbol, s.name, s.current_price
                FROM trades t
                JOIN stocks s ON t.stock_id = s.id
                WHERE t.stock_id = $1
                ORDER BY t.created_at DESC
            `;
            const result = await this.pool.query(query, [stockId]);
            return Promise.all(result.rows.map(row => this.mapRowToTrade(row)));
        } catch (error) {
            console.error('PostgreSQL error:', error);
            throw error;
        }
    }

    async getByBuyerId(buyerId: string): Promise<Trade[]> {
        try {
            const query = `
                SELECT t.*, s.symbol, s.name, s.current_price
                FROM trades t
                JOIN stocks s ON t.stock_id = s.id
                WHERE t.buyer_id = $1
                ORDER BY t.created_at DESC
            `;
            const result = await this.pool.query(query, [buyerId]);
            return Promise.all(result.rows.map(row => this.mapRowToTrade(row)));
        } catch (error) {
            console.error('PostgreSQL error:', error);
            throw error;
        }
    }

    async getBySellerId(sellerId: string): Promise<Trade[]> {
        try {
            const query = `
                SELECT t.*, s.symbol, s.name, s.current_price
                FROM trades t
                JOIN stocks s ON t.stock_id = s.id
                WHERE t.seller_id = $1
                ORDER BY t.created_at DESC
            `;
            const result = await this.pool.query(query, [sellerId]);
            return Promise.all(result.rows.map(row => this.mapRowToTrade(row)));
        } catch (error) {
            console.error('PostgreSQL error:', error);
            throw error;
        }
    }

    async getByUserId(userId: string): Promise<Trade[]> {
        try {
            const query = `
                SELECT t.*, s.symbol, s.name, s.current_price
                FROM trades t
                JOIN stocks s ON t.stock_id = s.id
                WHERE t.buyer_id = $1 OR t.seller_id = $1
                ORDER BY t.created_at DESC
            `;
            const result = await this.pool.query(query, [userId]);
            return Promise.all(result.rows.map(row => this.mapRowToTrade(row)));
        } catch (error) {
            console.error('PostgreSQL error:', error);
            throw error;
        }
    }

    async getRecentTrades(limit: number): Promise<Trade[]> {
        try {
            const query = `
                SELECT t.*, s.symbol, s.name, s.current_price
                FROM trades t
                JOIN stocks s ON t.stock_id = s.id
                ORDER BY t.created_at DESC
                LIMIT $1
            `;
            const result = await this.pool.query(query, [limit]);
            return Promise.all(result.rows.map(row => this.mapRowToTrade(row)));
        } catch (error) {
            console.error('PostgreSQL error:', error);
            throw error;
        }
    }

    async getAll(): Promise<Trade[]> {
        try {
            const query = `
                SELECT t.*, s.symbol, s.name, s.current_price
                FROM trades t
                JOIN stocks s ON t.stock_id = s.id
                ORDER BY t.created_at DESC
            `;
            const result = await this.pool.query(query);
            return Promise.all(result.rows.map(row => this.mapRowToTrade(row)));
        } catch (error) {
            console.error('PostgreSQL error:', error);
            throw error;
        }
    }

    private async mapRowToTrade(row: any): Promise<Trade> {
        const stock = new Stock(
            row.stock_id,
            row.symbol,
            row.name,
            null,
            parseFloat(row.current_price),
            null,
            null,
            null,
            0,
            true,
            [],
            new Date(),
            new Date()
        );

        const placeholderUser = new User(
            '',
            '',
            '',
            '',
            '',
            '',
            UserRole.CLIENT,
            UserState.ACTIVE,
            [],
            [],
            [],
            new Date()
        );

        const placeholderOrderBook = new OrderBook(
            '',
            stock,
            placeholderUser,
            OrderSide.BID,
            OrderBookType.MARKET,
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
            placeholderUser,
            placeholderUser,
            placeholderOrderBook,
            placeholderOrderBook,
            parseFloat(row.quantity),
            parseFloat(row.price),
            parseFloat(row.buyer_fee),
            parseFloat(row.seller_fee),
            new Date(row.created_at)
        );
    }
}

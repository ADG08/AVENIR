SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- =========================================
-- TRADES - AAPL
-- =========================================

INSERT IGNORE INTO trades (id, stock_id, buyer_id, seller_id, buy_order_id, sell_order_id, quantity, price, buyer_fee, seller_fee, created_at)
VALUES
(
    'trade_aapl_1',
    'stock_1',
    'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',  -- Sophie Dubois (buyer)
    'a8c2f3e1-5b9d-4a2c-8f6e-1d4b7c9e2a5f',  -- Hugo Laurent (seller)
    'ob_bid_aapl_1',
    'ob_ask_aapl_1',
    5.00,
    192.00,
    1.00,
    1.00,
    DATE_SUB(NOW(), INTERVAL 2 HOUR)
),
(
    'trade_aapl_2',
    'stock_1',
    'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',  -- Lucas Petit (buyer)
    'b9d3e4f2-6c0e-5b3d-9a7f-2e5c8d0f3b6a',  -- Léa Simon (seller)
    'ob_bid_aapl_2',
    'ob_ask_aapl_2',
    3.50,
    191.80,
    1.00,
    1.00,
    DATE_SUB(NOW(), INTERVAL 90 MINUTE)
),
(
    'trade_aapl_3',
    'stock_1',
    'f7f35a80-0a07-4f07-a429-70be5f5c4d86',  -- Emma Moreau (buyer) - partial fill
    'a8c2f3e1-5b9d-4a2c-8f6e-1d4b7c9e2a5f',  -- Hugo Laurent (seller)
    'ob_bid_aapl_3',
    'ob_ask_aapl_1',
    5.00,
    191.50,
    1.00,
    1.00,
    DATE_SUB(NOW(), INTERVAL 1 HOUR)
);

-- =========================================
-- TRADES - GOOGL
-- =========================================

INSERT IGNORE INTO trades (id, stock_id, buyer_id, seller_id, buy_order_id, sell_order_id, quantity, price, buyer_fee, seller_fee, created_at)
VALUES
(
    'trade_googl_1',
    'stock_2',
    'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',  -- Sophie Dubois (buyer)
    'd1f5a6b4-8e2a-7d5f-1c9b-4a7e0f2b5d8c',  -- Marie Martin (seller)
    'ob_bid_googl_1',
    'ob_ask_googl_1',
    8.00,
    175.25,
    1.00,
    1.00,
    DATE_SUB(NOW(), INTERVAL 50 MINUTE)
);

-- =========================================
-- TRADES - NVDA
-- =========================================

INSERT IGNORE INTO trades (id, stock_id, buyer_id, seller_id, buy_order_id, sell_order_id, quantity, price, buyer_fee, seller_fee, created_at)
VALUES
(
    'trade_nvda_1',
    'stock_7',
    'f7f35a80-0a07-4f07-a429-70be5f5c4d86',  -- Emma Moreau (buyer)
    'f3b7c8d6-0a4c-9f7b-3e1d-6c9a2b4d7f0e',  -- Pierre Durand (seller)
    'ob_bid_nvda_1',
    'ob_ask_nvda_1',
    12.00,
    147.00,
    1.00,
    1.00,
    DATE_SUB(NOW(), INTERVAL 40 MINUTE)
);

-- =========================================
-- TRADES - META
-- =========================================

INSERT IGNORE INTO trades (id, stock_id, buyer_id, seller_id, buy_order_id, sell_order_id, quantity, price, buyer_fee, seller_fee, created_at)
VALUES
(
    'trade_meta_1',
    'stock_5',
    'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    'd1f5a6b4-8e2a-7d5f-1c9b-4a7e0f2b5d8c',
    'ob_bid_meta_1',
    'ob_ask_meta_1',
    2.50,
    512.50,
    1.00,
    1.00,
    DATE_SUB(NOW(), INTERVAL 30 MINUTE)
);

-- =========================================
-- TRADES - TSLA
-- =========================================

INSERT IGNORE INTO trades (id, stock_id, buyer_id, seller_id, buy_order_id, sell_order_id, quantity, price, buyer_fee, seller_fee, created_at)
VALUES
(
    'trade_tsla_1',
    'stock_6',
    'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',  -- Lucas Petit (buyer)
    'e2a6b7c5-9f3b-8e6a-2d0c-5b8f1a3c6e9d',  -- Thomas Bernard (seller)
    'ob_bid_tsla_1',
    'ob_ask_tsla_1',
    10.00,
    244.75,
    1.00,
    1.00,
    DATE_SUB(NOW(), INTERVAL 20 MINUTE)
);

-- =========================================
-- TRADES - AMD
-- =========================================

INSERT IGNORE INTO trades (id, stock_id, buyer_id, seller_id, buy_order_id, sell_order_id, quantity, price, buyer_fee, seller_fee, created_at)
VALUES
(
    'trade_amd_1',
    'stock_9',
    'a8c2f3e1-5b9d-4a2c-8f6e-1d4b7c9e2a5f',
    'e2a6b7c5-9f3b-8e6a-2d0c-5b8f1a3c6e9d',
    'ob_bid_amd_1',
    'ob_ask_amd_1',
    8.00,
    162.50,
    1.00,
    1.00,
    DATE_SUB(NOW(), INTERVAL 15 MINUTE)
);

-- Vérification de l'historique des trades
SELECT
    s.symbol,
    DATE_FORMAT(t.created_at, '%Y-%m-%d %H:00:00') as trade_hour,
    COUNT(*) as total_trades,
    SUM(t.quantity) as total_volume,
    AVG(t.price) as avg_price,
    MIN(t.price) as min_price,
    MAX(t.price) as max_price
FROM trades t
JOIN stocks s ON t.stock_id = s.id
GROUP BY s.symbol, DATE_FORMAT(t.created_at, '%Y-%m-%d %H:00:00')
ORDER BY trade_hour DESC, s.symbol;

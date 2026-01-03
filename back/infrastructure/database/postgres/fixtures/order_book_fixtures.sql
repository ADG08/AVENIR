SET client_encoding = 'UTF8';

-- =========================================
-- ORDRES BID (ACHATS) - AAPL
-- =========================================

INSERT INTO order_book (id, stock_id, user_id, side, order_type, quantity, remaining_quantity, limit_price, stop_price, state, created_at, updated_at)
VALUES
(
    'ob_bid_aapl_1',
    'stock_1',
    'd4e5f6a7-8b9c-4d0e-af3a-4b5c6d7e8f9a',  -- Sophie Dubois
    'BID',
    'LIMIT',
    10.00,
    10.00,
    191.50,
    NULL,
    'PENDING',
    NOW() - INTERVAL '30 minutes',
    NOW()
),
(
    'ob_bid_aapl_2',
    'stock_1',
    'e5f6a7b8-9c0d-41e2-bf4a-5c6d7e8f9a0b',  -- Lucas Petit
    'BID',
    'LIMIT',
    5.00,
    5.00,
    191.00,
    NULL,
    'PENDING',
    NOW() - INTERVAL '25 minutes',
    NOW()
),
(
    'ob_bid_aapl_3',
    'stock_1',
    'f6a7b8c9-0d1e-42f3-8f5b-6d7e8f9a0b1c',  -- Emma Moreau
    'BID',
    'LIMIT',
    20.00,
    15.00,
    190.50,
    NULL,
    'PARTIAL',
    NOW() - INTERVAL '1 hour',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- ORDRES ASK (VENTES) - AAPL
-- =========================================

INSERT INTO order_book (id, stock_id, user_id, side, order_type, quantity, remaining_quantity, limit_price, stop_price, state, created_at, updated_at)
VALUES
(
    'ob_ask_aapl_1',
    'stock_1',
    'a7b8c9d0-1e2f-43a4-9f6c-7e8f9a0b1c2d',  -- Hugo Laurent
    'ASK',
    'LIMIT',
    8.00,
    8.00,
    192.50,
    NULL,
    'PENDING',
    NOW() - INTERVAL '20 minutes',
    NOW()
),
(
    'ob_ask_aapl_2',
    'stock_1',
    'b8c9d0e1-2f3a-44b5-af7d-8f9a0b1c2d3e',  -- Léa Simon
    'ASK',
    'LIMIT',
    15.00,
    15.00,
    193.00,
    NULL,
    'PENDING',
    NOW() - INTERVAL '15 minutes',
    NOW()
),
(
    'ob_ask_aapl_stop',
    'stock_1',
    'b8c9d0e1-2f3a-44b5-af7d-8f9a0b1c2d3e',  -- Léa Simon
    'ASK',
    'STOP',
    5.00,
    5.00,
    NULL,
    185.00,
    'PENDING',
    NOW() - INTERVAL '10 minutes',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- ORDRES HUGO LAURENT - AAPL (LIMIT BUY & SELL)
-- =========================================

INSERT INTO order_book (id, stock_id, user_id, side, order_type, quantity, remaining_quantity, limit_price, stop_price, state, created_at, updated_at)
VALUES
-- LIMIT BUY orders (Hugo veut acheter à des prix plus bas)
(
    'ob_hugo_bid_aapl_1',
    'stock_1',
    'd0e1f2a3-4b5c-46d7-8f9f-0b1c2d3e4f5a',  -- Hugo Laurent
    'BID',
    'LIMIT',
    50.00,
    50.00,
    190.00,
    NULL,
    'PENDING',
    NOW() - INTERVAL '2 hours',
    NOW()
),
(
    'ob_hugo_bid_aapl_2',
    'stock_1',
    'd0e1f2a3-4b5c-46d7-8f9f-0b1c2d3e4f5a',  -- Hugo Laurent
    'BID',
    'LIMIT',
    100.00,
    100.00,
    188.50,
    NULL,
    'PENDING',
    NOW() - INTERVAL '1 hour',
    NOW()
),
(
    'ob_hugo_bid_aapl_3',
    'stock_1',
    'd0e1f2a3-4b5c-46d7-8f9f-0b1c2d3e4f5a',  -- Hugo Laurent
    'BID',
    'LIMIT',
    75.00,
    75.00,
    185.00,
    NULL,
    'PENDING',
    NOW() - INTERVAL '3 hours',
    NOW()
),
-- LIMIT SELL orders (Hugo veut vendre à des prix plus hauts)
(
    'ob_hugo_ask_aapl_1',
    'stock_1',
    'd0e1f2a3-4b5c-46d7-8f9f-0b1c2d3e4f5a',  -- Hugo Laurent
    'ASK',
    'LIMIT',
    100.00,
    100.00,
    195.00,
    NULL,
    'PENDING',
    NOW() - INTERVAL '90 minutes',
    NOW()
),
(
    'ob_hugo_ask_aapl_2',
    'stock_1',
    'd0e1f2a3-4b5c-46d7-8f9f-0b1c2d3e4f5a',  -- Hugo Laurent
    'ASK',
    'LIMIT',
    150.00,
    150.00,
    197.50,
    NULL,
    'PENDING',
    NOW() - INTERVAL '2 hours',
    NOW()
),
(
    'ob_hugo_ask_aapl_3',
    'stock_1',
    'd0e1f2a3-4b5c-46d7-8f9f-0b1c2d3e4f5a',  -- Hugo Laurent
    'ASK',
    'LIMIT',
    200.00,
    200.00,
    200.00,
    NULL,
    'PENDING',
    NOW() - INTERVAL '4 hours',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- ORDRES - GOOGL
-- =========================================

INSERT INTO order_book (id, stock_id, user_id, side, order_type, quantity, remaining_quantity, limit_price, stop_price, state, created_at, updated_at)
VALUES
(
    'ob_bid_googl_1',
    'stock_2',
    'd4e5f6a7-8b9c-4d0e-af3a-4b5c6d7e8f9a',  -- Sophie Dubois
    'BID',
    'LIMIT',
    12.00,
    12.00,
    175.00,
    NULL,
    'PENDING',
    NOW() - INTERVAL '45 minutes',
    NOW()
),
(
    'ob_ask_googl_1',
    'stock_2',
    'b2c3d4e5-6f7a-4b9c-8d1e-2f3a4b5c6d7e',  -- Marie Martin
    'ASK',
    'LIMIT',
    10.00,
    10.00,
    175.50,
    NULL,
    'PENDING',
    NOW() - INTERVAL '40 minutes',
    NOW()
),
(
    'ob_system_ask_googl_1',
    'stock_2',
    'b2c3d4e5-6f7a-4b9c-8d1e-2f3a4b5c6d7e',  -- Marie Martin
    'ASK',
    'LIMIT',
    1000.00,
    1000.00,
    176.00,
    NULL,
    'PENDING',
    NOW() - INTERVAL '2 hours',
    NOW()
),
(
    'ob_system_ask_googl_2',
    'stock_2',
    'd4e5f6a7-8b9c-4d0e-af3a-4b5c6d7e8f9a',  -- Sophie Dubois
    'ASK',
    'LIMIT',
    500.00,
    500.00,
    176.50,
    NULL,
    'PENDING',
    NOW() - INTERVAL '3 hours',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- ORDRES - NVDA
-- =========================================

INSERT INTO order_book (id, stock_id, user_id, side, order_type, quantity, remaining_quantity, limit_price, stop_price, state, created_at, updated_at)
VALUES
(
    'ob_bid_nvda_1',
    'stock_7',
    'f6a7b8c9-0d1e-42f3-8f5b-6d7e8f9a0b1c',  -- Emma Moreau
    'BID',
    'LIMIT',
    25.00,
    25.00,
    146.50,
    NULL,
    'PENDING',
    NOW() - INTERVAL '35 minutes',
    NOW()
),
(
    'ob_ask_nvda_1',
    'stock_7',
    'a1b2c3d4-5e6f-4a8b-9c0d-1e2f3a4b5c6d',  -- Pierre Durand (Director)
    'ASK',
    'LIMIT',
    18.00,
    18.00,
    147.50,
    NULL,
    'PENDING',
    NOW() - INTERVAL '30 minutes',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- ORDRES - TSLA
-- =========================================

INSERT INTO order_book (id, stock_id, user_id, side, order_type, quantity, remaining_quantity, limit_price, stop_price, state, created_at, updated_at)
VALUES
(
    'ob_bid_tsla_1',
    'stock_6',
    'e5f6a7b8-9c0d-41e2-bf4a-5c6d7e8f9a0b',  -- Lucas Petit
    'BID',
    'LIMIT',
    15.00,
    15.00,
    244.00,
    NULL,
    'PENDING',
    NOW() - INTERVAL '50 minutes',
    NOW()
),
(
    'ob_ask_tsla_1',
    'stock_6',
    'c3d4e5f6-7a8b-4c9d-9e2f-3a4b5c6d7e8f',  -- Thomas Bernard
    'ASK',
    'LIMIT',
    10.00,
    10.00,
    246.00,
    NULL,
    'PENDING',
    NOW() - INTERVAL '28 minutes',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- ORDRES - META
-- =========================================

INSERT INTO order_book (id, stock_id, user_id, side, order_type, quantity, remaining_quantity, limit_price, stop_price, state, created_at, updated_at)
VALUES
(
    'ob_bid_meta_1',
    'stock_5',
    'e5f6a7b8-9c0d-41e2-bf4a-5c6d7e8f9a0b',
    'BID',
    'LIMIT',
    2.50,
    0.00,
    512.00,
    NULL,
    'FILLED',
    NOW() - INTERVAL '35 minutes',
    NOW()
),
(
    'ob_ask_meta_1',
    'stock_5',
    'b2c3d4e5-6f7a-4b9c-8d1e-2f3a4b5c6d7e',
    'ASK',
    'LIMIT',
    2.50,
    0.00,
    512.50,
    NULL,
    'FILLED',
    NOW() - INTERVAL '35 minutes',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- ORDRES - AMD
-- =========================================

INSERT INTO order_book (id, stock_id, user_id, side, order_type, quantity, remaining_quantity, limit_price, stop_price, state, created_at, updated_at)
VALUES
(
    'ob_bid_amd_1',
    'stock_9',
    'a7b8c9d0-1e2f-43a4-9f6c-7e8f9a0b1c2d',
    'BID',
    'LIMIT',
    8.00,
    0.00,
    162.00,
    NULL,
    'FILLED',
    NOW() - INTERVAL '20 minutes',
    NOW()
),
(
    'ob_ask_amd_1',
    'stock_9',
    'c3d4e5f6-7a8b-4c9d-9e2f-3a4b5c6d7e8f',
    'ASK',
    'LIMIT',
    8.00,
    0.00,
    162.50,
    NULL,
    'FILLED',
    NOW() - INTERVAL '20 minutes',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- ORDRES MARKET (exécution immédiate)
-- =========================================

INSERT INTO order_book (id, stock_id, user_id, side, order_type, quantity, remaining_quantity, limit_price, stop_price, state, created_at, updated_at)
VALUES
(
    'ob_market_msft_1',
    'stock_3',
    'a7b8c9d0-1e2f-43a4-9f6c-7e8f9a0b1c2d',
    'BID',
    'MARKET',
    5.00,
    5.00,
    NULL,
    NULL,
    'PENDING',
    NOW() - INTERVAL '5 minutes',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- ORDRES SYSTÈME ASK (Liquidité pour ACHETER)
-- =========================================
-- Ces ordres permettent aux utilisateurs d'acheter immédiatement au prix du marché

INSERT INTO order_book (id, stock_id, user_id, side, order_type, quantity, remaining_quantity, limit_price, stop_price, state, created_at, updated_at)
VALUES
-- AAPL - Apple Inc.
('ob_system_ask_aapl', 'stock_1', 'SYSTEM', 'ASK', 'LIMIT', 1000.00, 1000.00, 192.00, NULL, 'PENDING', NOW(), NOW()),

-- GOOGL - Alphabet Inc.
('ob_system_ask_googl', 'stock_2', 'SYSTEM', 'ASK', 'LIMIT', 7500.00, 7500.00, 175.40, NULL, 'PENDING', NOW(), NOW()),

-- MSFT - Microsoft Corporation
('ob_system_ask_msft', 'stock_3', 'SYSTEM', 'ASK', 'LIMIT', 1000.00, 1000.00, 420.50, NULL, 'PENDING', NOW(), NOW()),

-- AMZN - Amazon.com Inc.
('ob_system_ask_amzn', 'stock_4', 'SYSTEM', 'ASK', 'LIMIT', 1000.00, 1000.00, 178.30, NULL, 'PENDING', NOW(), NOW()),

-- META - Meta Platforms Inc.
('ob_system_ask_meta', 'stock_5', 'SYSTEM', 'ASK', 'LIMIT', 1000.00, 1000.00, 512.75, NULL, 'PENDING', NOW(), NOW()),

-- TSLA - Tesla Inc.
('ob_system_ask_tsla', 'stock_6', 'SYSTEM', 'ASK', 'LIMIT', 1000.00, 1000.00, 245.10, NULL, 'PENDING', NOW(), NOW()),

-- NVDA - NVIDIA Corporation
('ob_system_ask_nvda', 'stock_7', 'SYSTEM', 'ASK', 'LIMIT', 1000.00, 1000.00, 147.00, NULL, 'PENDING', NOW(), NOW()),

-- NFLX - Netflix Inc.
('ob_system_ask_nflx', 'stock_8', 'SYSTEM', 'ASK', 'LIMIT', 1000.00, 1000.00, 685.20, NULL, 'PENDING', NOW(), NOW()),

-- AMD - Advanced Micro Devices Inc.
('ob_system_ask_amd', 'stock_9', 'SYSTEM', 'ASK', 'LIMIT', 1000.00, 1000.00, 162.25, NULL, 'PENDING', NOW(), NOW()),

-- DIS - The Walt Disney Company
('ob_system_ask_dis', 'stock_10', 'SYSTEM', 'ASK', 'LIMIT', 1000.00, 1000.00, 95.80, NULL, 'PENDING', NOW(), NOW()),

-- ABNB - Airbnb Inc.
('ob_system_ask_abnb', 'stock_11', 'SYSTEM', 'ASK', 'LIMIT', 1000.00, 1000.00, 134.50, NULL, 'PENDING', NOW(), NOW()),

-- UBER - Uber Technologies Inc.
('ob_system_ask_uber', 'stock_12', 'SYSTEM', 'ASK', 'LIMIT', 1000.00, 1000.00, 68.40, NULL, 'PENDING', NOW(), NOW())

ON CONFLICT (id) DO NOTHING;

-- =========================================
-- ORDRES SYSTÈME BID (Liquidité pour VENDRE)
-- =========================================
-- Ces ordres permettent aux utilisateurs de vendre immédiatement au prix du marché

INSERT INTO order_book (id, stock_id, user_id, side, order_type, quantity, remaining_quantity, limit_price, stop_price, state, created_at, updated_at)
VALUES
-- AAPL - Apple Inc. (légèrement sous le prix ASK)
('ob_system_bid_aapl', 'stock_1', 'SYSTEM', 'BID', 'LIMIT', 1000.00, 1000.00, 191.00, NULL, 'PENDING', NOW(), NOW()),

-- GOOGL - Alphabet Inc.
('ob_system_bid_googl', 'stock_2', 'SYSTEM', 'BID', 'LIMIT', 7500.00, 7500.00, 175.20, NULL, 'PENDING', NOW(), NOW()),

-- MSFT - Microsoft Corporation
('ob_system_bid_msft', 'stock_3', 'SYSTEM', 'BID', 'LIMIT', 1000.00, 1000.00, 419.50, NULL, 'PENDING', NOW(), NOW()),

-- AMZN - Amazon.com Inc.
('ob_system_bid_amzn', 'stock_4', 'SYSTEM', 'BID', 'LIMIT', 1000.00, 1000.00, 177.30, NULL, 'PENDING', NOW(), NOW()),

-- META - Meta Platforms Inc.
('ob_system_bid_meta', 'stock_5', 'SYSTEM', 'BID', 'LIMIT', 1000.00, 1000.00, 511.75, NULL, 'PENDING', NOW(), NOW()),

-- TSLA - Tesla Inc.
('ob_system_bid_tsla', 'stock_6', 'SYSTEM', 'BID', 'LIMIT', 1000.00, 1000.00, 244.10, NULL, 'PENDING', NOW(), NOW()),

-- NVDA - NVIDIA Corporation
('ob_system_bid_nvda', 'stock_7', 'SYSTEM', 'BID', 'LIMIT', 1000.00, 1000.00, 146.00, NULL, 'PENDING', NOW(), NOW()),

-- NFLX - Netflix Inc.
('ob_system_bid_nflx', 'stock_8', 'SYSTEM', 'BID', 'LIMIT', 1000.00, 1000.00, 684.20, NULL, 'PENDING', NOW(), NOW()),

-- AMD - Advanced Micro Devices Inc.
('ob_system_bid_amd', 'stock_9', 'SYSTEM', 'BID', 'LIMIT', 1000.00, 1000.00, 161.25, NULL, 'PENDING', NOW(), NOW()),

-- DIS - The Walt Disney Company
('ob_system_bid_dis', 'stock_10', 'SYSTEM', 'BID', 'LIMIT', 1000.00, 1000.00, 94.80, NULL, 'PENDING', NOW(), NOW()),

-- ABNB - Airbnb Inc.
('ob_system_bid_abnb', 'stock_11', 'SYSTEM', 'BID', 'LIMIT', 1000.00, 1000.00, 133.50, NULL, 'PENDING', NOW(), NOW()),

-- UBER - Uber Technologies Inc.
('ob_system_bid_uber', 'stock_12', 'SYSTEM', 'BID', 'LIMIT', 1000.00, 1000.00, 67.40, NULL, 'PENDING', NOW(), NOW())

ON CONFLICT (id) DO NOTHING;

-- Vérification du carnet d'ordres
SELECT
    s.symbol,
    ob.side,
    ob.order_type,
    COUNT(*) as total_orders,
    SUM(ob.remaining_quantity) as total_quantity,
    AVG(ob.limit_price) as avg_price
FROM order_book ob
JOIN stocks s ON ob.stock_id = s.id
WHERE ob.state IN ('PENDING', 'PARTIAL')
GROUP BY s.symbol, ob.side, ob.order_type
ORDER BY s.symbol, ob.side;

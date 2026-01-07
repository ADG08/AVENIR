SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- =========================================
-- ACTIONS DU DIRECTEUR (Pierre Durand)
-- =========================================

INSERT IGNORE INTO user_actions (id, user_id, action_type, description, metadata, created_at)
VALUES
(
    'ua_dir_1',
    'a1b2c3d4-5e6f-4a8b-9c0d-1e2f3a4b5c6d',
    'LOGIN',
    'Connexion réussie depuis le bureau',
    '{"ip": "192.168.1.100", "device": "Chrome/MacOS", "location": "Paris, France"}',
    DATE_SUB(NOW(), INTERVAL 4 HOUR)
),
(
    'ua_dir_2',
    'a1b2c3d4-5e6f-4a8b-9c0d-1e2f3a4b5c6d',
    'ORDER_CREATED',
    'Création ordre de vente NVDA',
    '{"stock": "NVDA", "quantity": 18, "type": "LIMIT", "price": 147.50, "side": "ASK"}',
    DATE_SUB(NOW(), INTERVAL 3 HOUR)
),
(
    'ua_dir_3',
    'a1b2c3d4-5e6f-4a8b-9c0d-1e2f3a4b5c6d',
    'PORTFOLIO_VIEW',
    'Consultation du dashboard',
    '{"page": "investment"}',
    DATE_SUB(NOW(), INTERVAL 150 MINUTE)
);

-- =========================================
-- ACTIONS CONSEILLER 1 (Marie Martin)
-- =========================================

INSERT IGNORE INTO user_actions (id, user_id, action_type, description, metadata, created_at)
VALUES
(
    'ua_adv1_1',
    'b2c3d4e5-6f7a-4b9c-8d1e-2f3a4b5c6d7e',
    'LOGIN',
    'Connexion réussie',
    '{"ip": "192.168.1.105", "device": "Firefox/Windows", "location": "Lyon, France"}',
    DATE_SUB(NOW(), INTERVAL 3 HOUR)
),
(
    'ua_adv1_2',
    'b2c3d4e5-6f7a-4b9c-8d1e-2f3a4b5c6d7e',
    'ORDER_CREATED',
    'Création ordre de vente GOOGL',
    '{"stock": "GOOGL", "quantity": 10, "type": "LIMIT", "price": 175.50, "side": "ASK"}',
    DATE_SUB(NOW(), INTERVAL 2 HOUR)
),
(
    'ua_adv1_3',
    'b2c3d4e5-6f7a-4b9c-8d1e-2f3a4b5c6d7e',
    'CHAT_OPENED',
    'Ouverture chat avec client',
    '{"chat_id": "chat_123", "client_name": "Sophie Dubois"}',
    DATE_SUB(NOW(), INTERVAL 90 MINUTE)
);

-- =========================================
-- ACTIONS CLIENT 1 (Sophie Dubois)
-- =========================================

INSERT IGNORE INTO user_actions (id, user_id, action_type, description, metadata, created_at)
VALUES
(
    'ua_cli1_1',
    'd4e5f6a7-8b9c-4d0e-af3a-4b5c6d7e8f9a',
    'LOGIN',
    'Connexion réussie',
    '{"ip": "192.168.1.200", "device": "Safari/iOS", "location": "Paris, France"}',
    DATE_SUB(NOW(), INTERVAL 2 HOUR)
),
(
    'ua_cli1_2',
    'd4e5f6a7-8b9c-4d0e-af3a-4b5c6d7e8f9a',
    'ORDER_CREATED',
    'Création ordre d\'achat AAPL',
    '{"stock": "AAPL", "quantity": 10, "type": "LIMIT", "price": 191.50, "side": "BID"}',
    DATE_SUB(NOW(), INTERVAL 90 MINUTE)
),
(
    'ua_cli1_3',
    'd4e5f6a7-8b9c-4d0e-af3a-4b5c6d7e8f9a',
    'PORTFOLIO_VIEW',
    'Consultation du portefeuille',
    '{"total_value": 17725, "profit_loss": 450}',
    DATE_SUB(NOW(), INTERVAL 45 MINUTE)
),
(
    'ua_cli1_4',
    'd4e5f6a7-8b9c-4d0e-af3a-4b5c6d7e8f9a',
    'STOCK_DETAIL_VIEW',
    'Consultation détail action NVDA',
    '{"stock": "NVDA", "current_price": 147.00}',
    DATE_SUB(NOW(), INTERVAL 30 MINUTE)
);

-- =========================================
-- ACTIONS CLIENT 2 (Lucas Petit)
-- =========================================

INSERT IGNORE INTO user_actions (id, user_id, action_type, description, metadata, created_at)
VALUES
(
    'ua_cli2_1',
    'e5f6a7b8-9c0d-41e2-bf4a-5c6d7e8f9a0b',
    'LOGIN',
    'Connexion réussie',
    '{"ip": "192.168.1.201", "device": "Chrome/Android", "location": "Marseille, France"}',
    DATE_SUB(NOW(), INTERVAL 90 MINUTE)
),
(
    'ua_cli2_2',
    'e5f6a7b8-9c0d-41e2-bf4a-5c6d7e8f9a0b',
    'ORDER_CREATED',
    'Création ordre d\'achat TSLA',
    '{"stock": "TSLA", "quantity": 15, "type": "LIMIT", "price": 244.00, "side": "BID"}',
    DATE_SUB(NOW(), INTERVAL 70 MINUTE)
),
(
    'ua_cli2_3',
    'e5f6a7b8-9c0d-41e2-bf4a-5c6d7e8f9a0b',
    'TRADE_EXECUTED',
    'Trade exécuté - Achat AAPL',
    '{"trade_id": "trade_aapl_2", "quantity": 3.50, "price": 191.80}',
    DATE_SUB(NOW(), INTERVAL 50 MINUTE)
);

-- =========================================
-- ACTIONS CLIENT 3 (Emma Moreau)
-- =========================================

INSERT IGNORE INTO user_actions (id, user_id, action_type, description, metadata, created_at)
VALUES
(
    'ua_cli3_1',
    'f7f35a80-0a07-4f07-a429-70be5f5c4d86',
    'LOGIN',
    'Connexion réussie',
    '{"ip": "192.168.1.202", "device": "Edge/Windows", "location": "Toulouse, France"}',
    DATE_SUB(NOW(), INTERVAL 75 MINUTE)
),
(
    'ua_cli3_2',
    'f7f35a80-0a07-4f07-a429-70be5f5c4d86',
    'ORDER_CREATED',
    'Création ordre d\'achat AAPL',
    '{"stock": "AAPL", "quantity": 20, "type": "LIMIT", "price": 190.50, "side": "BID"}',
    DATE_SUB(NOW(), INTERVAL 65 MINUTE)
),
(
    'ua_cli3_3',
    'f7f35a80-0a07-4f07-a429-70be5f5c4d86',
    'TRADE_EXECUTED',
    'Trade partiellement exécuté - Achat AAPL',
    '{"trade_id": "trade_aapl_3", "quantity": 5, "filled_quantity": 5, "remaining": 15}',
    DATE_SUB(NOW(), INTERVAL 55 MINUTE)
);

-- =========================================
-- ACTIONS CLIENT 4 (Hugo Laurent)
-- =========================================

INSERT IGNORE INTO user_actions (id, user_id, action_type, description, metadata, created_at)
VALUES
(
    'ua_cli4_1',
    'a7b8c9d0-1e2f-43a4-9f6c-7e8f9a0b1c2d',
    'LOGIN',
    'Connexion réussie',
    '{"ip": "192.168.1.203", "device": "Safari/MacOS", "location": "Bordeaux, France"}',
    DATE_SUB(NOW(), INTERVAL 40 MINUTE)
),
(
    'ua_cli4_2',
    'a7b8c9d0-1e2f-43a4-9f6c-7e8f9a0b1c2d',
    'ORDER_CREATED',
    'Création ordre MARKET achat MSFT',
    '{"stock": "MSFT", "quantity": 5, "type": "MARKET", "side": "BID"}',
    DATE_SUB(NOW(), INTERVAL 25 MINUTE)
);

-- =========================================
-- ACTIONS CLIENT 5 (Léa Simon)
-- =========================================

INSERT IGNORE INTO user_actions (id, user_id, action_type, description, metadata, created_at)
VALUES
(
    'ua_cli5_1',
    'b8c9d0e1-2f3a-44b5-af7d-8f9a0b1c2d3e',
    'LOGIN',
    'Connexion réussie',
    '{"ip": "192.168.1.204", "device": "Chrome/Linux", "location": "Lille, France"}',
    DATE_SUB(NOW(), INTERVAL 35 MINUTE)
),
(
    'ua_cli5_2',
    'b8c9d0e1-2f3a-44b5-af7d-8f9a0b1c2d3e',
    'ORDER_CREATED',
    'Création ordre STOP loss AAPL',
    '{"stock": "AAPL", "quantity": 5, "type": "STOP", "stop_price": 185.00, "side": "ASK"}',
    DATE_SUB(NOW(), INTERVAL 20 MINUTE)
),
(
    'ua_cli5_3',
    'b8c9d0e1-2f3a-44b5-af7d-8f9a0b1c2d3e',
    'LOGOUT',
    'Déconnexion',
    '{"session_duration": "15m"}',
    DATE_SUB(NOW(), INTERVAL 5 MINUTE)
);

-- Vérification des actions par type
SELECT
    action_type,
    COUNT(*) as total_actions,
    COUNT(DISTINCT user_id) as unique_users
FROM user_actions
GROUP BY action_type
ORDER BY total_actions DESC;

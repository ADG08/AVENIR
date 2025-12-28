-- Fixtures pour les utilisateurs (MySQL)
-- Ce fichier contient les données de test pour le système d'utilisateurs

-- Définir l'encodage UTF-8
SET NAMES utf8mb4;
SET CHARACTER_SET_CLIENT = utf8mb4;

-- Nettoyer les données existantes (attention : cela supprimera aussi les chats et messages associés)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- DIRECTEUR (1)
-- =========================================

INSERT INTO users (id, first_name, last_name, email, identity_number, passcode, role, state, created_at, updated_at)
VALUES (
    'f3b7c8d6-0a4c-9f7b-3e1d-6c9a2b4d7f0e',
    'Pierre',
    'Durand',
    'pierre.durand@avenir-bank.fr',
    'DIR001',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'DIRECTOR',
    'ACTIVE',
    DATE_SUB(NOW(), INTERVAL 2 YEAR),
    NOW()
) ON DUPLICATE KEY UPDATE id = id;

-- =========================================
-- CONSEILLERS (3)
-- =========================================

INSERT INTO users (id, first_name, last_name, email, identity_number, passcode, role, state, created_at, updated_at)
VALUES
(
    'd1f5a6b4-8e2a-7d5f-1c9b-4a7e0f2b5d8c',
    'Marie',
    'Martin',
    'marie.martin@avenir-bank.fr',
    'ADV001',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'ADVISOR',
    'ACTIVE',
    DATE_SUB(NOW(), INTERVAL 1 YEAR),
    NOW()
),
(
    'e2a6b7c5-9f3b-8e6a-2d0c-5b8f1a3c6e9d',
    'Thomas',
    'Bernard',
    'thomas.bernard@avenir-bank.fr',
    'ADV002',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'ADVISOR',
    'ACTIVE',
    DATE_SUB(NOW(), INTERVAL 1 YEAR),
    NOW()
),
(
    'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    'Sophie',
    'Dubois',
    'sophie.dubois@avenir-bank.fr',
    'ADV003',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'ADVISOR',
    'ACTIVE',
    DATE_SUB(NOW(), INTERVAL 6 MONTH),
    NOW()
) ON DUPLICATE KEY UPDATE id = id; ON DUPLICATE KEY UPDATE id = id;

-- =========================================
-- CLIENTS (5)
-- =========================================

-- Clement Tine (utilisateur existant à préserver)
INSERT INTO users (id, first_name, last_name, email, identity_number, passcode, role, state, advisor_id, created_at, updated_at)
VALUES (
    'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    'Clement',
    'Tine',
    'clement.tine@example.com',
    'CLIENT001',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'CLIENT',
    'ACTIVE',
    'd1f5a6b4-8e2a-7d5f-1c9b-4a7e0f2b5d8c', -- Marie Martin
    DATE_SUB(NOW(), INTERVAL 6 MONTH),
    NOW()
) ON DUPLICATE KEY UPDATE id = id;

-- Autres clients
INSERT INTO users (id, first_name, last_name, email, identity_number, passcode, role, state, advisor_id, created_at, updated_at)
VALUES
(
    'f7f35a80-0a07-4f07-a429-70be5f5c4d86',
    'Jean',
    'Dupont',
    'jean.dupont@gmail.com',
    'CLI001',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'CLIENT',
    'ACTIVE',
    'd1f5a6b4-8e2a-7d5f-1c9b-4a7e0f2b5d8c', -- Marie Martin
    DATE_SUB(NOW(), INTERVAL 3 MONTH),
    NOW()
),
(
    'a8c2f3e1-5b9d-4a2c-8f6e-1d4b7c9e2a5f',
    'Emma',
    'Leroy',
    'emma.leroy@gmail.com',
    'CLI002',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'CLIENT',
    'ACTIVE',
    'e2a6b7c5-9f3b-8e6a-2d0c-5b8f1a3c6e9d', -- Thomas Bernard
    DATE_SUB(NOW(), INTERVAL 2 MONTH),
    NOW()
),
(
    'b9d3e4f2-6c0e-5b3d-9a7f-2e5c8d0f3b6a',
    'Lucas',
    'Moreau',
    'lucas.moreau@gmail.com',
    'CLI003',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'CLIENT',
    'ACTIVE',
    'e2a6b7c5-9f3b-8e6a-2d0c-5b8f1a3c6e9d', -- Thomas Bernard
    DATE_SUB(NOW(), INTERVAL 1 MONTH),
    NOW()
),
(
    'c0e4f5a3-7d1f-6c4e-0b8a-3f6d9e1a4c7b',
    'Léa',
    'Simon',
    'lea.simon@gmail.com',
    'CLI004',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'CLIENT',
    'ACTIVE',
    'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', -- Sophie Dubois
    DATE_SUB(NOW(), INTERVAL 2 WEEK),
    NOW()
),
(
    'd2e5f6a4-8b1c-7d2e-9f3a-0c4b8d5e1f2a',
    'Hugo',
    'Laurent',
    'hugo.laurent@gmail.com',
    'CLI005',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'CLIENT',
    'ACTIVE',
    'd1f5a6b4-8e2a-7d5f-1c9b-4a7e0f2b5d8c', -- Marie Martin
    DATE_SUB(NOW(), INTERVAL 1 WEEK),
    NOW()
) ON DUPLICATE KEY UPDATE id = id;

-- =========================================
-- COMPTES BANCAIRES pour quelques clients
-- =========================================

-- Comptes pour Clement Tine
INSERT INTO accounts (id, user_id, iban, name, type, balance, currency, card_number, card_holder_name, card_expiry_date, card_cvv, saving_rate_id, created_at, updated_at)
VALUES
(
    'acc-clement-tine-1',
    'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    'FR7612345678901234567890128',
    'Compte Courant - Clement Tine',
    'CURRENT',
    2500.00,
    'EUR',
    '4444444444444444',
    'CLEMENT TINE',
    '12/29',
    '321',
    NULL,
    DATE_SUB(NOW(), INTERVAL 6 MONTH),
    NOW()
),
(
    'acc-clement-tine-2',
    'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    'FR7612345678901234567890129',
    'Livret Épargne - Clement Tine',
    'SAVINGS',
    10000.00,
    'EUR',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    DATE_SUB(NOW(), INTERVAL 6 MONTH),
    NOW()
) ON DUPLICATE KEY UPDATE id = id;

-- Comptes pour Jean Dupont
INSERT INTO accounts (id, user_id, iban, name, type, balance, currency, card_number, card_holder_name, card_expiry_date, card_cvv, saving_rate_id, created_at, updated_at)
VALUES
(
    'acc-client-001-1',
    'f7f35a80-0a07-4f07-a429-70be5f5c4d86',
    'FR7612345678901234567890130',
    'Compte Courant - Jean Dupont',
    'CURRENT',
    1500.00,
    'EUR',
    '4555555555555555',
    'JEAN DUPONT',
    '03/30',
    '654',
    NULL,
    DATE_SUB(NOW(), INTERVAL 3 MONTH),
    NOW()
) ON DUPLICATE KEY UPDATE id = id;

-- Comptes pour Emma Leroy
INSERT INTO accounts (id, user_id, iban, name, type, balance, currency, card_number, card_holder_name, card_expiry_date, card_cvv, saving_rate_id, created_at, updated_at)
VALUES
(
    'acc-client-002-1',
    'a8c2f3e1-5b9d-4a2c-8f6e-1d4b7c9e2a5f',
    'FR7612345678901234567890131',
    'Compte Courant - Emma Leroy',
    'CURRENT',
    3200.00,
    'EUR',
    '4666666666666666',
    'EMMA LEROY',
    '06/30',
    '789',
    NULL,
    DATE_SUB(NOW(), INTERVAL 2 MONTH),
    NOW()
),
(
    'acc-client-002-2',
    'a8c2f3e1-5b9d-4a2c-8f6e-1d4b7c9e2a5f',
    'FR7612345678901234567890132',
    'Livret Épargne - Emma Leroy',
    'SAVINGS',
    15000.00,
    'EUR',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    DATE_SUB(NOW(), INTERVAL 2 MONTH),
    NOW()
) ON DUPLICATE KEY UPDATE id = id;

-- =========================================
-- Résumé des données insérées
-- =========================================

SELECT
    'Utilisateurs créés' as type,
    role,
    COUNT(*) as count
FROM users
GROUP BY role
ORDER BY
    CASE role
        WHEN 'DIRECTOR' THEN 1
        WHEN 'ADVISOR' THEN 2
        WHEN 'CLIENT' THEN 3
    END;

SELECT
    'Comptes bancaires créés' as type,
    type as account_type,
    COUNT(*) as count,
    SUM(balance) as total_balance
FROM accounts
GROUP BY type;

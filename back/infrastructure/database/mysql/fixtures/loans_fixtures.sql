-- Fixtures pour les crédits (MySQL)
-- Ce fichier contient les données de test pour le système de crédits

-- Définir l'encodage UTF-8
SET NAMES utf8mb4;
SET CHARACTER_SET_CLIENT = utf8mb4;

-- Nettoyer les données existantes
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE loans;
-- SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- CRÉDITS DE TEST (5)
-- =========================================

-- Loan 1: Clement Tine - Crédit immobilier (advisor: Marie Martin)
INSERT INTO loans (id, name, advisor_id, client_id, amount, duration, annual_interest_rate, insurance_rate, monthly_payment, total_cost, total_interest, insurance_cost, paid_amount, status, created_at, updated_at, delivered_at, next_payment_date)
VALUES (
  'loan-001',
  'Crédit immobilier',
  'b2c3d4e5-6f7a-4b9c-8d1e-2f3a4b5c6d7e',
  'e5f6a7b8-9c0d-41e2-bf4a-5c6d7e8f9a0b',
  200000.00,
  240,
  3.50,
  0.36,
  1054.78,
  253147.20,
  52427.20,
  720.00,
  0.00,
  'ACTIVE',
  DATE_SUB(NOW(), INTERVAL 5 MINUTE),
  NOW(),
  DATE_SUB(NOW(), INTERVAL 5 MINUTE),
  DATE_ADD(NOW(), INTERVAL 2 MINUTE)
) ON DUPLICATE KEY UPDATE id = id;

-- Loan 2: Jean Dupont - Crédit auto (advisor: Marie Martin)
INSERT INTO loans (id, name, advisor_id, client_id, amount, duration, annual_interest_rate, insurance_rate, monthly_payment, total_cost, total_interest, insurance_cost, paid_amount, status, created_at, updated_at, delivered_at, next_payment_date)
VALUES (
  'loan-002',
  'Crédit automobile',
  'b2c3d4e5-6f7a-4b9c-8d1e-2f3a4b5c6d7e',
  'f6a7b8c9-0d1e-42f3-8f5b-6d7e8f9a0b1c',
  25000.00,
  60,
  4.00,
  0.50,
  468.75,
  28125.00,
  2875.00,
  125.00,
  0.00,
  'ACTIVE',
  DATE_SUB(NOW(), INTERVAL 10 MINUTE),
  NOW(),
  DATE_SUB(NOW(), INTERVAL 10 MINUTE),
  DATE_ADD(NOW(), INTERVAL 3 MINUTE)
) ON DUPLICATE KEY UPDATE id = id;

-- Loan 3: Emma Leroy - Crédit travaux (advisor: Thomas Bernard)
INSERT INTO loans (id, name, advisor_id, client_id, amount, duration, annual_interest_rate, insurance_rate, monthly_payment, total_cost, total_interest, insurance_cost, paid_amount, status, created_at, updated_at, delivered_at, next_payment_date)
VALUES (
  'loan-003',
  'Crédit travaux',
  'c3d4e5f6-7a8b-4c9d-9e2f-3a4b5c6d7e8f',
  'a7b8c9d0-1e2f-43a4-9f6c-7e8f9a0b1c2d',
  50000.00,
  120,
  3.80,
  0.40,
  504.17,
  60500.40,
  10300.40,
  200.00,
  0.00,
  'ACTIVE',
  DATE_SUB(NOW(), INTERVAL 15 MINUTE),
  NOW(),
  DATE_SUB(NOW(), INTERVAL 15 MINUTE),
  DATE_ADD(NOW(), INTERVAL 1 MINUTE)
) ON DUPLICATE KEY UPDATE id = id;

-- Loan 4: Lucas Moreau - Crédit personnel (advisor: Thomas Bernard)
INSERT INTO loans (id, name, advisor_id, client_id, amount, duration, annual_interest_rate, insurance_rate, monthly_payment, total_cost, total_interest, insurance_cost, paid_amount, status, created_at, updated_at, delivered_at, next_payment_date)
VALUES (
  'loan-004',
  'Crédit personnel',
  'c3d4e5f6-7a8b-4c9d-9e2f-3a4b5c6d7e8f',
  'b8c9d0e1-2f3a-44b5-af7d-8f9a0b1c2d3e',
  15000.00,
  48,
  5.00,
  0.45,
  345.83,
  16599.84,
  1532.34,
  67.50,
  0.00,
  'ACTIVE',
  DATE_SUB(NOW(), INTERVAL 7 MINUTE),
  NOW(),
  DATE_SUB(NOW(), INTERVAL 7 MINUTE),
  DATE_ADD(NOW(), INTERVAL 4 MINUTE)
) ON DUPLICATE KEY UPDATE id = id;

-- Loan 5: Léa Simon - Crédit étudiant (advisor: Sophie Dubois)
INSERT INTO loans (id, name, advisor_id, client_id, amount, duration, annual_interest_rate, insurance_rate, monthly_payment, total_cost, total_interest, insurance_cost, paid_amount, status, created_at, updated_at, delivered_at, next_payment_date)
VALUES (
  'loan-005',
  'Crédit étudiant',
  'd4e5f6a7-8b9c-4d0e-af3a-4b5c6d7e8f9a',
  'c9d0e1f2-3a4b-45c6-bf8e-9a0b1c2d3e4f',
  10000.00,
  60,
  2.50,
  0.30,
  177.92,
  10675.20,
  645.20,
  30.00,
  0.00,
  'ACTIVE',
  DATE_SUB(NOW(), INTERVAL 12 MINUTE),
  NOW(),
  DATE_SUB(NOW(), INTERVAL 12 MINUTE),
  DATE_ADD(NOW(), INTERVAL 5 MINUTE)
) ON DUPLICATE KEY UPDATE id = id;

-- =========================================
-- RÉSUMÉ DES DONNÉES INSÉRÉES
-- =========================================

SELECT
    'Crédits créés' as type,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    AVG(monthly_payment) as avg_monthly_payment
FROM loans;

SELECT
    'Crédits par conseiller' as type,
    CONCAT(u.first_name, ' ', u.last_name) as advisor_name,
    COUNT(l.id) as loan_count,
    SUM(l.amount) as total_amount
FROM loans l
JOIN users u ON l.advisor_id = u.id
GROUP BY u.id, u.first_name, u.last_name
ORDER BY loan_count DESC;

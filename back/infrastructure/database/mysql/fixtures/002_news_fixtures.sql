-- Fixtures pour les actualités (MySQL)
-- Ce fichier contient les données de test pour les actualités créées par les conseillers

-- Définir l'encodage UTF-8
SET NAMES utf8mb4;
SET CHARACTER_SET_CLIENT = utf8mb4;

-- Nettoyer les données existantes
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE news;
-- SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- ACTUALITÉS CRÉÉES PAR LES CONSEILLERS
-- =========================================

-- Actualités créées par Marie Martin (d1f5a6b4-8e2a-7d5f-1c9b-4a7e0f2b5d8c)
INSERT INTO news (id, title, description, author_id, author_name, created_at, updated_at)
VALUES
(
    'news-001',
    'Nouveaux taux d''épargne attractifs pour 2025',
    'Nous sommes ravis de vous annoncer l''arrivée de nos nouveaux taux d''épargne pour l''année 2025. Avec des taux allant jusqu''à 4,5% pour notre offre Gold, c''est le moment idéal pour faire fructifier votre épargne. Notre gamme comprend trois niveaux : Standard (2,5%), Premium (3,5%) et Gold (4,5%). Contactez votre conseiller pour en savoir plus sur ces offres exceptionnelles et trouver celle qui correspond le mieux à vos objectifs financiers.',
    'd1f5a6b4-8e2a-7d5f-1c9b-4a7e0f2b5d8c',
    'Marie Martin',
    DATE_SUB(NOW(), INTERVAL 7 DAY),
    DATE_SUB(NOW(), INTERVAL 7 DAY)
),
(
    'news-002',
    'Sécurité bancaire : nos conseils pour protéger vos comptes',
    'La sécurité de vos comptes est notre priorité absolue. Voici quelques conseils essentiels : ne partagez jamais vos codes confidentiels, activez l''authentification à deux facteurs, vérifiez régulièrement vos relevés bancaires, méfiez-vous des emails suspects et changez vos mots de passe régulièrement. Notre équipe reste à votre disposition pour toute question concernant la sécurité de vos comptes. N''hésitez pas à nous contacter si vous constatez une activité suspecte.',
    'd1f5a6b4-8e2a-7d5f-1c9b-4a7e0f2b5d8c',
    'Marie Martin',
    DATE_SUB(NOW(), INTERVAL 5 DAY),
    DATE_SUB(NOW(), INTERVAL 5 DAY)
),
(
    'news-003',
    'Nouvelle application mobile Avenir Bank disponible',
    'Découvrez notre toute nouvelle application mobile entièrement repensée pour une expérience utilisateur optimale. Consultez vos comptes en temps réel, effectuez des virements instantanés, gérez vos cartes bancaires et contactez votre conseiller en quelques clics. L''application intègre également un système de notifications pour vous tenir informé de toutes vos opérations. Téléchargez-la dès maintenant sur l''App Store et Google Play Store.',
    'd1f5a6b4-8e2a-7d5f-1c9b-4a7e0f2b5d8c',
    'Marie Martin',
    DATE_SUB(NOW(), INTERVAL 3 DAY),
    DATE_SUB(NOW(), INTERVAL 3 DAY)
),

-- Actualités créées par Thomas Bernard (e2a6b7c5-9f3b-8e6a-2d0c-5b8f1a3c6e9d)
(
    'news-004',
    'Ouverture de crédits immobiliers à taux préférentiels',
    'Avenir Bank lance sa nouvelle offre de crédits immobiliers avec des conditions exceptionnelles. Profitez de taux fixes attractifs dès 2,9% sur 20 ans pour concrétiser votre projet d''achat immobilier. Nous proposons également un accompagnement personnalisé tout au long de votre projet : étude de faisabilité, simulation de prêt, constitution du dossier et suivi jusqu''à la signature. Prenez rendez-vous avec votre conseiller pour étudier ensemble les meilleures options de financement.',
    'e2a6b7c5-9f3b-8e6a-2d0c-5b8f1a3c6e9d',
    'Thomas Bernard',
    DATE_SUB(NOW(), INTERVAL 10 DAY),
    DATE_SUB(NOW(), INTERVAL 10 DAY)
),
(
    'news-005',
    'Programme de fidélité : vos avantages exclusifs',
    'En tant que client fidèle d''Avenir Bank, profitez de nombreux avantages exclusifs. Carte bancaire premium gratuite, assurances voyage incluses, taux préférentiels sur vos crédits, accès prioritaire à nos conseillers et invitations à nos événements privés. Plus vous utilisez nos services, plus vous cumulez de points à échanger contre des récompenses. Consultez votre espace client pour découvrir tous vos avantages personnalisés.',
    'e2a6b7c5-9f3b-8e6a-2d0c-5b8f1a3c6e9d',
    'Thomas Bernard',
    DATE_SUB(NOW(), INTERVAL 8 DAY),
    DATE_SUB(NOW(), INTERVAL 8 DAY)
),

-- Actualités créées par Sophie Dubois (a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d)
(
    'news-006',
    'Webinaire gratuit : Préparer sa retraite sereinement',
    'Rejoignez-nous le mois prochain pour notre webinaire gratuit dédié à la préparation de la retraite. Nos experts vous présenteront les différentes solutions d''épargne retraite, les dispositifs fiscaux avantageux et les stratégies d''investissement adaptées à votre profil. Une session de questions-réponses suivra la présentation. Les places sont limitées, inscrivez-vous dès maintenant via votre espace client ou en contactant votre conseiller.',
    'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    'Sophie Dubois',
    DATE_SUB(NOW(), INTERVAL 2 DAY),
    DATE_SUB(NOW(), INTERVAL 2 DAY)
),
(
    'news-007',
    'Carte bancaire : nouveaux services de paiement sans contact',
    'Vos cartes bancaires Avenir Bank sont désormais équipées des dernières technologies de paiement sans contact. Payez jusqu''à 50€ sans composer votre code PIN, profitez du paiement mobile via Apple Pay et Google Pay, et bénéficiez d''une sécurité renforcée grâce à la technologie 3D Secure. Toutes ces fonctionnalités sont activées automatiquement sur votre carte. Pour toute question, notre service client reste à votre disposition 7j/7.',
    'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    'Sophie Dubois',
    DATE_SUB(NOW(), INTERVAL 1 DAY),
    DATE_SUB(NOW(), INTERVAL 1 DAY)
),
(
    'news-008',
    'Investissement responsable : nos fonds ISR disponibles',
    'Avenir Bank s''engage pour un investissement responsable et durable. Découvrez notre gamme de fonds ISR (Investissement Socialement Responsable) qui concilient performance financière et impact positif sur l''environnement et la société. Ces fonds sont sélectionnés selon des critères ESG stricts : environnement, social et gouvernance. Investissez dans des entreprises qui partagent vos valeurs tout en construisant votre patrimoine. Contactez votre conseiller pour en savoir plus.',
    'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    'Sophie Dubois',
    DATE_SUB(NOW(), INTERVAL 12 HOUR),
    DATE_SUB(NOW(), INTERVAL 12 HOUR)
)
ON DUPLICATE KEY UPDATE id = id;

-- =========================================
-- Résumé des données insérées
-- =========================================

SELECT
    'Actualités créées' as type,
    COUNT(*) as total_news,
    COUNT(DISTINCT author_id) as total_advisors
FROM news;

SELECT
    'Actualités par conseiller' as type,
    author_name,
    COUNT(*) as news_count
FROM news
GROUP BY author_id, author_name
ORDER BY news_count DESC;

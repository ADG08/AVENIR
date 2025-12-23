export interface News {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  authorId: string;
  authorName: string;
}

// Mock actualités
export const MOCK_NEWS: News[] = [
  {
    id: 'news-001',
    title: 'Nouveaux taux d\'intérêt pour les crédits immobiliers',
    description: 'Nous avons le plaisir de vous annoncer une baisse des taux d\'intérêt pour tous nos crédits immobiliers. Profitez dès maintenant de conditions exceptionnelles pour financer votre projet.',
    createdAt: new Date('2024-12-20T10:00:00'),
    authorId: 'advisor-001',
    authorName: 'Marie Conseil',
  },
  {
    id: 'news-002',
    title: 'Fermeture exceptionnelle pendant les fêtes',
    description: 'Nos agences seront fermées du 24 décembre au 2 janvier. En cas d\'urgence, notre service client reste disponible par téléphone et par chat.',
    createdAt: new Date('2024-12-15T14:30:00'),
    authorId: 'advisor-002',
    authorName: 'Jean Martin',
  },
  {
    id: 'news-003',
    title: 'Nouvelle offre Livret A+',
    description: 'Découvrez notre nouveau produit d\'épargne avec un taux bonifié de 3.5% la première année. Sans frais de gestion et disponible dès 10€.',
    createdAt: new Date('2024-12-10T09:00:00'),
    authorId: 'advisor-001',
    authorName: 'Marie Conseil',
  },
];

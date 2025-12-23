export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'loan';
  read: boolean;
  createdAt: Date;
  advisorName?: string;
}

// Mock notifications pour le client
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    title: 'Nouveau crédit approuvé',
    message: 'Votre crédit personnel de 15 000€ a été approuvé par votre conseiller.',
    type: 'loan',
    read: false,
    createdAt: new Date('2024-12-20T10:30:00'),
    advisorName: 'Marie Conseil',
  },
  {
    id: 'notif-002',
    title: 'Mensualité à venir',
    message: 'Votre prochaine mensualité de 272,50€ sera prélevée le 1er janvier 2025.',
    type: 'info',
    read: false,
    createdAt: new Date('2024-12-21T14:15:00'),
  },
  {
    id: 'notif-003',
    title: 'Message de votre conseiller',
    message: 'Bonjour, je vous contacte concernant votre demande de crédit immobilier.',
    type: 'info',
    read: true,
    createdAt: new Date('2024-12-18T09:00:00'),
    advisorName: 'Marie Conseil',
  },
];

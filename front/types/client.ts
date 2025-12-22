import { User, Chat, ChatStatus, MessageType } from './chat';
import { UserRole, UserState } from './enums';

export interface ClientLoan {
  id: string;
  clientId: string;
  name: string;
  amount: number;
  duration: number;
  interestRate: number;
  insuranceRate: number;
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  insuranceCost: number;
  remainingBalance: number;
  startDate: Date;
  endDate: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';
  createdAt: Date;
}

export interface ClientNotification {
  id: string;
  clientId: string;
  advisorId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface ClientWithDetails extends User {
  activeChats: Chat[];
  loans: ClientLoan[];
  notifications: ClientNotification[];
  clientSince: Date;
}

// Mock data pour les clients
export const MOCK_CLIENTS: ClientWithDetails[] = [
  {
    id: 'client-001',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    identityNumber: 'CLI001',
    role: UserRole.CLIENT,
    state: UserState.ACTIVE,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    clientSince: new Date('2024-01-15'),
    activeChats: [
      {
        id: 'chat-001',
        clientId: 'client-001',
        advisorId: 'advisor-001',
        status: ChatStatus.ACTIVE,
        lastMessage: {
          id: 'msg-001',
          chatId: 'chat-001',
          senderId: 'client-001',
          content: 'Bonjour, j\'aimerais avoir des informations sur les crédits immobiliers.',
          isRead: true,
          type: MessageType.NORMAL,
          createdAt: new Date('2024-12-20'),
        },
        unreadCount: 0,
        createdAt: new Date('2024-12-20'),
        updatedAt: new Date('2024-12-20'),
      },
    ],
    loans: [
      {
        id: 'loan-001',
        clientId: 'client-001',
        name: 'Crédit personnel',
        amount: 15000,
        duration: 60,
        interestRate: 3.5,
        insuranceRate: 0.36,
        monthlyPayment: 272.5,
        totalCost: 16350,
        totalInterest: 1350,
        insuranceCost: 540,
        remainingBalance: 12000,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2029-02-01'),
        status: 'ACTIVE',
        createdAt: new Date('2024-02-01'),
      },
    ],
    notifications: [],
  },
  {
    id: 'client-002',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@example.com',
    identityNumber: 'CLI002',
    role: UserRole.CLIENT,
    state: UserState.ACTIVE,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date(),
    clientSince: new Date('2024-03-20'),
    activeChats: [
      {
        id: 'chat-002',
        clientId: 'client-002',
        advisorId: 'advisor-001',
        status: ChatStatus.PENDING,
        lastMessage: {
          id: 'msg-002',
          chatId: 'chat-002',
          senderId: 'client-002',
          content: 'Je souhaiterais ouvrir un compte épargne.',
          isRead: false,
          type: MessageType.NORMAL,
          createdAt: new Date('2024-12-21'),
        },
        unreadCount: 1,
        createdAt: new Date('2024-12-21'),
        updatedAt: new Date('2024-12-21'),
      },
    ],
    loans: [],
    notifications: [],
  },
  {
    id: 'client-003',
    firstName: 'Pierre',
    lastName: 'Bernard',
    email: 'pierre.bernard@example.com',
    identityNumber: 'CLI003',
    role: UserRole.CLIENT,
    state: UserState.ACTIVE,
    createdAt: new Date('2024-05-10'),
    updatedAt: new Date(),
    clientSince: new Date('2024-05-10'),
    activeChats: [],
    loans: [
      {
        id: 'loan-002',
        clientId: 'client-003',
        name: 'Crédit immobilier',
        amount: 25000,
        duration: 84,
        interestRate: 4.0,
        insuranceRate: 0.36,
        monthlyPayment: 345.8,
        totalCost: 29047.2,
        totalInterest: 4047.2,
        insuranceCost: 900,
        remainingBalance: 22000,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2031-06-01'),
        status: 'ACTIVE',
        createdAt: new Date('2024-06-01'),
      },
      {
        id: 'loan-003',
        clientId: 'client-003',
        name: 'Crédit jeune',
        amount: 2000,
        duration: 60,
        interestRate: 4.0,
        insuranceRate: 0.36,
        monthlyPayment: 345.8,
        totalCost: 29047.2,
        totalInterest: 4047.2,
        insuranceCost: 900,
        remainingBalance: 1500,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2031-06-01'),
        status: 'ACTIVE',
        createdAt: new Date('2024-06-01'),
      },
    ],
    notifications: [],
  },
];


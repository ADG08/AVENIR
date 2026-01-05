import { AdvisorClient } from '@/lib/api/advisor.api';
import { ClientWithDetails } from '@/types/client';
import {UserRole, UserState, ChatStatus} from '@/types/enums';

/**
 * Mappe les clients récupérés de l'API advisor vers le format ClientWithDetails utilisé dans l'application frontend.
 *
 * @param clients - Liste des clients récupérés de l'API
 * @param advisorId - ID de l'advisor actuel
 * @returns Liste des clients au format ClientWithDetails
 */
export const mapAdvisorClientsToClientDetails = (
  clients: AdvisorClient[],
  advisorId: string
): ClientWithDetails[] => {
  return clients.map(client => ({
    id: client.id,
    firstName: client.firstName,
    lastName: client.lastName,
    email: client.email,
    identityNumber: client.identityNumber,
    role: UserRole.CLIENT,
    state: client.state as UserState,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
    activeChats: client.chats.map(chat => ({
      id: chat.id,
      status: chat.status as ChatStatus,
      clientId: client.id,
      advisorId: advisorId,
      isMyClient: false,
      client: {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        identityNumber: client.identityNumber,
        role: UserRole.CLIENT,
        state: client.state as UserState,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      },
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      firstMessage: chat.firstMessage,
    })),
    loans: client.loans.map(loan => ({
      ...loan,
      clientId: client.id,
      interestRate: loan.interestRate,
    })),
    notifications: [],
    clientSince: client.createdAt,
  }));
};

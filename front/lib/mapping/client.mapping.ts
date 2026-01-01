import { Client } from '@/lib/api/advisor.api';
import { ClientWithDetails } from '@/types/client';
import { UserRole, UserState, ChatStatus, LoanStatus } from '@/types/enums';

/**
 * Mappe les clients récupérés de l'API advisor vers le format ClientWithDetails utilisé dans l'application frontend.
 *
 * @param clients - Liste des clients récupérés de l'API
 * @param advisorId - ID de l'advisor actuel
 * @returns Liste des clients au format ClientWithDetails
 */
export const mapAdvisorClientsToClientDetails = (
  clients: Client[],
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
    updatedAt: client.createdAt,
    activeChats: client.chats.map(chat => ({
      id: chat.id,
      status: chat.status as ChatStatus,
      clientId: client.id,
      advisorId: advisorId,
      client: {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        identityNumber: client.identityNumber,
        role: UserRole.CLIENT,
        state: client.state as UserState,
        createdAt: client.createdAt,
        updatedAt: client.createdAt,
      },
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messages: [],
    })),
    loans: client.loans.map(loan => {
      const endDate = new Date(loan.createdAt);
      endDate.setMonth(endDate.getMonth() + loan.duration);

      return {
        id: loan.id,
        clientId: client.id,
        name: loan.name,
        amount: loan.amount,
        duration: loan.duration,
        interestRate: loan.annualInterestRate,
        insuranceRate: loan.insuranceRate,
        monthlyPayment: loan.monthlyPayment,
        totalCost: loan.totalCost,
        totalInterest: loan.totalInterest,
        insuranceCost: loan.insuranceCost,
        remainingPayment: loan.remainingPayment,
        progressPercentage: loan.progressPercentage,
        monthsPaid: loan.monthsPaid,
        status: loan.status as LoanStatus,
        startDate: loan.createdAt,
        endDate: endDate,
        createdAt: loan.createdAt,
      };
    }),
    notifications: [],
    clientSince: client.createdAt,
  }));
};

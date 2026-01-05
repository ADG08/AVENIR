import { ClientLoan } from '@/types/client';
import { Chat, User } from '@/types/chat';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ChatFromAPI extends Omit<Chat, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

interface LoanFromAPI extends Omit<ClientLoan, 'createdAt' | 'startDate' | 'endDate' | 'nextPaymentDate'> {
  createdAt: string;
  startDate: string;
  endDate: string;
  nextPaymentDate?: string;
}

interface ClientFromAPI extends Omit<User, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
  chats: ChatFromAPI[];
  loans: LoanFromAPI[];
}

interface GetAdvisorClientsResponse {
  clients: ClientFromAPI[];
}

export interface AdvisorClient extends User {
  chats: Chat[];
  loans: ClientLoan[];
}

export const getAdvisorClients = async (advisorId: string): Promise<AdvisorClient[]> => {
  const response = await fetch(`${API_URL}/api/advisors/${advisorId}/clients`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Failed to fetch advisor clients');
  }

  const data: GetAdvisorClientsResponse = await response.json();

  return data.clients.map((client): AdvisorClient => ({
    ...client,
    createdAt: new Date(client.createdAt),
    updatedAt: new Date(client.updatedAt),
    chats: client.chats.map((chat): Chat => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
    })),
    loans: client.loans.map((loan): ClientLoan => {
      const loanData = loan as any;
      const startDate = new Date(loan.startDate);
      const endDate = new Date(loan.endDate);

      return {
        ...loan,
        interestRate: loanData.annualInterestRate || loan.interestRate || 0,
        createdAt: new Date(loan.createdAt),
        startDate: startDate,
        endDate: endDate,
        nextPaymentDate: loan.nextPaymentDate ? new Date(loan.nextPaymentDate) : undefined,
      };
    }),
  }));
};

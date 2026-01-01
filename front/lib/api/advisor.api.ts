const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ClientChat {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientLoanApi {
  id: string;
  name: string;
  amount: number;
  duration: number;
  annualInterestRate: number;
  insuranceRate: number;
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  insuranceCost: number;
  remainingPayment: number;
  paidAmount: number;
  progressPercentage: number;
  monthsPaid: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  identityNumber: string;
  state: string;
  createdAt: Date;
  chats: ClientChat[];
  loans: ClientLoanApi[];
}

export interface GetAdvisorClientsResponse {
  clients: Client[];
}

export const getAdvisorClients = async (advisorId: string): Promise<Client[]> => {
  const response = await fetch(`${API_URL}/api/advisors/${advisorId}/clients`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Failed to fetch advisor clients');
  }

  const data: GetAdvisorClientsResponse = await response.json();

  return data.clients.map((client) => ({
    ...client,
    createdAt: new Date(client.createdAt),
    chats: client.chats.map((chat) => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
    })),
    loans: client.loans.map((loan) => ({
      ...loan,
      createdAt: new Date(loan.createdAt),
      updatedAt: new Date(loan.updatedAt),
    })),
  }));
};

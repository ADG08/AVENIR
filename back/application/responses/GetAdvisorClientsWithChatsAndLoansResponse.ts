export interface ClientChatResponse {
    id: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    firstMessage?: {
        id: string;
        content: string;
    };
}

export interface ClientLoanResponse {
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
    startDate: Date;
    endDate: Date;
    nextPaymentDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ClientResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    identityNumber: string;
    state: string;
    createdAt: Date;
    chats: ClientChatResponse[];
    loans: ClientLoanResponse[];
}

export interface GetAdvisorClientsWithChatsAndLoansResponse {
    clients: ClientResponse[];
}

export class GetAdvisorClientsWithChatsAndLoansResponseMapper {
    static toResponse(clients: ClientResponse[]): GetAdvisorClientsWithChatsAndLoansResponse {
        return {
            clients
        };
    }
}

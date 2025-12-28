export interface ClientChatResponse {
    id: string;
    status: string;
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
    loans: any[];
}

export interface GetAdvisorClientsResponse {
    clients: ClientResponse[];
}

export class GetAdvisorClientsResponseMapper {
    static toResponse(clients: ClientResponse[]): GetAdvisorClientsResponse {
        return {
            clients
        };
    }
}

import { UserRepository } from "../../../domain/repositories/UserRepository";
import { ChatRepository } from "../../../domain/repositories/ChatRepository";
import {InvalidCredentialsError, UserNotFoundError} from "../../../domain/errors";
import { UserRole } from "../../../domain/enumerations/UserRole";

export interface GetAdvisorClientsWithChatsAndLoansRequest {
    advisorId: string;
}

export interface ClientWithChatsAndLoans {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    identityNumber: string;
    state: string;
    createdAt: Date;
    chats: {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    loans: any[];
}

export interface GetAdvisorClientsWithChatsAndLoansResponse {
    clients: ClientWithChatsAndLoans[];
}

export class GetAdvisorClientsWithChatsAndLoansUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly chatRepository: ChatRepository
    ) {}

    async execute(request: GetAdvisorClientsWithChatsAndLoansRequest): Promise<GetAdvisorClientsWithChatsAndLoansResponse> {
        const advisor = await this.userRepository.getById(request.advisorId);
        if (!advisor) {
            throw new UserNotFoundError(request.advisorId);
        }
        if (advisor.role !== UserRole.ADVISOR) {
            throw new InvalidCredentialsError();
        }

        const clients = await this.userRepository.getClientsByAdvisorId(request.advisorId);
        const advisorChats = await this.chatRepository.getByAdvisorId(request.advisorId);
        const clientsWithDetails: ClientWithChatsAndLoans[] = clients.map(client => {
            const clientChats = advisorChats.filter(chat => chat.client.id === client.id);

            return {
                id: client.id,
                firstName: client.firstName,
                lastName: client.lastName,
                email: client.email,
                identityNumber: client.identityNumber,
                state: client.state,
                createdAt: client.createdAt,
                chats: clientChats.map(chat => ({
                    id: chat.id,
                    status: chat.status,
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt,
                })),
                loans: client.loans || []
            };
        });

        return {
            clients: clientsWithDetails
        };
    }
}

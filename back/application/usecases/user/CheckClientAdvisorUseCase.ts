import { UserRepository } from "../../../domain/repositories/UserRepository";
import { UserNotFoundError } from "../../../domain/errors";
import { UserRole } from "../../../domain/enumerations/UserRole";
import { CheckClientAdvisorRequest } from "../../requests";
import { CheckClientAdvisorResponse } from "../../responses/CheckClientAdvisorResponse";

export class CheckClientAdvisorUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(request: CheckClientAdvisorRequest): Promise<CheckClientAdvisorResponse> {
        const client = await this.userRepository.getById(request.clientId);
        if (!client || client.role !== UserRole.CLIENT) {
            throw new UserNotFoundError(request.clientId);
        }

        const advisor = await this.userRepository.getById(request.advisorId);
        if (!advisor || advisor.role !== UserRole.ADVISOR) {
            throw new UserNotFoundError(request.advisorId);
        }

        const isAdviserManagedClient = await this.userRepository.isClientManagedByAdvisor(
            request.clientId,
            request.advisorId
        );

        if (!isAdviserManagedClient && client.advisorId) {
            const clientAdvisor = await this.userRepository.getById(client.advisorId);
            return CheckClientAdvisorResponse.create(
                false,
                client.advisorId,
                clientAdvisor ? `${clientAdvisor.firstName} ${clientAdvisor.lastName}` : null
            );
        }

        return CheckClientAdvisorResponse.create(
            isAdviserManagedClient,
            isAdviserManagedClient ? request.advisorId : null,
            isAdviserManagedClient ? `${advisor.firstName} ${advisor.lastName}` : null
        );
    }
}

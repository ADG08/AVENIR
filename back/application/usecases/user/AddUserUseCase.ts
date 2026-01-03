import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { randomUUID } from "crypto";
import { UserState } from "../../../domain/enumerations/UserState";
import { UserRole } from "../../../domain/enumerations/UserRole";
import { AddUserRequest } from "../../requests";
import { AddUserResponse, AddUserResponseMapper } from "../../responses";
import { UserAlreadyExistsError } from "../../../domain/errors";

export class AddUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(request: AddUserRequest): Promise<AddUserResponse> {  
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await this.userRepository.getByEmail(request.email);
        if (existingUser) {
            throw new UserAlreadyExistsError(request.email);
        }

        let advisorId: string | undefined;
        if (request.role === UserRole.CLIENT) {
            const randomAdvisor = await this.userRepository.getRandomAdvisor();
            advisorId = randomAdvisor?.id;
        }

        // Créer l'utilisateur
        const user = new User(
            randomUUID(),
            request.firstName,
            request.lastName,
            request.email,
            request.identityNumber,
            request.passcode,
            request.role,
            UserState.ACTIVE,
            [],
            [],
            [],
            new Date(),
            undefined,
            undefined,
            advisorId
        );

        const savedUser = await this.userRepository.add(user);
        return AddUserResponseMapper.toResponse(savedUser);
    }
}

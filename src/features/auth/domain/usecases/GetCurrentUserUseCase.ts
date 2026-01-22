import { AuthRepository } from '../repositories/AuthRepository';
import { User } from '../entities/User';

export class GetCurrentUserUseCase {
    constructor(private authRepository: AuthRepository) {}

    async execute(): Promise<User | null> {
        return await this.authRepository.getCurrentUser();
    }
}

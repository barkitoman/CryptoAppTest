import { AuthRepository } from '../repositories/AuthRepository';

export class LogoutUseCase {
    constructor(private authRepository: AuthRepository) {}

    async execute(): Promise<void> {
        await this.authRepository.logout();
    }
}

import { AuthRepository } from '../repositories/AuthRepository';
import { RegisterData, AuthSession } from '../entities/User';

export class RegisterUseCase {
    constructor(private authRepository: AuthRepository) {}

    async execute(data: RegisterData): Promise<AuthSession> {
        // Validación
        if (!data.email || !data.password || !data.name) {
            throw new Error('All fields are required');
        }

        if (!this.isValidEmail(data.email)) {
            throw new Error('Invalid email format');
        }

        if (data.password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        if (data.name.length < 2) {
            throw new Error('Name must be at least 2 characters');
        }

        // Ejecutar registro
        return await this.authRepository.register(data);
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

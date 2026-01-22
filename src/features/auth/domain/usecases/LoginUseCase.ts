import { AuthRepository } from '../repositories/AuthRepository';
import { AuthCredentials, AuthSession } from '../entities/User';

export class LoginUseCase {
    constructor(private authRepository: AuthRepository) {}

    async execute(credentials: AuthCredentials): Promise<AuthSession> {
        // Validación
        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required');
        }

        if (!this.isValidEmail(credentials.email)) {
            throw new Error('Invalid email format');
        }

        if (credentials.password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Ejecutar login
        return await this.authRepository.login(credentials);
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

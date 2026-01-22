import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { User, AuthCredentials, AuthSession, RegisterData } from '../../domain/entities/User';
import { LocalAuthDataSource } from '../datasources/LocalAuthDataSource';

export class AuthRepositoryImpl implements AuthRepository {
    constructor(private dataSource: LocalAuthDataSource) {}

    async login(credentials: AuthCredentials): Promise<AuthSession> {
        return await this.dataSource.login(credentials.email, credentials.password);
    }

    async register(data: RegisterData): Promise<AuthSession> {
        return await this.dataSource.register(data.email, data.password, data.name);
    }

    async logout(): Promise<void> {
        await this.dataSource.logout();
    }

    async getCurrentUser(): Promise<User | null> {
        const session = await this.dataSource.getCurrentSession();
        return session ? session.user : null;
    }

    async isAuthenticated(): Promise<boolean> {
        return await this.dataSource.isAuthenticated();
    }
}

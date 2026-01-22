import { User, AuthCredentials, AuthSession, RegisterData } from '../entities/User';

export interface AuthRepository {
    login(credentials: AuthCredentials): Promise<AuthSession>;
    register(data: RegisterData): Promise<AuthSession>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
    isAuthenticated(): Promise<boolean>;
}

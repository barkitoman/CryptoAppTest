import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthSession } from '../../domain/entities/User';

const STORAGE_KEYS = {
    SESSION: '@crypto_app:auth_session',
};

// Mock users database (in-memory for demo)
const MOCK_USERS = [
    {
        id: '1',
        email: 'demo@crypto.com',
        password: 'demo123',
        name: 'Demo User',
    },
];

export class LocalAuthDataSource {
    async login(email: string, password: string): Promise<AuthSession> {
        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Buscar usuario
        const user = MOCK_USERS.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
        );

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const session: AuthSession = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: Date.now(),
            },
            token: `mock_token_${Date.now()}`,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
        };

        // Guardar sesión
        await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
        return session;
    }

    async register(email: string, password: string, name: string): Promise<AuthSession> {
        // Simular delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Verificar si ya existe
        if (MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('Email already exists');
        }

        // Crear nuevo usuario
        const newUser = {
            id: Date.now().toString(),
            email,
            password,
            name,
        };

        MOCK_USERS.push(newUser);

        const session: AuthSession = {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                createdAt: Date.now(),
            },
            token: `mock_token_${Date.now()}`,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };

        await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));

        return session;
    }

    async logout(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
    }

    async getCurrentSession(): Promise<AuthSession | null> {
        const sessionStr = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
        if (!sessionStr) return null;

        const session: AuthSession = JSON.parse(sessionStr);

        // Verificar si expiró
        if (session.expiresAt < Date.now()) {
            await this.logout();
            return null;
        }

        return session;
    }

    async isAuthenticated(): Promise<boolean> {
        const session = await this.getCurrentSession();
        return session !== null;
    }
}

import { useState } from 'react';
import { container, SERVICES } from '../../../../core/di/container';
import { LoginUseCase } from '../../domain/usecases/LoginUseCase';
import { RegisterUseCase } from '../../domain/usecases/RegisterUseCase';
import { LogoutUseCase } from '../../domain/usecases/LogoutUseCase';
import { GetCurrentUserUseCase } from '../../domain/usecases/GetCurrentUserUseCase';
import { AuthCredentials, RegisterData, User } from '../../domain/entities/User';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const login = async (credentials: AuthCredentials) => {
        try {
            setIsLoading(true);
            setError(null);

            const loginUseCase = container.resolve<LoginUseCase>(SERVICES.LOGIN_USE_CASE);
            const session = await loginUseCase.execute(credentials);

            setUser(session.user);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setIsLoading(true);
            setError(null);

            const registerUseCase = container.resolve<RegisterUseCase>(SERVICES.REGISTER_USE_CASE);
            const session = await registerUseCase.execute(data);

            setUser(session.user);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Registration failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const logoutUseCase = container.resolve<LogoutUseCase>(SERVICES.LOGOUT_USE_CASE);
            await logoutUseCase.execute();

            setUser(null);
            console.log('✅ Logout successful');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Logout failed';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentUser = async () => {
        try {
            const getUserUseCase = container.resolve<GetCurrentUserUseCase>(
                SERVICES.GET_CURRENT_USER_USE_CASE,
            );
            const currentUser = await getUserUseCase.execute();
            setUser(currentUser);
            return currentUser;
        } catch (err) {
            console.error('❌ Get current user error:', err);
            return null;
        }
    };

    return {
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        getCurrentUser,
    };
};

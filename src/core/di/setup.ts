// DI Container Setup - Initialize all dependencies
import { container, SERVICES } from './container';

// Auth
import { LocalAuthDataSource } from '../../features/auth/data/datasources/LocalAuthDataSource';
import { AuthRepositoryImpl } from '../../features/auth/data/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '../../features/auth/domain/usecases/LoginUseCase';
import { RegisterUseCase } from '../../features/auth/domain/usecases/RegisterUseCase';
import { LogoutUseCase } from '../../features/auth/domain/usecases/LogoutUseCase';
import { GetCurrentUserUseCase } from '../../features/auth/domain/usecases/GetCurrentUserUseCase';

// Crypto
import { CryptoRepositoryImpl } from '../../features/crypto/data/repositories/CryptoRepositoryImpl';
import { GetCryptocurrenciesUseCase } from '../../features/crypto/domain/usecases/GetCryptocurrenciesUseCase';
import { GetHistoricalPricesUseCase } from '../../features/crypto/domain/usecases/GetHistoricalPricesUseCase';

export function setupDependencies() {
    // Auth dependencies
    const authDataSource = new LocalAuthDataSource();
    const authRepository = new AuthRepositoryImpl(authDataSource);

    // Crypto dependencies
    const cryptoRepository = new CryptoRepositoryImpl();

    container.register(SERVICES.AUTH_REPOSITORY, authRepository);
    container.register(SERVICES.LOGIN_USE_CASE, new LoginUseCase(authRepository));
    container.register(SERVICES.REGISTER_USE_CASE, new RegisterUseCase(authRepository));
    container.register(SERVICES.LOGOUT_USE_CASE, new LogoutUseCase(authRepository));
    container.register(
        SERVICES.GET_CURRENT_USER_USE_CASE,
        new GetCurrentUserUseCase(authRepository),
    );

    container.register(SERVICES.CRYPTO_REPOSITORY, cryptoRepository);
    container.register(
        SERVICES.GET_CRYPTOCURRENCIES_USE_CASE,
        new GetCryptocurrenciesUseCase(cryptoRepository),
    );
    container.register(
        SERVICES.GET_HISTORICAL_PRICES_USE_CASE,
        new GetHistoricalPricesUseCase(cryptoRepository),
    );


}

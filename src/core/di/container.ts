// Simple Dependency Injection Container
class DIContainer {
    private static instance: DIContainer;
    private services: Map<string, any> = new Map();

    private constructor() {}

    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    register<T>(key: string, service: T): void {
        this.services.set(key, service);
    }

    resolve<T>(key: string): T {
        const service = this.services.get(key);
        if (!service) {
            throw new Error(`Service ${key} not found in DI container`);
        }
        return service;
    }

    clear(): void {
        this.services.clear();
    }
}

export const container = DIContainer.getInstance();

// Service keys for type safety
export const SERVICES = {
    // Auth
    AUTH_REPOSITORY: 'AuthRepository',
    LOGIN_USE_CASE: 'LoginUseCase',
    REGISTER_USE_CASE: 'RegisterUseCase',
    LOGOUT_USE_CASE: 'LogoutUseCase',
    GET_CURRENT_USER_USE_CASE: 'GetCurrentUserUseCase',

    // Crypto
    CRYPTO_REPOSITORY: 'CryptoRepository',
    GET_CRYPTOCURRENCIES_USE_CASE: 'GetCryptocurrenciesUseCase',
    GET_HISTORICAL_PRICES_USE_CASE: 'GetHistoricalPricesUseCase',
};

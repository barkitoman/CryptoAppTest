import cryptoReducer, {
    setCryptocurrencies,
    updatePrice,
    setConnectionStatus,
    setLoading,
    setError,
    selectAllCryptos,
    selectSortedCryptos,
    selectConnectionStatus,
} from '../../slices/cryptoSlice';
import { ConnectionStatus } from '../../../domain/entities/Cryptocurrency';

describe('cryptoSlice', () => {
    const initialState = {
        cryptocurrencies: {},
        connectionStatus: ConnectionStatus.DISCONNECTED,
        isLoading: false,
        error: null,
        lastUpdate: null,
    };

    it('should return the initial state', () => {
        expect(cryptoReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    describe('setCryptocurrencies', () => {
        it('should set cryptocurrencies and update state', () => {
            const mockCryptos = [
                {
                    id: 'bitcoin',
                    rank: 1,
                    symbol: 'BTC',
                    name: 'Bitcoin',
                    supply: 19000000,
                    maxSupply: 21000000,
                    marketCapUsd: 1000000000,
                    volumeUsd24Hr: 50000000,
                    priceUsd: 50000,
                    changePercent24Hr: 5.5,
                    vwap24Hr: 49500,
                },
            ];

            const newState = cryptoReducer(initialState, setCryptocurrencies(mockCryptos));

            expect(newState.cryptocurrencies['bitcoin']).toEqual(mockCryptos[0]);
            expect(newState.isLoading).toBe(false);
            expect(newState.error).toBe(null);
            expect(newState.lastUpdate).toBeTruthy();
        });
    });

    describe('updatePrice', () => {
        it('should update price for existing cryptocurrency', () => {
            const stateWithCrypto = {
                ...initialState,
                cryptocurrencies: {
                    bitcoin: {
                        id: 'bitcoin',
                        rank: 1,
                        symbol: 'BTC',
                        name: 'Bitcoin',
                        supply: 19000000,
                        maxSupply: 21000000,
                        marketCapUsd: 1000000000,
                        volumeUsd24Hr: 50000000,
                        priceUsd: 50000,
                        changePercent24Hr: 5.5,
                        vwap24Hr: 49500,
                    },
                },
            };

            const priceUpdate = {
                id: 'bitcoin',
                priceUsd: 51000,
                timestamp: Date.now(),
            };

            const newState = cryptoReducer(stateWithCrypto, updatePrice(priceUpdate));

            expect(newState.cryptocurrencies['bitcoin'].priceUsd).toBe(51000);
            expect(newState.cryptocurrencies['bitcoin'].lastUpdated).toBe(priceUpdate.timestamp);
        });

        it('should not crash if cryptocurrency does not exist', () => {
            const priceUpdate = {
                id: 'nonexistent',
                priceUsd: 100,
                timestamp: Date.now(),
            };

            expect(() => {
                cryptoReducer(initialState, updatePrice(priceUpdate));
            }).not.toThrow();
        });
    });

    describe('setConnectionStatus', () => {
        it('should update connection status', () => {
            const newState = cryptoReducer(
                initialState,
                setConnectionStatus(ConnectionStatus.CONNECTED)
            );

            expect(newState.connectionStatus).toBe(ConnectionStatus.CONNECTED);
        });
    });

    describe('setLoading', () => {
        it('should update loading state', () => {
            const newState = cryptoReducer(initialState, setLoading(true));
            expect(newState.isLoading).toBe(true);
        });
    });

    describe('setError', () => {
        it('should set error and stop loading', () => {
            const stateWithLoading = { ...initialState, isLoading: true };
            const newState = cryptoReducer(stateWithLoading, setError('Network error'));

            expect(newState.error).toBe('Network error');
            expect(newState.isLoading).toBe(false);
        });
    });

    describe('selectors', () => {
        const mockState = {
            crypto: {
                cryptocurrencies: {
                    bitcoin: {
                        id: 'bitcoin',
                        rank: 1,
                        symbol: 'BTC',
                        name: 'Bitcoin',
                        supply: 19000000,
                        maxSupply: 21000000,
                        marketCapUsd: 1000000000,
                        volumeUsd24Hr: 50000000,
                        priceUsd: 50000,
                        changePercent24Hr: 5.5,
                        vwap24Hr: 49500,
                    },
                    ethereum: {
                        id: 'ethereum',
                        rank: 2,
                        symbol: 'ETH',
                        name: 'Ethereum',
                        supply: 120000000,
                        maxSupply: null,
                        marketCapUsd: 500000000,
                        volumeUsd24Hr: 30000000,
                        priceUsd: 3000,
                        changePercent24Hr: -2.3,
                        vwap24Hr: 3050,
                    },
                },
                connectionStatus: ConnectionStatus.CONNECTED,
                isLoading: false,
                error: null,
                lastUpdate: Date.now(),
            },
        };

        it('selectAllCryptos should return all cryptocurrencies as array', () => {
            const result = selectAllCryptos(mockState);
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('bitcoin');
        });

        it('selectSortedCryptos should return cryptocurrencies sorted by rank', () => {
            const result = selectSortedCryptos(mockState);
            expect(result[0].rank).toBe(1);
            expect(result[1].rank).toBe(2);
        });

        it('selectConnectionStatus should return connection status', () => {
            const result = selectConnectionStatus(mockState);
            expect(result).toBe(ConnectionStatus.CONNECTED);
        });
    });
});

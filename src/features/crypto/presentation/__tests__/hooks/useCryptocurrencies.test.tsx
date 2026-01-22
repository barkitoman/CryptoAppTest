import { renderHook, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCryptocurrencies } from '../../hooks/useCryptocurrencies';
import cryptoReducer from '../../slices/cryptoSlice';

// Mock the container
jest.mock('../../../../../core/di/container', () => ({
    container: {
        resolve: jest.fn(() => ({
            execute: jest.fn().mockResolvedValue([
                {
                    id: 'bitcoin',
                    rank: 1,
                    symbol: 'BTC',
                    name: 'Bitcoin',
                    supply: 19000000,
                    maxSupply: 21000000,
                    marketCapUsd: 1000000000000,
                    volumeUsd24Hr: 50000000000,
                    priceUsd: 50000,
                    changePercent24Hr: 5.5,
                    vwap24Hr: 49500,
                    lastUpdated: Date.now(),
                },
            ]),
        })),
    },
    SERVICES: {
        GetCryptocurrenciesUseCase: 'GetCryptocurrenciesUseCase',
    },
}));

describe('useCryptocurrencies Hook', () => {
    let store: any;
    let queryClient: QueryClient;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                crypto: cryptoReducer,
            },
        });

        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </Provider>
    );

    it('should fetch cryptocurrencies successfully', async () => {
        const { result } = renderHook(() => useCryptocurrencies(), { wrapper });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data).toBeDefined();
    });

    it('should handle refetch', async () => {
        const { result } = renderHook(() => useCryptocurrencies(), { wrapper });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        await result.current.refetch();

        expect(result.current.isSuccess).toBe(true);
    });
});

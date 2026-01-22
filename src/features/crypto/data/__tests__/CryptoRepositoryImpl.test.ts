import { CryptoRepositoryImpl } from '../repositories/CryptoRepositoryImpl';
import { Cryptocurrency } from '../../domain/entities/Cryptocurrency';

// Mock the data source
const mockDataSource = {
    getCryptocurrencies: jest.fn(),
    getHistoricalPrices: jest.fn(),
};

describe('CryptoRepositoryImpl', () => {
    let repository: CryptoRepositoryImpl;

    beforeEach(() => {
        repository = new CryptoRepositoryImpl(mockDataSource as any);
        jest.clearAllMocks();
    });

    describe('getCryptocurrencies', () => {
        it('should fetch cryptocurrencies from data source', async () => {
            const mockCryptos: Cryptocurrency[] = [
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
            ];

            mockDataSource.getCryptocurrencies.mockResolvedValue(mockCryptos);

            const result = await repository.getCryptocurrencies(1, 100);

            expect(mockDataSource.getCryptocurrencies).toHaveBeenCalledWith(1, 100);
            expect(result).toEqual(mockCryptos);
        });

        it('should handle errors from data source', async () => {
            const error = new Error('Network error');
            mockDataSource.getCryptocurrencies.mockRejectedValue(error);

            await expect(repository.getCryptocurrencies(1, 100)).rejects.toThrow('Network error');
        });

        it('should use default values of start=1 and limit=50 when not specified', async () => {
            mockDataSource.getCryptocurrencies.mockResolvedValue([]);

            await repository.getCryptocurrencies();

            expect(mockDataSource.getCryptocurrencies).toHaveBeenCalledWith(1, 50);
        });
    });

    describe('getHistoricalPrices', () => {
        it('should fetch historical prices from data source', async () => {
            const mockPrices = [
                { timestamp: Date.now(), price: 50000 },
                { timestamp: Date.now() - 86400000, price: 49000 },
            ];

            mockDataSource.getHistoricalPrices.mockResolvedValue(mockPrices);

            const result = await repository.getHistoricalPrices('bitcoin', 7);

            expect(mockDataSource.getHistoricalPrices).toHaveBeenCalledWith('bitcoin', 7);
            expect(result).toEqual(mockPrices);
        });

        it('should handle errors when fetching historical prices', async () => {
            const error = new Error('API error');
            mockDataSource.getHistoricalPrices.mockRejectedValue(error);

            await expect(repository.getHistoricalPrices('bitcoin', 7)).rejects.toThrow('API error');
        });
    });
});

import { GetCryptocurrenciesUseCase } from '../../usecases/GetCryptocurrenciesUseCase';
import { Cryptocurrency } from '../../entities/Cryptocurrency';

const mockRepository = {
    getCryptocurrencies: jest.fn(),
    getHistoricalPrices: jest.fn(),
};

describe('GetCryptocurrenciesUseCase', () => {
    let useCase: GetCryptocurrenciesUseCase;

    beforeEach(() => {
        useCase = new GetCryptocurrenciesUseCase(mockRepository as any);
        jest.clearAllMocks();
    });

    it('should fetch cryptocurrencies from repository', async () => {
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

        mockRepository.getCryptocurrencies.mockResolvedValue(mockCryptos);

        const result = await useCase.execute(1, 100);

        expect(mockRepository.getCryptocurrencies).toHaveBeenCalledWith(1, 100);
        expect(result).toEqual(mockCryptos);
    });

    it('should use default values of start=1 and limit=50 when not provided', async () => {
        mockRepository.getCryptocurrencies.mockResolvedValue([]);

        await useCase.execute();

        expect(mockRepository.getCryptocurrencies).toHaveBeenCalledWith(1, 50);
    });

    it('should propagate errors from repository', async () => {
        const error = new Error('Network error');
        mockRepository.getCryptocurrencies.mockRejectedValue(error);

        await expect(useCase.execute(1, 100)).rejects.toThrow('Network error');
    });
});

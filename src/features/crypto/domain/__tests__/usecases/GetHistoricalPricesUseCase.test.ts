import { GetHistoricalPricesUseCase } from '../../usecases/GetHistoricalPricesUseCase';
import { HistoricalPrice } from '../../entities/HistoricalPrice';

const mockRepository = {
    getCryptocurrencies: jest.fn(),
    getHistoricalPrices: jest.fn(),
};

describe('GetHistoricalPricesUseCase', () => {
    let useCase: GetHistoricalPricesUseCase;

    beforeEach(() => {
        useCase = new GetHistoricalPricesUseCase(mockRepository as any);
        jest.clearAllMocks();
    });

    it('should fetch historical prices from repository', async () => {
        const mockPrices: HistoricalPrice[] = [
            { timestamp: Date.now(), price: 50000 },
            { timestamp: Date.now() - 86400000, price: 49000 },
        ];

        mockRepository.getHistoricalPrices.mockResolvedValue(mockPrices);

        const result = await useCase.execute('bitcoin', 7);

        expect(mockRepository.getHistoricalPrices).toHaveBeenCalledWith('bitcoin', 7);
        expect(result).toEqual(mockPrices);
    });

    it('should handle different time periods', async () => {
        mockRepository.getHistoricalPrices.mockResolvedValue([]);

        await useCase.execute('ethereum', 30);

        expect(mockRepository.getHistoricalPrices).toHaveBeenCalledWith('ethereum', 30);
    });

    it('should propagate errors from repository', async () => {
        const error = new Error('API error');
        mockRepository.getHistoricalPrices.mockRejectedValue(error);

        await expect(useCase.execute('bitcoin', 7)).rejects.toThrow('API error');
    });
});

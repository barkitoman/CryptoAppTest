import { CryptoRepository } from '../repositories/CryptoRepository';
import { HistoricalPrice } from '../entities/HistoricalPrice';

export class GetHistoricalPricesUseCase {
    constructor(private cryptoRepository: CryptoRepository) { }

    async execute(id: string, days: number): Promise<HistoricalPrice[]> {
        return this.cryptoRepository.getHistoricalPrices(id, days);
    }
}

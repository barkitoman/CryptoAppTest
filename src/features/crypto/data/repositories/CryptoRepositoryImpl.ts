import { Cryptocurrency } from '../../domain/entities/Cryptocurrency';
import { CryptoRepository } from '../../domain/repositories/CryptoRepository';
import CoinMarketCapDataSource from '../../data/datasources/CoinMarketCapDataSource';
import { HistoricalPrice } from '../../domain/entities/HistoricalPrice';

export class CryptoRepositoryImpl implements CryptoRepository {
    constructor(
        private cmcDataSource = CoinMarketCapDataSource,
    ) { }

    async getCryptocurrencies(start: number = 1, limit: number = 50): Promise<Cryptocurrency[]> {
        return this.cmcDataSource.getCryptocurrencies(start, limit);
    }

    async getHistoricalPrices(id: string, days: number): Promise<HistoricalPrice[]> {
        return this.cmcDataSource.getHistoricalPrices(id, days);
    }
}

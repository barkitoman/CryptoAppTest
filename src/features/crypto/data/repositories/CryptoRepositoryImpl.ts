import { Cryptocurrency } from '../../domain/entities/Cryptocurrency';
import { CryptoRepository } from '../../domain/repositories/CryptoRepository';
import CoinMarketCapDataSource from '../../data/datasources/CoinMarketCapDataSource';
import { HistoricalPrice } from '../../domain/entities/HistoricalPrice';

export class CryptoRepositoryImpl implements CryptoRepository {
    constructor(
        private cmcDataSource = CoinMarketCapDataSource,
    ) { }

    async getCryptocurrencies(limit: number = 200): Promise<Cryptocurrency[]> {
        return this.cmcDataSource.getCryptocurrencies(limit);
    }

    async getHistoricalPrices(id: string, days: number): Promise<HistoricalPrice[]> {
        return this.cmcDataSource.getHistoricalPrices(id, days);
    }
}

import { Cryptocurrency } from '../entities/Cryptocurrency';
import { HistoricalPrice } from '../entities/HistoricalPrice';

export interface CryptoRepository {
    getCryptocurrencies(limit: number): Promise<Cryptocurrency[]>;
    getHistoricalPrices(id: string, days: number): Promise<HistoricalPrice[]>;
}

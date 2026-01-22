import { Cryptocurrency } from '../entities/Cryptocurrency';
import { HistoricalPrice } from '../entities/HistoricalPrice';

export interface CryptoRepository {
    getCryptocurrencies(start: number, limit: number): Promise<Cryptocurrency[]>;
    getHistoricalPrices(id: string, days: number): Promise<HistoricalPrice[]>;
}
